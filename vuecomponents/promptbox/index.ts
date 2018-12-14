import { Prop, Vue, Component, Watch } from "vue-property-decorator";
import { VNode, VNodeData, VueConstructor, CreateElement } from "vue";


type PBItemProxy = { constr: typeof PBItem, isinput: boolean, data: VNodeData, children?: PBItemProxy[] };
//{ [key: string]: (...args) => PBItemProxy }
var PBBuilder = {
    string: (id) => ({ constr: PBInput, isinput: true, data: { props: { id, type: "string" } } }),
    number: (id) => ({ constr: PBInput, isinput: true, data: { props: { id, type: "number" } } }),
    int: (id) => ({ constr: PBInput, isinput: true, data: { props: { id, type: "int" } } }),
    text: (text) => ({ constr: PBText, isinput: false, data: { props: { text } } }),
    hor: (spread: string, children: PBItemProxy[]) => ({ constr: PBHor, isinput: false, data: { props: { spread } }, children })
};

interface PBInputTypes {
    string: string;
    number: number;
    int: number;
}

class PBItem extends Vue { }

class PBInputItem<T=any> extends PBItem {
    value: T;
    id: string;
}

@Component
class PBHor extends PBItem {
    @Prop({ default: "" }) spread: string;
    render(h: CreateElement) {
        var slots = this.$slots.default;
        for (var a = 0; a < slots.length; a++) {
            var slot = slots[a];
            var part = this.spread[a] || 1;
            if (!slot.data.style) { slot.data.style = {}; }
            (slots[a].data.style as any).flex = `${part} ${part} 0px`;
        }
        return h("div", { style: { display: "flex", flexDirection: "row" } }, this.$slots.default);
    }
}

@Component
class PBText extends PBItem {
    @Prop({ default: "" }) text!: string;
    render(h: CreateElement) {
        return h("div", this.text);
    }
    constructor() {
        super();
        console.log("new text node");
    }
}

@Component
class PBInput<T extends PBInputTypes[K], K extends keyof PBInputTypes> extends PBInputItem<T>{
    @Prop() type: K;
    @Prop() value: T;
    @Prop() id!: string;

    render(h) {
        var types = {
            string: "text",
            number: "number",
            int: "number"
        };
        return h("input", {
            domProps: {
                type: types[this.type],
                value: this.value
            },
            on: {
                change: e => { this.$emit("change", (this.type == "number" || this.type == "int" ? +e.target.value : e.target.value)); }
            }
        });
    }
    constructor() {
        super();
        console.log("new input node");
    }
}

type PBInit = (pb: typeof PBBuilder) => PBItemProxy[];

@Component
class PBContent<T extends { [key: string]: any }> extends Vue {
    @Prop({ type: Function, default: null })
    init!: PBInit;
    @Prop({ default: () => ({}) })
    value!: T;

    renderLayer(h: CreateElement, nodes: PBItemProxy[]) {
        var children = [] as VNode[];
        for (var node of nodes) {
            if (node.isinput && node.data.props.id) {
                node.data.on = {
                    change: function (this: PBContent<any>, id, v) {
                        this.value[id] = v;
                        this.$emit("change", this.value);
                    }.bind(this, node.data.props.id)
                };
                node.data.props.value = this.value[node.data.props.id];
            }
            var subs = (node.children ? this.renderLayer(h, node.children) : null);
            children.push(h(node.constr, node.data, subs));
        }
        return children;
    }

    render(h: CreateElement) {
        var nodes = this.init(PBBuilder);
        return h("div", this.renderLayer(h, nodes));
    }

    constructor(...args: any[]) {
        super(arguments);
    }
}

export default function promptbox<T>(props: any, init: PBInit, value = {} as T) {
    var root = new PBContent<T>({ propsData: { init, value } });

    var deepclone = function <B>(obj: B) {
        var r = {} as B;
        for (var a in obj) {
            if (typeof obj[a] == "object") {
                r[a] = deepclone(obj[a]);
            } else {
                r[a] = obj[a];
            }
        }
        return r;
    }

    return { root, liveValue: value, getValue: deepclone.bind(null, value) };
}


