import { Regex } from '@companion-module/base'

export const ConfigFields = [
	{
		type: 'static-text',
		id: 'info',
		label: 'Information',
		width: 12,
		value: `
				<div class="alert alert-danger">
						<ul>
							<li>This module will allow you to control the following Colorlight products: GrandShow.
						</ul>
				</div>
			`,
	},
	{
		type: 'textinput',
		id: 'host',
		label: 'Target IP',
		width: 8,
		regex: Regex.IP,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Target Port',
		width: 4,
		default: 30303,
		regex: Regex.PORT,
	},
]
