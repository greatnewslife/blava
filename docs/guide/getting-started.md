# Getting Started

Install with npm, Yarn, or pnpm:

::: code-group

```bash [pnpm]
pnpm add blava
```

```bash [npm]
npm i blava
```

```bash [yarn]
yarn add blava
```

:::

Blava requires only a canvas element to begin. To avoid stretching, use a canvas with a 1×1 aspect ratio as Blava assumes a square

```ts
new Blava(document.querySelector('canvas'));
```

A host of configuration options allow for customization of the generated graphics, though none are required to get a basic Blava running.

```ts
new Blava(document.querySelector('canvas')!, {
	// One of "wave" or "blob"
	style: 'blob',

	// Amount of animated points on the chosen Blava style
	pointCount: 5,

	// Specify the ends of the linear gradients
	gradient: {
		from: '#1fc',
		to: '#9ff',
	},

	/**
	 * One of ["molasses", "slow", "medium", "fast", "jelly"] or a number. The higher the number,
	 * the more rapid the movement
	 */
	movementSpeed: 'slow',
});
```
