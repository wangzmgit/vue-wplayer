<template>
  <svg aria-hidden="true" class="svg-icon" :width="size" :height="size">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import 'virtual:svg-icons-register';
import { computed } from "vue";

const props = withDefaults(defineProps<{
  prefix?: string
  name: string
  color?: string
  size?: string
}>(), {
  prefix: "icon",
  color: "#333",
  size: "1em"
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>