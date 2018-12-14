<template>
    <div class="nis-menubar">
        <div class="nis-menubar__buttons">
            <slot/>
        </div>
        <div class="nis-separator">
            <slot name="tabs"/>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator"

@Component
export default class NisMenubar extends Vue {}
</script>