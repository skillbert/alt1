import * as React from "react";
import * as ReactDOM from "react-dom";
import { CSSProperties } from "react";

require("./niscomponents.css");

export type PromptBoxFrame<T=any> = { el: HTMLElement, close: () => any, value: T, onChange: (v: T) => any };
export function show<T extends { [id: string]: any }>(initialValue: T, jsx):PromptBoxFrame<T> {
	var el = document.createElement("div");
	el.classList.add("modalcontainer");
	document.body.appendChild(el);


	var close = function () {
		document.body.removeChild(el);
	}

	var value = Object.assign({}, jsx.props.initialValue);
	var r = { el, close, value, onChange: null as (value: T) => any };

	var oldonchange = jsx.props.onChange;
	var oldonclose = jsx.props.onClose;
	jsx = React.cloneElement(jsx, {
		onChange: (v: any) => {
			r.value = v;
			if (oldonchange) { oldonchange(v); }
			if (r.onChange) { r.onChange(v); }
		},
		onClose: () => {
			if (oldonclose) { oldonclose(); }
			r.close();
		},
		initialValue: initialValue
	});
	ReactDOM.render(jsx, el);

	return r;
}



export class Container<T extends { [key: string]: any }=any> extends React.Component<{width?:string, type?:"nis"|"fakepopup", title: string, initialValue?: T, onChange?: (T) => any,onClose?:()=>any }, T> {
	constructor(props) {
		super(props);
		this.state = Object.assign({}, this.props.initialValue);
		this.props.onChange(this.state);
		this.subChanged = this.subChanged.bind(this);
	}

	subChanged(value: any, name: string) {
		this.setState({ [name]: value });
	}

	componentDidUpdate(_oldprops, oldstate) {
		if (this.state != oldstate) {
			this.props.onChange(this.state);
		}
	}

	render() {
		var recurChildren =  (comp: React.Component) =>{
			return React.Children.map(comp.props.children, (ch: any) => {
				if (ch.type.type == "container") {
					let props = ch.props as React.Props<{}>;
					var newch = recurChildren(ch);
					return React.cloneElement(ch, { children: newch });
				}
				if (ch.type.type == "input") {
					let props = ch.props as InputProps;
					if (props.name) {
						var oldOnChange = props.onChange;
						return React.cloneElement(ch, {
							value: this.state[props.name],
							onChange: (v, n) => {
								this.subChanged(v, n);
								if (oldOnChange) { oldOnChange(v, n); }
							}
						});
					}
				}
				return ch;
			});
		}
		var children = recurChildren(this);
		var style = { width: this.props.width || "300px" };

		if (this.props.type == "nis") {
			return (
				<div className="pb2 pb2_nis nisborder" style={style}>
					<div className="nisclosebutton" onClick={this.props.onClose} style={{ position: "absolute", top: "4px", right: "4px" }} />
					<div style={{ fontSize: "18px", paddingLeft: "5px", marginBottom: "-3px" }}>{this.props.title}</div>
					<div className="nisseperator" style={{ position: "initial" }} />
					{children}
				</div>
			);
		} else {
			return (
				<div className="pb2 pb2_fakepopup" style={style}>
					<div>
						<div className="pb2_fakepopup-exit" onClick={this.props.onClose} />
						<div className="pb2_fakepopup-title">{this.props.title}</div>
					</div>
					<div style={{ margin: "5px 2px 2px" }}>
						{children}
					</div>
				</div>
			);
		}

	}
}


export interface ItemProps {
	flexgrow?: number | string
};
export interface InputProps<T=any> {
	name: string,
	value?: T,
	onChange?: (newvalue: T, name: string) => any
};
abstract class Item<P={}, S={}, SS=any> extends React.Component<P & ItemProps, S, SS>{
	static type = "passive";
	getStyle() {
		var r = {} as CSSProperties;
		if (this.props.flexgrow != undefined) {
			r.flex = `${this.props.flexgrow} 1 0%`;
			r.width = "0px";
		}
		return r;
	}
}

abstract class Sub<P={}, S={},SS=any> extends Item<P,S,SS> {
	static type = "container";
}

abstract class Input<T=any, P={}, S={}, SS=any> extends Item<P & InputProps<T>, S, SS>{
	triggerChange(newvalue: T) {
		this.props.onChange(newvalue, this.props.name);
	}
	static type = "input";
	constructor(props) {
		super(props);
		this.triggerChange = this.triggerChange.bind(this);
	}
}

export class Button extends Item<{onClick?:React.MouseEventHandler}> {
	render() {
		return <div className="pb2-button" onClick={this.props.onClick} style={this.getStyle()}>{this.props.children}</div>;
	}
}

export class Text extends Item {
	render() {
		return <div className="pb2-text" style={this.getStyle()}>{this.props.children}</div>;
	}
}

export class Head extends Item {
	render() {
		return <div className="pb2-header" style={this.getStyle()}>{this.props.children}</div>;
	}
}

export class Hor extends Sub {
	static type = "container";
	render() {
		return <div className="pb2-flex-h">{this.props.children}</div>;
	}
}

export class Number extends Input<number, {}>{
	render() {
		return <input className="pb2-number" type="number" value={this.props.value} onChange={e => this.triggerChange(+e.target.value)} style={this.getStyle()} />;
	}
}

export class String extends Input<string, { password?: boolean }>{
	render() {
		return <input className="pb2-string" type={this.props.password ? "password" : "text"} value={this.props.value} onChange={e => this.triggerChange(e.target.value)} style={this.getStyle()} />;
	}
}

export class DropDown extends Input<string, { options: { [id: string]: string } }>{
	render() {
		var options = [];
		for (var id in this.props.options) {
			options.push(<option value={id}>{this.props.options[id]}</option>);
		}
		return <select className="pb2-dropdown" value={this.props.value} style={this.getStyle()}>{options}</select>;
	}
}



