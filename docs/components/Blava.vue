<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import { Blava } from '../../src/main.js';
export default {
  mounted() {
    new Blava(this.$refs.canvas, {
      movementSpeed: 'medium',
      style: 'blob',
    });
  },
};
</script>

<style></style>
