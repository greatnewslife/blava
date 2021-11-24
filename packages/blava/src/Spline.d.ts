declare module '@georgedoescode/spline' {
  export function spline(
    points?: any[],
    tension?: number,
    close?: boolean,
    cb?: CallableFunction
  ): string;
}
