<template>
  <div class="nis-imagebutton">
    <div :class="{ 'nissmallimagebutton': true, ['offset' + this.offset]: this.offset != 0 }"/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";

@Component
export default class NisImagebutton extends Vue {
  @Prop({ type: Number, default: 0 })
  offset!: number;
  @Prop({ type: String, default: "none" })
  img!: string;
}
</script>