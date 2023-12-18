import { combineRgb } from '@companion-module/base'
import { log } from 'console'

export function GetFeedbacks(self) {
	const feedbacks = {}

	const ColorWhite = combineRgb(255, 255, 255)
	const ColorBlack = combineRgb(0, 0, 0)
	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)
	const ColorOrange = combineRgb(255, 102, 0)

	feedbacks['ScreenBlack'] = {
		type: 'advanced',
		name: 'Screen Black Status',
		description: 'If Black status change, change the style of the button',
		options: [
			{
				type: 'colorpicker',
				label: 'Foreground color (Black)',
				id: 'fg',
				default: ColorWhite,
			},
			{
				type: 'colorpicker',
				label: 'Background color (Black)',
				id: 'bg',
				default: ColorRed,
			},
			{
				type: 'colorpicker',
				label: 'Foreground color (unBlack)',
				id: 'fg_',
				default: ColorWhite,
			},
			{
				type: 'colorpicker',
				label: 'Background color (unBlack)',
				id: 'bg_',
				default: ColorGreen,
			},
		],
		callback: (feedback) => {
			if (self.states.blackState) {
				return { color: feedback.options.fg, bgcolor: feedback.options.bg }
			} else {
				return { color: feedback.options.fg_, bgcolor: feedback.options.bg_ }
			}
		},
	}
	return feedbacks
}
