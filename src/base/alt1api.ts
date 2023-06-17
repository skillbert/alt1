declare global {
	namespace alt1 {
		/**
		 * No info available about this property.
		 */
		var overlay: any;
		/**
		 * Gets the left bound of all screens, usually 0, but can be negative with multiple screens.
		 */
		var screenX: number;
		/**
		 * Gets the Top bound of all screens, usually 0, but can be negative with multiple screens.
		 */
		var screenY: number;
		/**
		 * Gets the width of the union of all srceens.
		 */
		var screenWidth: number;
		/**
		 * Gets the height of the union of all srceens.
		 */
		var screenHeight: number;
		/**
		 * Gets a string represention of the current version of Alt1.
		 */
		var version: string;
		/**
		 * Gets a integer that represents the current version. (major * 1000 * 1000 + minor * 1000 + build) 1.2.3 -> 1002003.
		 */
		var versionint: number;
		/**
		 * Gets the maximum amount of bytes that can be transfered in a single function call. The wrapper library uses this to split up large image transfers.
		 */
		var maxtransfer: number;
		/**
		 * Gets the name of the current skin.
		 */
		var skinName: string;
		/**
		 * Gets what capture methods is currently being used
		 */
		var captureMethod: string;
		/**
		 * Gets the adviced minimum time between screen captures
		 */
		var captureInterval: number;
		/**
		 * Gets the X-coord of the runescape client area when rs is linked. Use rsLinked to determine if rs is linked.
		 */
		var rsX: number;
		/**
		 * Gets the Y-coord of the runescape client area when rs is linked. Use rsLinked to determine if rs is linked.
		 */
		var rsY: number;
		/**
		 * Gets the width of the runescape client area when rs is linked. Use rsLinked to determine if rs is linked.
		 */
		var rsWidth: number;
		/**
		 * Gets the height of the runescape client area when rs is linked. Use rsLinked to determine if rs is linked.
		 */
		var rsHeight: number;
		/**
		 * Gets the DPI scaling level of the rs window in windows 8.1 or 10, returns 0 when the rs window is not linked.
		 */
		var rsScaling: number;
		/**
		 * Gets if the runescape window is currently detected by Alt1.
		 */
		var rsLinked: boolean;
		/**
		 * Gets if the current page is handled as an installed app.
		 */
		var permissionInstalled: boolean;
		/**
		 * Gets is the current page has gamestate permission.
		 */
		var permissionGameState: boolean;
		/**
		 * Gets is the current page has overlay permission.
		 */
		var permissionOverlay: boolean;
		/**
		 * Gets is the current page has pixel permission
		 */
		var permissionPixel: boolean;
		/**
		 * Gets the position of the mouse is it is inside the runescape client, use a1lib.mousePosition() for an object with {x,y}. (x=r>>16, y=r&0xFFFF)
		 * [Gamestate] permission required.
		 */
		var mousePosition: number;
		/**
		 * Returns wether the runescape window is currently the active window.
		 * [Gamestate] permission required.
		 */
		var rsActive: boolean;
		/**
		 * Gets the time in milliseconds since the last click in the runescape window.
		 * [Gamestate] permission required.
		 */
		var rsLastActive: number;
		/**
		 * Gets the timestamp of the last world hop recorded by Alt1.
		 * [Gamestate] permission required.
		 */
		var lastWorldHop: number;
		/**
		 * Gets the current world that the player is logged in to. Returns -1 when the player is not logged in or in the lobby. Some times also returns -1 on world with weird proxy setups (aus)
		 * [Gamestate] permission required.
		 */
		var currentWorld: number;
		/**
		 * Gets the ping of the current connected game server.
		 * [Gamestate] permission required.
		 */
		var rsPing: number;
		/**
		 * Returns the detected fps of runescape
		 * [Gamestate] permission required.
		 */
		var rsFps: number;
		/**
		 * Gets information about how the app was opened, this includes the recognised text and regex matches if opened by pressing alt+1.
		 * [Installed] permission required.
		 */
		var openInfo: string;
		/**
		 * This function simulates the user starting to drag the frame border. You can use this to add useable control area to the app.
		 */
		function userResize(left: boolean, top: boolean, right: boolean, bottom: boolean): any;
		/**
		 * Tells Alt1 to fetch identification information from the given url. The file should contain a json encoded object with properties about the app.Most importantly it should have a configUrl property that links to itself and a appUrl property that links to the starting page of the app.There is a full appconfig in the example app.
		 */
		function identifyAppUrl(url: string): any;
		/**
		 * Opens the specified link in the default browser.
		 */
		function openBrowser(url: string): boolean;
		/**
		 * Removes the tooltip.
		 * [Installed] permission required.
		 */
		function clearTooltip(): any;
		/**
		 * Cleans up all tasks for this app on Alt1, it stops pixel event listeners and removes possible cursor tooltips.
		 * [Installed] permission required.
		 */
		function clearBinds(): any;
		/**
		 * Sets the status daemon of this app. The given server url is called periodicly with a POST request containing with the state string.The server should respond with a json object that contains the following properties:
		 * string state - the state string to use for the next request.int nextRun - time in milliseconds until the next run.Alert[] alerts - an array containing alerts: {string title, string body}Status[] status - an array containing the status: {string status}
		 * [Overlay] permission required.
		 */
		function registerStatusDaemon(serverUrl: string, state: string): any;
		/**
		 * Returns the current state string of the status daemon of ths app.
		 * [Overlay] permission required.
		 */
		function getStatusDaemonState(): string;
		/**
		 * Shows a notification with the given title and message. The icon argument is reserved and ignored, you should pass an empty string.
		 * [Overlay] permission required.
		 */
		function showNotification(title: string, message: string, icon: string): any;
		/**
		 * Closes the app
		 * [Installed] permission required.
		 */
		function closeApp(): any;
		/**
		 * Sets a tooltip with specified text that chases the cursor. It can be removed by calling this function again with an empty string or using the clearTooltip function.
		 * [Overlay] permission required.
		 */
		function setTooltip(tooltip: string): boolean;
		/**
		 * Changes the Runescape window in the task bar to show a progress bar. Type is the type of bar - 0: reset/normal, 1: in progress, 2: error (red bar), 3: unknown (animated bar), 4: paused (orange bar). Progress is the size of the bar. (0-100)
		 * [Overlay] permission required.
		 */
		function setTaskbarProgress(type: number, progress: number): any;
		/**
		 * Adds a string to the title bar of the rs client. There can only be one per app and you can clear it by calling this function again with an empty string.
		 * [Overlay] permission required.
		 */
		function setTitleBarText(text: string): any;
		/**
		 * Overlays a rectangle on the screen. Color is a 8bpp rgba int which can be created using the mixcolor function in the library. Time is in milliseconds.
		 * [Overlay] permission required.
		 */
		function overLayRect(color: number, x: number, y: number, w: number, h: number, time: number, lineWidth: number): boolean;
		/**
		 * Overlays some text on the screen. Color is a 8bpp rgba int which can be created using the mixcolor function in the library. Time is in milliseconds.
		 * [Overlay] permission required.
		 */
		function overLayText(str: string, color: number, size: number, x: number, y: number, time: number): boolean;
		/**
		 * Overlays some text, with extra options. Centered centers the text horizontally and vertically. Fontname is the name of the font to use, the default sans-serif font is used if this font can not be found.
		 * [Overlay] permission required.
		 */
		function overLayTextEx(str: string, color: number, size: number, x: number, y: number, time: number, fontname: string, centered: boolean, shadow: boolean): boolean;
		/**
		 * Overlays a line on the screen. Color is a 8bpp rgba int which can be created using the mixcolor function in the library. Time is in milliseconds.
		 * [Overlay] permission required.
		 */
		function overLayLine(color: number, width: number, x1: number, y1: number, x2: number, y2: number, time: number): boolean;
		/**
		 * [Internal, use alt1lib] Overlays an image on the screen. imgstr is a base64 encoded 8bpp bgra image buffer. imgwidth is the width of the image, this is required to decode the image.
		 * [Overlay] permission required.
		 */
		function overLayImage(x: number, y: number, imgstr: string, imgwidth: number, time: number): boolean;
		/**
		 * Removes all overlay with given group name from screen. You can give overlays a group by calling the overlaySetGroup function before drawing
		 * [Overlay] permission required.
		 */
		function overLayClearGroup(group: string): any;
		/**
		 * Set the group name of all following draw overlay calls untill called again with a different name. Groups can be used remove overlays again.
		 * [Overlay] permission required.
		 */
		function overLaySetGroup(group: string): any;
		/**
		 * Stops all overlays in the current group from updating. You can use this to draw combined overlays without flickering. Call overLayContinueGroup when done to continue normal drawing, or overLayRefreshGroup to only redraw the overlay when specificly called. Frozen overlays have an extended timer, but still not unlimited.
		 * [Overlay] permission required.
		 */
		function overLayFreezeGroup(group: string): any;
		/**
		 * Continues automatic redrawing of this overlay group.
		 * [Overlay] permission required.
		 */
		function overLayContinueGroup(group: string): any;
		/**
		 * Does a single redraw of the current overlay group while leaving the group frozen.
		 * [Overlay] permission required.
		 */
		function overLayRefreshGroup(group: string): any;
		/**
		 * Sets the z-index for an overlay group. Group with higher z-index are drawn over lower ones. The default value is 0.
		 * [Overlay] permission required.
		 */
		function overLaySetGroupZIndex(groupname: string, zIndex: number): any;
		/**
		 * [Internal, use alt1lib] Returns a string containing pixel data about the specified region inside the rs window. The string is base64 encoded 8bpp argb buffer of the requested image.
		 * [Pixel] permission required.
		 */
		function getRegion(x: number, y: number, w: number, h: number): string;
		/**
		 * [Internal, use alt1lib] Returns a string containing pixel data about the specified regions inside the rs window. The string is base64 encoded 8bpp argb buffer of the requested images concatenated after eachother.
		 * [Pixel] permission required.
		 */
		function getRegionMulti(rectsjson: string): string;
		/**
		 * [Internal, use alt1lib] Binds a region of the rs window in memory to apply functions to it without having to transfer it to the browser. Returns a non-zero integer on success or 0 on failure. This function returns a identifier to be used in subsequent 'bind-' calls. This id is currently always 1 on succes as only one bound image is allowed.
		 * [Pixel] permission required.
		 */
		function bindRegion(x: number, y: number, w: number, h: number): number;
		/**
		 * [Internal, use alt1lib] Same as bindRegion, but uses screen coordinates and can see pixels outside of rs. This method is much slower per call.
		 * [Pixel] permission required.
		 */
		function bindScreenRegion(x: number, y: number, w: number, h: number): number;
		/**
		 * [Internal, use alt1lib] Returns a rubregion of the bound image as base64 encoded 8bpp abgr buffer.
		 * [Pixel] permission required.
		 */
		function bindGetRegion(id: number, x: number, y: number, w: number, h: number): string;
		/**
		 * Tries to read a antialised string on the bound image, with the given font. The color of text will be detected and chosen from a set of preset colors. Valid font names are currently 'chat','chatmono' and 'xpcounter'. This function returns an empty string on failure.
		 * [Pixel] permission required.
		 */
		function bindReadString(id: number, fontname: string, x: number, y: number): string;
		/**
		 * Same as bindReadString, however requires an extra color argument. The color is a 8bpp rgba color int that can be mixed with the a1lib.mixcolor function. The should be the base color, or brightest color in the to be detected text.
		 * [Pixel] permission required.
		 */
		function bindReadColorString(id: number, fontname: string, color: number, x: number, y: number): string;
		/**
		 * Same as bindReadString, however allows extra arguments in an object. Possible arguments and default values:<br/>bool allowgap=false - scan empty space for more text after reading text<br/>string fontname=chatfont - the font to detect<br/>int[] colors=[~20 standard colors] - array of color ints to detect
		 * [Pixel] permission required.
		 */
		function bindReadStringEx(id: number, x: number, y: number, args: string): string;
		/**
		 * [Incomplete] Adds a font for ocr, this font can be used in the bindReadString functions. The jsonfont can be generated from an image using a generator, please contant me if you plan to use this.
		 * [Pixel] permission required.
		 */
		function addOCRFont(name: string, jsonFont: string): boolean;
		/**
		 * Reads rightlcick menu text, this function is very fragile and is different from the other readText functions. It requires an exact baseline y coord.
		 * [Pixel] permission required.
		 */
		function bindReadRightClickString(id: number, x: number, y: number): string;
		/**
		 * Retrieves a single pixel from the bound image, this is not a recommended method as it is very slow
		 * [Pixel] permission required.
		 */
		function bindGetPixel(id: number, x: number, y: number): number;
		/**
		 * [Internal, use alt1lib] Finds the given subimage in the bound image. This function is way quicker than possible in js. imgstr is a base64 encoded 8bpp bgra image buffer. imgwidth is the width of the image, this is required to decode the image. x,y,w,h defines the area in the bound image to be searched.
		 * [Pixel] permission required.
		 */
		function bindFindSubImg(id: number, imgstr: string, imgwidth: number, x: number, y: number, w: number, h: number): string;
		/**
		 * Simple info about how the API works.
		 */
		function help(): string;
		/**
		 * This function returns information about a single property with the given name.
		 */
		function helpProp(propname: string): string;
		/**
		 * Returns a html document with documentation about every function and property exposed.
		 */
		function helpFull(): string;
		/**
		 * Returns a file that can be used to add the alt1 api to Visual Studio IntelliSense.
		 */
		function helpIntelliSense(): string;
		/**
		 * Returns a types.d.ts file that represents the alt1 api and can be used to get working code completion in typescript.
		 */
		function helpTypescript(): string;
		/**
		 * Returns a file that can be used to add the alt1 api to editors using the JSDoc format
		 */
		function helpJSDoc(): string;
		/**
		 * No info available about this method.
		 */
		function GetType(): any;
	}
}