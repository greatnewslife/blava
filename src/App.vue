<template>
	<main class="grid w-screen place-items-center bg-true-gray-900 text-white h-svh">
		<h1
			class="z-2 text-center text-8rem text-#171717 font-black lg:(from-[#015ff7] to-[cyan] bg-gradient-to-br bg-clip-text text-15vw text-transparent)"
		>
			Hello Blava
		</h1>

		<canvas
			role="presentation"
			class="fixed bottom-0 right-50vw top-0 z-1 h-full w-200vw -left-50vw lg:(left-0 right-0 top-1/4 z-3)"
			ref="canvas"
		/>
	</main>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useMediaQuery } from '@vueuse/core';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { Blava } from '~/main';
import type { BlavaOptions } from '~/types';

const canvasRef = useTemplateRef('canvas');
const blava = ref<Blava>();

const waveConfig: BlavaOptions = {
	seed: '12345',
	movementSpeed: 0.001_5,
	style: 'wave',
	gradient: '#171717',
};

const blobConfig: BlavaOptions = {
	pointCount: 100,
	seed: 'blava',
	movementSpeed: 0.000_001,
	variance: {
		x: 100,
		y: 500,
	},
	gradient: {
		from: '#015ff7',
		to: 'cyan',
	},
};

const largeViewportQuery = useMediaQuery(`(min-width: ${breakpointsTailwind.lg}px)`);

watch(largeViewportQuery, createBlava);

function createBlava(isLargeViewport: boolean) {
	blava.value = new Blava(canvasRef.value!, isLargeViewport ? waveConfig : blobConfig);
}

onMounted(() => createBlava(largeViewportQuery.value));
</script>
