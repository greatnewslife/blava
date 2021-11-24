// tsup.config.ts
import type { Options } from 'tsup';
export const tsup: Options = {
  splitting: false,
  sourcemap: true,
  clean: true,
  entryPoints: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'esnext',
  dts: true,
};
