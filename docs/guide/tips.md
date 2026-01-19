# Tips

## Reacting to `prefers-reduces-motion`

::: code-group

```vue [Vue]
<script setup lang="ts">
import { Blava } from 'blava';
import { usePreferredReducedMotion } from '@vueuse/core';
import { onMounted, shallowRef, useTemplateRef, watch } from 'vue';

const canvas = useTemplateRef('canvas');

const blava = shallowRef<Blava>();

const motionPreference = usePreferredReducedMotion();

watch(motionPreference, (preference) => {
	if (preference === 'reduce') {
		blava.value.pause();
	} else {
		blava.value.play();
	}
});

onMounted(() => {
	blava.value = new Blava(canvas.value!);
});
</script>
```

```ts [TypeScript]
import { Blava } from 'blava';

const canvas = document.querySelector('canvas');

const blava = new Blava(canvas);

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');

motionQuery.addEventListener('change', (event) => {
	if (event.matches) {
		blava.pause();
	} else {
		blava.play();
	}
});
```

:::
