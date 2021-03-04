export interface StyleConfig {
	fill?: string,
	fillOpacity?: number
};

export default (style: StyleConfig): {[key: string]: string|number} => {
	let result: {[key: string]: string|number} = {};
	if (style.fill) 
		result.fill = style.fill;
	if (style.fillOpacity && style.fillOpacity > 0 && style.fillOpacity < 1) 
		result["fill-opacity"] = style.fillOpacity;
	return result;
};