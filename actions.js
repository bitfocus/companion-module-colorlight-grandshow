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

	//查询中控服务是否存在

	/*-----------------------软件控制-----------------------*/

	//关机
	actions['ShutDown'] = {
		name: 'Shut Down',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"shutdown"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'Shut Down cmd Error')
			}
		},
	}

	//切换工程
	actions['SwitchProject'] = {
		name: 'Switch Project',
		options: [
			{
				id: 'projectOrder',
				type: 'number',
				label: 'Target Value',
				default: 1,
			},
		],
		callback: async (action) => {
			const cmdStr = '{"cmd":"switchProject","param":' + Number(action.options.projectOrder) + '}'
			const sendBuf = Buffer.from(cmdStr, 'utf-8')
			try {
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'Switch Project cmd Error' + cmdStr)
			}
		},
	}

	//打开工程(暂时采用输入路径的方式，后续可以配合查询最近工程来选择打开)
	actions['OpenProject'] = {
		name: 'Open Project',
		options: [
			{
				id: 'projectPath',
				type: 'textinput',
				label: 'Absolute Project Path',
			},
		],
		callback: async (action) => {
			const cmdStr = '{"cmd":"openProject","param":' + '"' + action.options.projectPath + '"' + '}'
			const sendBuf = Buffer.from(cmdStr, 'utf-8')
			try {
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'Switch Project cmd Error' + cmdStr)
			}
		},
	}

	//关闭软件
	actions['CloseSoftware'] = {
		name: 'Close The Software',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"CloseSoftware"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'CloseSoftware cmd Error')
			}
		},
	}

	//打开所有屏幕并连接
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

	//关闭所有屏幕，不会断开连接
	actions['CloseAllScreen'] = {
		name: 'Close All Screens',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"CloseAllScreen"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'CloseAllScreen cmd Error')
			}
		},
	}

	/*-----------------------软件控制-----------------------*/

	/*-----------------------亮度控制-----------------------*/

	//调整全局亮度
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

	//获取当前全局亮度
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

	//获取黑屏状态
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

	/*-----------------------亮度控制-----------------------*/

	/*-----------------------场景播放-----------------------*/

	//播放下一场景
	actions['PlayNext'] = {
		name: 'Play Next Scene',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"PlayNext"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'PlayNext cmd Error')
			}
		},
	}

	//播放上一场景
	actions['PlayLast'] = {
		name: 'Play Previews Scene',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"PlayLast"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'PlayLast cmd Error')
			}
		},
	}

	//按列号播放场景
	actions['PlayScene'] = {
		name: 'Play Scene Number',
		options: [
			{
				id: 'sceneNumber',
				type: 'number',
				label: 'Scene Number',
				default: 1,
				min: 1,
				max: 100,
			},
		],
		callback: async (action) => {
			const cmdStr = '{"cmd":"play","param":' + Number(action.options.sceneNumber) + '}'
			const sendBuf = Buffer.from(cmdStr, 'utf-8')
			try {
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'Play Scene cmd Error' + cmdStr)
			}
		},
	}

	//暂停播放
	actions['PauseScene'] = {
		name: 'Pause Scene',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"pauseAll"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'pauseAll cmd Error')
			}
		},
	}

	//停止播放
	actions['StopScene'] = {
		name: 'Stop Scene',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"stop"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'Stop cmd Error')
			}
		},
	}

	/*-----------------------场景播放-----------------------*/

	/*-----------------------HDR开关-----------------------*/

	//开启HDR
	actions['EnableHDR'] = {
		name: 'HDR Enable',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"openHDR"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'openHDR cmd Error')
			}
		},
	}

	//关闭HDR
	actions['DisableHDR'] = {
		name: 'HDR Disable',
		options: [],
		callback: async (action) => {
			const sendBuf = Buffer.from('{"cmd":"closeHDR"}', 'utf-8')
			try {
				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'closeHDR cmd Error')
			}
		},
	}

	/*-----------------------HDR开关-----------------------*/

	/*-----------------------音量控制-----------------------*/

	//调整全局音量
	actions['GlobalVolume'] = {
		name: 'Adjust Global Volume',
		options: [
			{
				id: 'globalVolume',
				type: 'number',
				label: 'Global Volume',
				default: 80,
				min: 0,
				max: 100,
			},
		],
		callback: async (action) => {
			const cmdStr = '{"cmd":"globalVolume","param":' + Number(action.options.globalVolume) + '}'
			const sendBuf = Buffer.from(cmdStr, 'utf-8')
			try {
				self.udp.send(sendBuf)
			} catch (error) {
				self.log('error', 'globalVolume cmd Error' + cmdStr)
			}
		},
	}

	/*-----------------------音量控制-----------------------*/
	return actions
}
