export default (fields: {[key: string]: any}): string => {
	return Object.keys(fields).reduce((list: string[], key) => {
		list.push(`${key}="${fields[key]}"`);
		return list;
	}, []).join(" ");
};