import StyleGen, { StyleConfig } from "./Style";
import SVG from "./SVG";

export default (flag: string, fields: {[field: string]: any}, styleConfig: StyleConfig = {}) =>
	SVG(flag, {...fields, ...StyleGen(styleConfig)});