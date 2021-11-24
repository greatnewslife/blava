// @ts-ignore
import { Blava } from 'blava';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <canvas width="1000" height="600"></canvas>
`;

let canvas = document.querySelector('canvas') as HTMLCanvasElement;

new Blava(canvas, {
  movementSpeed: 'medium',
  style: 'blob',
  pointCount: 100,
  variance: {
    x: 20,
    y: 20,
  },
});
