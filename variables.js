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

	return variables
}
