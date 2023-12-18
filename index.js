import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper, UDPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActions } from './actions.js'
import { getVariables } from './variables.js'
import { GetFeedbacks } from './feedbacks.js'
import { getNewVariableValue, parseJson } from './Utils/parseJson.js'

class GenericUdpInstance extends InstanceBase {
	async init(config) {
		this.config = config
		this.states = {}
		this.setActionDefinitions(getActions(this))
		this.setFeedbackDefinitions(GetFeedbacks(this))
		this.setVariableDefinitions(getVariables(this))

		await this.configUpdated(config)
	}

	async configUpdated(config) {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}

		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config
		this.init_udp()
	}

	async destroy() {
		if (this.socket) {
			this.socket.destroy()
		} else if (this.udp) {
			this.udp.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return ConfigFields
	}

	init_udp() {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.udp = new UDPHelper(this.config.host, this.config.port)

			this.udp.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			// If we get data, thing should be good
			this.udp.on('listening', () => {
				this.updateStatus(InstanceStatus.Ok)
			})

			this.udp.on('data', (msg) => {
				const newValue = getNewVariableValue(this, msg)
				// this.log('info', 'Get New Data: ' + newValue)
				// this.setVariableValues({ lastMessage: msg.toString('utf-8', 0, msg.length) })
				this.setVariableValues(newValue)
				// this.log('info', 'Get Data: ' + msg.toString('utf-8', 0, msg.length))
				// parseJson(this, msg)
			})

			this.udp.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}
}

runEntrypoint(GenericUdpInstance, [])
