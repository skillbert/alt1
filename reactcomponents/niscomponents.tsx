import * as React from "react";
import * as ReactDOM from "react-dom";

//require("./niscomponents.css");


export class MenuButton extends React.Component<{ img: string, spriteOffset?: number, onclick?: React.MouseEventHandler ,title?:string}> {
	render() {
		var cl = "nissmallimagebutton";
		if (this.props.spriteOffset) { cl += " offset" + this.props.spriteOffset; }
		return (
			<div title={this.props.title} onClick={this.props.onclick} className="nissmallimagebutton menubutton">
				<div className={cl} style={{ backgroundImage: this.props.img }} />
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
				<div className="nisseperator" style={{position:"unset"}} />
			</div>
		);
	}
}



