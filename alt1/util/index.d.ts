/// <reference types="react" />
export declare function copyToClipboard(str: string): void;
export declare type DragHandlerState = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    sx: number;
    sy: number;
    end: boolean;
    start: boolean;
};
export declare function newDragHandler(mousedownevent: MouseEvent | React.MouseEvent, movefunc: (state: DragHandlerState, end: boolean) => any, endfunc: (state: DragHandlerState, end: boolean) => any, mindist: number): void;
export declare function startCaps(s: string): string;
export declare function delay(t: number, ...args: any[]): Promise<{}>;
export declare function uuid(): string;
export declare type ObjMap<T> = {
    [id: string]: T;
};
export declare function initArray<T>(l: number, val: T): T[];
export declare function stringdownload(filename: string, text: string): void;
export declare function filedownload(filename: string, url: string): void;
export declare function listdate(time: number): string;
export declare function dlpagejson<D = any>(url: string, obj: any, func: (data: D) => any, errorfunc: () => any): void;
export declare namespace OldDom {
    function id(id: string): HTMLElement;
    function clear(el: HTMLElement): void;
    type ObjAttr = {
        [prop: string]: any;
    };
    type ArrCh = (HTMLElement | string)[];
    function div(strClass?: string, objAttr?: ObjAttr, arrayChildren?: ArrCh): HTMLElement;
    function div(objAttr: ObjAttr, arrayChildren?: ArrCh): HTMLElement;
    function div(strClass: string, arrayChildren?: ArrCh): HTMLElement;
    function div(arrayChildren: ArrCh): HTMLElement;
    function frag(...args: (HTMLElement | string | number | null)[]): DocumentFragment;
    function put(el: HTMLElement | string, content: Node): void;
}
export declare function smallu(nr: number, gp?: boolean): string;
export declare function jsonTryDecode(str: string): any;
export declare function urlArgs(url?: string): StringMap<string>;
export declare function padLeft(str: string | number, n: number, char?: string): string;
