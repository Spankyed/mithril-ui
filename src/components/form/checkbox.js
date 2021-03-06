import _ from "mithril";
import {Field} from "./field.js";
import {required, within, validate, isArray} from "validatex";

const TYPES = ["slider", "toggle"];

export class Checkbox extends Field {
	attrSchema = {
		model: required(true),
		label: required(true),
		value: required(true),
		multiple: required(false),
		type: [required(false), within(TYPES)]
	}

	validateAttrs (attrs) {
		let errors = validate(attrs, this.attrSchema) || {};
		if (attrs.multiple && attrs.model()) {
			let err = validate(attrs.model(), isArray());
			if (err) {
				errors["default"] = err;
			}
		}
		if (Object.keys(errors).length) {
			throw Error(JSON.stringify(errors));
		}
	}

	getDefaultAttrs (vnode) {
		let attrs = super.getDefaultAttrs(vnode);
		attrs.multiple = false;
		return attrs;
	}

	setValue (attrs) {
		if (!attrs.multiple) {
			attrs.model.setAndValidate(!attrs.model());
		}
		else {
			let val = attrs.model() || [];
			let index = val.indexOf(attrs.value);
			if (index > -1) {
				val.splice(index, 1);
			}
			else {
				val.push(attrs.value);
			}
			attrs.model.setAndValidate(val);
		}
	}

	shouldCheck(attrs) {
		if (!attrs.multiple) {
			return attrs.model() === attrs.value;
		}
		return (attrs.model() || []).indexOf(attrs.value) > -1;
	}

	getLabelAppend (attrs) {
		if(attrs.help && !attrs.model.errors()) {
			return _('label.help', attrs.help);
		}
		else if(attrs.model.error() && !attrs.hideError) {
			return _('label.error', attrs.model.error());
		}
		return null;
	}

  view ({attrs, children, state}) {
		attrs.rootAttrs.onclick = this.setValue.bind(this, attrs);

		let checkboxClasses = [];
		this.shouldCheck(attrs) && checkboxClasses.push("checked");
		attrs.type && checkboxClasses.push(attrs.type);

    return _('div', attrs.rootAttrs,
             _(".ui.checkbox", {className: checkboxClasses.join(" ")},
               _("input.hidden[type=checkbox][tabindex=0]", {checked: this.shouldCheck(attrs)}),
               _("label", attrs.label)),
             this.getLabelAppend(attrs));
  }
}
