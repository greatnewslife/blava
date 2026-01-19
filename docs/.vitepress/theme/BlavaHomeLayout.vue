<template>
	<main>
		<BlavaHomeArt v-if="frontmatter.layout === 'home'" />

		<Layout>
			<template #home-hero-info>
				<div
					class="w-80 mx-auto py-4 px-8 rounded-xl backdrop-blur-xl lg:(w-120 mx-0 -ml-8)"
				>
					<img src="/blava-logo.svg" class="mb-8" />

					<p class="text-2xl font-semibold">Performant, artful blob generator 🎨</p>
				</div>
			</template>
		</Layout>
	</main>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import BlavaHomeArt from './BlavaHomeArt.vue';

const { frontmatter } = useData();

const { Layout } = DefaultTheme;
</script>

<style>
.VPHomeHero .actions {
	--uno: 'justify-center lg:justify-start';
}
</style>
