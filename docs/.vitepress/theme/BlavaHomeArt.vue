<template>
	<div class="fixed h-screen w-200vw rounded-xl overflow-hidden -z-1 lg:(w-full)">
		<canvas
			v-for="i in 4"
			:key="i"
			ref="canvasRefs"
			class="absolute bottom-0 w-full"
			:class="heights[i - 1]"
		/>
	</div>
</template>

<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core';
import { Blava } from '~/main';
import { BlavaOptions } from '~/types';
import { onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';

const heights = ref(['h-75%', 'h-70%', 'h-55%', 'h-35%']);

const canvasRefs = useTemplateRef('canvasRefs');

const blavas = shallowRef<Blava[]>([]);

const motionPreference = usePreferredReducedMotion();

watch(motionPreference, (newValue) => {
	blavas.value.forEach((blava) => (newValue === 'reduce' ? blava.pause() : blava.play()));
});

onMounted(() => {
	const standardOptions: BlavaOptions = {
		style: 'wave',
		movementSpeed: 0.0013,
	};

	const colors = ['#efefff', '#41cfff', '#219fff', '#015ff7'];
	const seeds = ['first', 'second', 'third', 'fourth'];

	for (let x = 0; x < 4; x++) {
		blavas.value.push(
			new Blava(canvasRefs.value![x], {
				...standardOptions,
				gradient: colors[x],
				seed: seeds[x],
			})
		);
	}

	if (motionPreference.value === 'reduce') {
		blavas.value.forEach((blava) => blava.pause());
	}
});
</script>
