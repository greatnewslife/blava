<template>
  <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>

<script>
import { Blava } from '../../src/main.js';
export default {
  props: {
    settings: {
      type: Object,
      default: () => {
        return {
          movementSpeed: 'medium',
          style: 'blob',
        };
      },
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
  },
  mounted() {
    new Blava(this.$refs.canvas, this.settings);
  },
};
</script>
