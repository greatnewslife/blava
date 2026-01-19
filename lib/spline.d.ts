declare module '@georgedoescode/spline' {
	export function spline(
		points?: { x: number; y: number }[],
		tension?: number,
		close?: boolean,
		cb?: CallableFunction,
	): string;
}
