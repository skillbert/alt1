
declare module "*.data.png" {
    //import { ImageData } from "@alt1/base";
    var t: Promise<ImageData>;
    export default t;
}

declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}