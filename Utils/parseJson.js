const keyJSON = {
	globalbrightness: 'globalBrightness',
	blackState: 'blackState',
}

export function parseJson(instance, data) {
	const udpString = data.toString('utf-8', 0, data.length)
	let nIndex = udpString.indexOf(keyJSON.globalbrightness)
	if (nIndex > 0) {
		const brightValue = Number(udpString.substring(nIndex + keyJSON.globalbrightness.length + 3, udpString.length - 1))
		instance.log('info', 'parseJson： brightvalue = ' + brightValue)
		instance.states.globalbrightness = brightValue
	}

	nIndex = udpString.indexOf(keyJSON.blackState)
	if (nIndex > 0) {
		const black = udpString.substring(nIndex + keyJSON.blackState.length + 4, udpString.length - 2)
		instance.log('info', 'parseJson： blackState = ' + black)

		if (black == 'black') {
			instance.states.blackState = true
		} else if (black == 'unBlack') {
			instance.states.blackState = false
		} else {
		}
		;``
		instance.checkFeedbacks('ScreenBlack')
	}
}

export function getNewVariableValue(instance, data) {
	const udpString = data.toString('utf-8', 0, data.length)
	const jsonArray = udpString.split(':')
	const keyFragment = jsonArray[0].substr(2, jsonArray[0].length - 3)
	const valueFragment = jsonArray[1].substr(2, jsonArray[1].length - 4)
	const newVariableValue = valueFragment
	const newVariableValues = {
		[keyFragment]: newVariableValue,
	}

	// nIndex = udpString.indexOf(keyJSON.blackState)
	// if (keyFragment == blackState) {
	// 	const black = valueFragment
	// 	instance.log('info', 'parseJson： blackState = ' + black)

	// 	if (black == 'black') {
	// 		instance.states.blackState = true
	// 	} else if (black == 'unBlack') {
	// 		instance.states.blackState = false
	// 	} else {
	// 	}

	// 	instance.checkFeedbacks('ScreenBlack')
	// }

	return newVariableValues
}
