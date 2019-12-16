import * as React from "react";
import * as ReactDOM from "react-dom";

require("./promptbox.scss");


export function show<T extends { [id: string]: any }>(initialValue: T, renderorjsx: React.ReactElement<any> | ((state: T) => React.ReactElement<any>)) {
	//TODO rewrite this, this is stupid
	var el = document.createElement("div");
	el.classList.add("modalcontainer");
	document.body.appendChild(el);
	type Comp = React.ReactElement<ContainerProps<T>>;

	var render: (state: T) => Comp;
	if (typeof renderorjsx != "function") {
		var jsx = renderorjsx;
		render = state => jsx;
	} else {
		render = renderorjsx;
	}


	var r = {
		el,
		close,
		value: initialValue,
		onChange: null as (value: T) => any,
		onClose: null as () => any,
		rerender: null as () => any,
		setValue: null as <N extends keyof T>(n: N, v: T[N]) => any
	};
	r.close = function () {
		ReactDOM.unmountComponentAtNode(el);
		document.body.removeChild(el);
		if (r.onClose) { r.onClose(); }
	}
	r.setValue = function (n, v) {
		r.value[n] = v;
		if (r.onChange) { r.onChange(r.value); }
		r.rerender();
	}

	var recurChildren = (children: React.Component[]) => {
		return React.Children.map(children, (ch: any) => {
			if (ch.type.type == "container") {
				var newch = recurChildren(ch.props.children);
				return React.cloneElement(ch, { children: newch });
			}
			if (ch.type.type == "input" || ch.type.type == "select") {
				let props = ch.props as InputProps;
				if (props.name) {
					var oldOnChange = props.onChange;
					return React.cloneElement(ch, {
						value: r.value[props.name],
						onChange: (v, n) => {
							(r.value as any)[n as any] = v;//TODO what is wrong here?
							if (oldOnChange) { oldOnChange(v, n); }
							r.setValue(n, v);
						}
					});
				}
			}
			return ch;
		});
	}

	r.rerender = () => {
		var jsx = render(r.value);
		var lastrender = jsx;
		jsx = React.cloneElement(jsx, {
			onChange: function (v) {
				r.value = v;
				if (lastrender.props.onChange) { lastrender.props.onChange(v); }
				if (r.onChange) { r.onChange(v); }
			},
			onClose: function () {
				if (lastrender.props.onClose) { lastrender.props.onClose(); }
				r.close();
			},
			initialValue: initialValue
		}, ...recurChildren(jsx.props.children));

		ReactDOM.render(jsx, el);
	}
	r.rerender();
	return r;
}

type ContainerProps<T> = { width?: string, type?: "nis" | "fakepopup", title: string, initialValue?: T, onChange?: (v: T) => any, onClose?: () => any, key?: string, children: any[] };

export class Container<T extends { [key: string]: any }=any> extends React.Component<ContainerProps<T>, T> {
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
		var style = { width: this.props.width || "300px" };

		if (this.props.type == "nis") {
			return (
				<div className="pb2 pb2_nis nisborder" style={style}>
					<div className="nisclosebutton" onClick={this.props.onClose} style={{ position: "absolute", top: "4px", right: "4px" }} />
					<div style={{ fontSize: "18px", paddingLeft: "5px", marginBottom: "-3px" }}>{this.props.title}</div>
					<div className="nisseperator" style={{ position: "initial" }} />
					{this.props.children}
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
						{this.props.children}
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
	name?: string,
	value?: T,
	onChange?: (newvalue: T, name: string) => any
};
abstract class Item<P={}, S={}, SS=any> extends React.Component<P & ItemProps, S, SS>{
	static type = "passive";
	getStyle() {
		var r = {} as React.CSSProperties;
		if (this.props.flexgrow != undefined) {
			r.flex = `${this.props.flexgrow} 1 0%`;
			r.width = "0px";
		}

		return r;
	}
}

abstract class Sub<P={}, S={}, SS=any> extends Item<P, S, SS> {
	static type = "container";
}

export abstract class Input<T=any, P={}, S={}, SS=any> extends Item<P & InputProps<T>, S, SS>{
	triggerChange(newvalue: T) {
		this.props.onChange(newvalue, this.props.name);
	}
	static type = "input";
	constructor(props) {
		super(props);
		this.triggerChange = this.triggerChange.bind(this);
	}
}

export class Hr extends Item{
	render(){
		return <div className="pb2-hr"></div>
	}
}

export class Button extends Item<{ onClick?: React.MouseEventHandler }> {
	render() {
		return <div className="pb2-button" onClick={this.props.onClick as any} style={this.getStyle()}>{this.props.children}</div>;
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

export class Range extends Input<number, { min?: number, max?: number, step?: number }>{
	render() {
		return (
			<label style={this.getStyle()} >
				<input min={this.props.min} max={this.props.max} step={this.props.step} className="pb2-range" type="range" value={this.props.value} onChange={e => this.triggerChange(+e.target.value)}/>
				{this.props.value}
			</label>
		);
	}
}

export class Number extends Input<number, { min?: number, max?: number, step?: number }>{
	render() {
		return <input min={this.props.min} max={this.props.max} step={this.props.step} className="pb2-number" type="number" value={this.props.value} onChange={e => this.triggerChange(+e.target.value)} style={this.getStyle()} />;
	}
}

export class String extends Input<string, { password?: boolean }>{
	render() {
		return <input className="pb2-string" type={this.props.password ? "password" : "text"} value={this.props.value} onChange={e => this.triggerChange(e.target.value)} style={this.getStyle()} />;
	}
}

export class Boolean extends Input<boolean>{
	render() {
		return (
			<label className="pb2-boolean" style={this.getStyle()}>
				<input type="checkbox" checked={this.props.value} onChange={e => this.triggerChange(e.target.checked)} />
				{this.props.children}
			</label>
		);
	}
}

export class DropDown extends Input<string, { options: { [id: string]: string } }>{
	render() {
		var options = [];
		for (var id in this.props.options) {
			options.push(<option value={id} key={id}>{this.props.options[id]}</option>);
		}
		return <select className="pb2-dropdown" value={this.props.value} style={this.getStyle()} onChange={e => this.triggerChange(e.target.value)}>{options}</select>;
	}
}



