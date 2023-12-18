const CHOICES_END = [
	{ id: '', label: 'None' },
	{ id: '\n', label: 'LF - \\n (Common UNIX/Mac)' },
	{ id: '\r\n', label: 'CRLF - \\r\\n (Common Windows)' },
	{ id: '\r', label: 'CR - \\r (Old MacOS)' },
	{ id: '\x00', label: 'NULL - \\x00 (Can happen)' },
	{ id: '\n\r', label: 'LFCR - \\n\\r (Just stupid)' },
]

export function getActions(self) {
	let actions = {}

	actions['send'] = {
		name: 'Send Custom Command',
		options: [
			{
				type: 'textinput',
				id: 'id_send',
				label: 'Command:',
				tooltip: 'Use %hh to insert Hex codes',
				default: '',
				useVariables: true,
			},
			{
				type: 'dropdown',
				id: 'id_end',
				label: 'Command End Character:',
				default: '\n',
				choices: CHOICES_END,
			},
		],
		callback: async (action) => {
			const cmd = unescape(await self.parseVariablesInString(action.options.id_send))

			if (cmd != '') {
				/*
				 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
				 * sending a string assumes 'utf8' encoding
				 * which then escapes character values over 0x7F
				 * and destroys the 'binary' content
				 */
				const sendBuf = Buffer.from(cmd + action.options.id_end, 'utf-8')
				if (self.udp !== undefined) {
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					self.udp.send(sendBuf)
				}
			}
		},
	}

	actions['OpenAllScreen'] = {
		name: 'Open All Screen',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"OpenAllScreen"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'OpenAllScreen cmd Error')
			}
		},
	}

	actions['AdjustGlobalBrightness'] = {
		name: 'Adjust Global Brightness',
		options: [
			{
				id: 'BrightValue',
				type: 'number',
				label: 'Target Value',
				default: 50,
				min: -100,
				max: 100,
			},
		],
		callback: async (action) => {
			const cmdStr = '{"cmd":"globalBrightness","param":' + Number(action.options.BrightValue) + '}'
			const sendBuf = Buffer.from(cmdStr, 'utf-8')
			try {
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'Adjust Global Brightness cmd Error' + cmdStr)
			}
		},
	}

	actions['GetCurrentBright'] = {
		name: 'Get Current Global Brightness',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"getGlobalBrightness"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'getGlobalBrightness cmd Error')
			}
		},
	}

	actions['GetScreenBlackState'] = {
		name: 'Get Screen Black State',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"getBlackAll"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'GetScreenBlackState cmd Error')
			}
		},
	}

	return actions
}
