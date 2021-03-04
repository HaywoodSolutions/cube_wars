import SVG from "./SVG";

type CanvasConfig = {
	class?: string,
	width: number,
	height: number,
	viewBox?: [number, number, number, number]
};

export default (canvasConfig: CanvasConfig, children: string[]): string =>
	SVG("svg", canvasConfig.viewBox ? {
		...canvasConfig,
		viewBox: canvasConfig.viewBox.join(' ')
	} : canvasConfig, children);