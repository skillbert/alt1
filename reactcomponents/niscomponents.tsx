import * as React from "react";
import * as ReactDOM from "react-dom";

import "./niscomponents.scss";


export class Tabs extends React.Component<{ initialTab?: string, tabs: { id: string, title: string, node: React.ReactNode }[] }, { tab: string }>{

	constructor(p) {
		super(p);
		this.state = {
			tab: p.initialTab || (p.tabs.length != 0 ? p.tabs[0].id : "")
		};
	}


	setTab(tab: string) {
		this.setState({ tab: tab });
	}

	render() {
		var activetab = this.props.tabs.find(t => t.id == this.state.tab);

		return (
			<React.Fragment>
				<div className="nisseparator">
					{this.props.tabs.map(t => (
						<div className="tab" key={t.id}>{t.title}</div>
					))}
				</div>
				<div style={{ height: "10px" }} />
				<div>
					{activetab && activetab.node}
				</div>
			</React.Fragment>
		);
	}
}

/*

export class MenuButton extends React.Component<{ img: string, spriteOffset?: number, onclick?: React.MouseEventHandler, title?: string }> {
	render() {
		var cl = "nissmallimagebutton";
		if (this.props.spriteOffset) { cl += " offset" + this.props.spriteOffset; }
		return (
			<div title={this.props.title} onClick={this.props.onclick} className="nissmallimagebutton menubutton">
				<div className={cl} style={{ backgroundImage: "url('" + this.props.img + "')" }} />
			</div>
		);
	}
}
*/



export class MenuButton extends React.Component<{ img: string, spriteOffset?: number, onclick?: React.MouseEventHandler, title?: string }> {
	render() {
		var cl = "nismenubutton__inner";
		if (this.props.spriteOffset) { cl += " " + cl + "--offset" + this.props.spriteOffset; }
		return (
			<div title={this.props.title} onClick={this.props.onclick} className="nismenubutton">
				<div className={cl} style={{ backgroundImage: "url('" + this.props.img + "')" }} />
			</div>
		);
	}
}

export class MenuBar extends React.Component {
	render() {
		return (
			<div style={{ width: "100%" }}>
				<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
					{this.props.children}
				</div>
				<div className="nisseperator" style={{ position: "unset" }} />
			</div>
		);
	}
}



