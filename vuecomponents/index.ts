import { Component, Prop, Vue, Inject } from "vue-property-decorator"

import NisImagebutton from "./imagebutton.vue";
import NisMenubar from "./menubar.vue";
import NisTabs from "./tabs.vue";

require("./nis.scss");

export default {
    NisImagebutton,
    NisMenubar,
    NisTabs
};