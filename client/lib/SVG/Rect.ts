import SVGShape from './SVGShape';
import { StyleConfig } from './Style';

type RectConfig = {
	x?: number,
	y?: number,
	width: number,
	height: number,
	rx?: number,
	ry?: number
};

export default (rectConfig: RectConfig, style: StyleConfig): string =>
	SVGShape("rect", rectConfig, style);