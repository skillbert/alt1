import * as React from "react";
export declare function show<T extends {
    [id: string]: any;
}>(initialValue: T, renderorjsx: React.ReactElement<any> | ((state: T) => React.ReactElement<any>)): {
    el: HTMLDivElement;
    close: typeof close;
    value: T;
    onChange: (value: T) => any;
    onClose: () => any;
    rerender: () => any;
    setValue: <N extends keyof T>(n: N, v: T[N]) => any;
};
declare type ContainerProps<T> = {
    width?: string;
    type?: "nis" | "fakepopup";
    title: string;
    initialValue?: T;
    onChange?: (v: T) => any;
    onClose?: () => any;
    key?: string;
    children: any[];
};
export declare class Container<T extends {
    [key: string]: any;
} = any> extends React.Component<ContainerProps<T>, T> {
    constructor(props: any);
    subChanged(value: any, name: string): void;
    componentDidUpdate(_oldprops: any, oldstate: any): void;
    render(): JSX.Element;
}
export interface ItemProps {
    flexgrow?: number | string;
}
export interface InputProps<T = any> {
    name?: string;
    value?: T;
    onChange?: (newvalue: T, name: string) => any;
}
declare abstract class Item<P = {}, S = {}, SS = any> extends React.Component<P & ItemProps, S, SS> {
    static type: string;
    getStyle(): React.CSSProperties;
}
declare abstract class Sub<P = {}, S = {}, SS = any> extends Item<P, S, SS> {
    static type: string;
}
export declare abstract class Input<T = any, P = {}, S = {}, SS = any> extends Item<P & InputProps<T>, S, SS> {
    triggerChange(newvalue: T): void;
    static type: string;
    constructor(props: any);
}
export declare class Hr extends Item {
    render(): JSX.Element;
}
export declare class Button extends Item<{
    onClick?: React.MouseEventHandler;
}> {
    render(): JSX.Element;
}
export declare class Text extends Item {
    render(): JSX.Element;
}
export declare class Head extends Item {
    render(): JSX.Element;
}
export declare class Hor extends Sub {
    static type: string;
    render(): JSX.Element;
}
export declare class Range extends Input<number, {
    min?: number;
    max?: number;
    step?: number;
}> {
    render(): JSX.Element;
}
export declare class Number extends Input<number, {
    min?: number;
    max?: number;
    step?: number;
}> {
    render(): JSX.Element;
}
export declare class String extends Input<string, {
    password?: boolean;
}> {
    render(): JSX.Element;
}
export declare class Boolean extends Input<boolean> {
    render(): JSX.Element;
}
export declare class DropDown extends Input<string, {
    options: {
        [id: string]: string;
    };
}> {
    render(): JSX.Element;
}
export {};
