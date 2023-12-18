export function getVariables(self) {
	const variables = []

	variables.push({
		name: 'The last received udp message',
		variableId: 'lastMessage',
	})

	variables.push({
		name: 'The last received udp timestamp',
		variableId: 'lastTimestamp',
	})

	variables.push({
		name: '当前播放的场景名称',
		variableId: 'currentSceneName',
	})

	variables.push({
		name: '黑屏状态',
		variableId: 'blackState',
	})

	return variables
}
