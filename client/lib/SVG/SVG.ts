import Fields from "./Fields";

export default (flag: string, fields: {[field: string]: any}, children: string[] = []) => {
  console.log(children);
  return `<${flag} ${Fields(fields)} ${children.length > 0 ? `>${children.join('')}</${flag}` : "/"}>`;
}