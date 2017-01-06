import {Base} from "./../base.js";
import {numberMap} from "./../../helpers/enums.js";


export class Fields extends Base {
	getClassList ({attrs}) {
		return [
			attrs.grouped && "grouped",
			numberMap[attrs.fieldCount],
			attrs.equalWidth && "equal width",
			attrs.inline && "inline",
			"fields"
		];
	}
}

export const fields = new Fields();
