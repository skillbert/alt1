<template>
  <div class="nis-tabs">
    <div
      v-for="(name,id) in tabs"
      :key="id"
      :class="{'nis-tab':true,'nis-tab_active':currentTab==id,'left':leftsided}"
      @click="setTab(id)"
    >{{name}}</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";

@Component({model:{
    prop:"currentTab",
    event:"tabchange"
}})
export default class NisTabs extends Vue {
  @Prop({
    default: function() {
      return {};
    }
  })
  tabs!: { [key: string]: string };
  @Prop({ default: null })
  initialTab!: string;
  @Prop({default:false})
  leftsided!:boolean;

  currentTab = "";



  created() {
    if (this.initialTab) {
      this.currentTab = this.initialTab;
    } else {
      this.currentTab = Object.keys(this.tabs)[0] || null;
    }
  }

  setTab(id: string) {
    this.currentTab = id;
    this.$emit("tabchange", id);
  }
}
</script>