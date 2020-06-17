import _ChatBoxReader from "./index";


declare global {
	namespace AfkCompiled {
		export var ChatBoxReader: typeof _ChatBoxReader;
	}
}

