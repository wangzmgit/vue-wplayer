<template>
  <svg aria-hidden="true" class="svg-icon" :width="size" :height="size">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">

import 'virtual:svg-icons-register';
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    prefix: {
      type: String,
      default: 'icon'
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#333'
    },
    size: {
      type: String,
      default: '1em'
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return {
      symbolId
    }
  }

});
</script>