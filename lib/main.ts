import type { NoiseFunction2D, RandomFn } from 'simplex-noise';
import type { PointOptions, BlavaOptions, Gradient, AnimateAxes } from './types';
import { createNoise2D } from 'simplex-noise';
import { prng_alea } from 'esm-seedrandom';
import { spline } from '@georgedoescode/spline';
import { noiseSteps } from './types';

export * from './types';

/**
 * A simple point in space
 */
export class Point {
	x: number;
	y: number;
	origin: { x: number; y: number };
	noiseOffset: { x: number; y: number };
	animated?: boolean | AnimateAxes;

	/**
	 * Construct a Point for Blava use
	 *
	 * @param x The horizontal coordinate
	 * @param y The vertical coordinate
	 * @param config Configuration options
	 * @param config.animated A boolean specifying whether the Point should move or an object specifying movement choice for each direction
	 * @param config.animated.x Whether the Point should move horizontally
	 * @param config.animated.y Whether the Point should move vertically
	 * @param config.random The seed to use for patterned randomness
	 */
	constructor(x: number, y: number, { animated = true, random = null }: PointOptions = {}) {
		this.x = x;
		this.y = y;
		this.origin = {
			x: x,
			y: y,
		};
		this.noiseOffset = {
			x: (random ?? Math.random()) * 1_000,
			y: (random ?? Math.random()) * 1_000,
		};
		this.animated = animated;
	}
}

/**
 * An artful blob generator
 */
export class Blava {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	getRandom: RandomFn;
	points: Point[];
	beforePaint?: (instance: Blava) => void;
	afterPaint?: (instance: Blava) => void;
	speed: BlavaOptions['movementSpeed'];
	variance: { x: number; y: number };
	playing: boolean;
	gradient: Gradient | string;
	path: string;
	resizeObserver: ResizeObserver;

	#currentAnimationFrameId: number | null;
	#simplex: NoiseFunction2D;

	constructor(canvas: HTMLCanvasElement, options?: BlavaOptions) {
		const {
			movementSpeed = 'slow',
			variance = { x: 5, y: 10 },
			gradient = 'auto',
			points = [],
			pointCount = 6,
			seed = undefined,
			style = 'blob',
			beforePaint = undefined,
			afterPaint = undefined,
		} = options ?? {};

		this.canvas = canvas;

		const context = this.canvas.getContext('2d');

		if (!context) {
			throw new Error('Could not create 2D rendering context from input canvas');
		}

		this.context = context;
		this.path = '';
		this.#currentAnimationFrameId = null;

		// Set the seeded random
		this.getRandom = prng_alea(seed?.toString());

		this.#simplex = createNoise2D(this.getRandom);

		// Points can be passed in as objects of {x, y} coordinates fitting within 100×100 grid
		if (!points || points.length === 0) {
			this.points =
				style === 'wave'
					? this.createWavePoints(pointCount)
					: this.createBlobPoints(pointCount);
		} else {
			this.points = points.map((point) => {
				if (point instanceof Point) {
					return point;
				}

				return new Point(
					typeof point.x === 'number' ? point.x : 0,
					typeof point.y === 'number' ? point.y : 0,
					{
						animated: point.animated,
						random: this.getRandom(),
					},
				);
			});
		}

		// An optional callback to run before painting the Blava
		if (beforePaint) {
			this.beforePaint = beforePaint;
		}

		// An optional callback to run after painting the Blava
		if (afterPaint) {
			this.afterPaint = afterPaint;
		}

		// The degree to which the position of animated points fluctuate
		this.speed =
			typeof movementSpeed === 'number'
				? movementSpeed
				: (noiseSteps[movementSpeed] ?? noiseSteps.slow);

		// How much a point's position fluctuates
		this.variance = variance;

		// Whether the animation of the blob is currently running
		this.playing = true;

		if (gradient === 'auto') {
			const hue = this.getRandom() * 360;

			this.gradient = {
				from: {
					position: {
						x: 50,
						y: 50,
					},
					color: `hsl(${hue},100%,78%`,
				},
				to: {
					position: {
						x: 50,
						y: 100,
					},
					color: `hsl(${hue},100%,92%`,
				},
			};
		} else {
			// Convert from and to properties into full gradient descriptions if they're only strings
			let processedGradient: Gradient;

			if (typeof gradient === 'string') {
				processedGradient = {
					from: {
						color: gradient,
						position: {
							x: 50,
							y: 50,
						},
					},
					to: {
						color: gradient,
						position: {
							x: 50,
							y: 100,
						},
					},
				};
			} else {
				processedGradient = {
					from:
						typeof gradient.from === 'string'
							? {
									color: gradient.from,
									position: {
										x: 50,
										y: 50,
									},
								}
							: gradient.from,

					to:
						typeof gradient.to === 'string'
							? {
									color: gradient.to,
									position: {
										x: 50,
										y: 100,
									},
								}
							: gradient.to,
				};
			}

			this.gradient = processedGradient;
		}

		// Handle canvas resizing
		this.resizeObserver = new ResizeObserver(() => {
			this.handleResize();
		});

		this.resizeObserver.observe(this.canvas);

		this.applyGradient();
		this.animate();
	}

	/**
	 * Generate evenly-spaced points on a line for a wave pattern
	 *
	 * @param {number}    [count=4] The amount of points to generate
	 *
	 * @return {Point[]} The generated Points
	 */
	createWavePoints(count: number) {
		const result = [
			new Point(0, 50, {
				animated: { x: false, y: true },
				random: this.getRandom(),
			}),
		];
		const step = 100 / count;

		// Create points along the line
		for (let i = 0; i <= count; i++) {
			const animated = [0, count].includes(i) ? { x: false, y: true } : true;

			result.push(
				new Point(step * i, (this.getRandom() * 50) / 2 + 25, {
					animated: animated,
					random: this.getRandom(),
				}),
			);
		}

		result.push(
			new Point(100, 50, { animated: false, random: this.getRandom() }),
			new Point(100, 100, { animated: false, random: this.getRandom() }),
			new Point(0, 100, { animated: false, random: this.getRandom() }),
		);

		return result;
	}

	/**
	 * Generate evenly-spaced points in a circle for a classic blob pattern
	 *
	 * @param {number}   [count=6] The amount of points to generate
	 *
	 * @return {Point[]} The generated Points
	 */
	createBlobPoints(count: number) {
		const result: Point[] = [];
		const angleStep = (Math.PI * 2) / count;
		const radius = 25;

		for (let i = 1; i <= count; i++) {
			const theta = i * angleStep;

			result.push(
				new Point(50 + Math.cos(theta) * radius, 50 + Math.sin(theta) * radius, {
					random: this.getRandom(),
				}),
			);
		}

		return result;
	}

	/**
	 * Generate simple linear gradient to use as blob fill
	 */
	applyGradient() {
		if (typeof this.gradient === 'string') {
			this.context.fillStyle = this.gradient;
			return;
		}

		const from =
			typeof this.gradient.from === 'string'
				? {
						position: {
							x: 0,
							y: 0,
						},
						color: this.gradient.from,
					}
				: this.gradient.from;

		const to =
			typeof this.gradient.to === 'string'
				? {
						position: {
							x: 0,
							y: 0,
						},
						color: this.gradient.to,
					}
				: this.gradient.to;

		const result = this.context.createLinearGradient(
			from.position?.x ?? 0,
			from.position?.y ?? 0,
			to.position?.x ?? 100,
			to.position?.y ?? 100,
		);

		result.addColorStop(0, from.color);
		result.addColorStop(1, to.color);

		this.context.fillStyle = result;
	}

	/**
	 * Adjust canvas size to cover the entirety of its parent element
	 */
	handleResize() {
		const { width, height } = this.canvas.getBoundingClientRect();

		// Clear saved state on the stack
		this.context.restore();

		this.canvas.setAttribute('height', height.toString());
		this.canvas.setAttribute('width', width.toString());

		/**
		 * Scaling is based on current scale, so original transform must first be restored before
		 * scaling again
		 */
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this.context.scale(width / 100, height / 100);

		this.context.clearRect(0, 0, width, height);

		// Reset clipping path to cover full canvas
		this.context.clip(new Path2D('M0,0 H100 V100 H0 V0 Z'));

		// Save the context state
		this.context.save();

		if (this.#currentAnimationFrameId) {
			cancelAnimationFrame(this.#currentAnimationFrameId);
		}

		this.animate({ singleFrame: !this.playing });
	}

	/**
	 * Scale a number between two ranges
	 *
	 * @param n    The number to scale
	 * @param xMin The minimum of the input range
	 * @param xMax The maximum of the input range
	 * @param yMin The minimum of the output range
	 * @param yMax The maximum of the output range
	 *
	 * @returns The scaled number
	 */
	#scale(n: number, xMin: number, xMax: number, yMin: number, yMax: number) {
		return ((n - xMin) / (xMax - xMin)) * (yMax - yMin) + yMin;
	}

	/**
	 * Animate the movement of the blava
	 *
	 * @param singleFrame Whether to only animate for a single frame. Useful e.g. for redrawing after resize
	 */
	animate({ singleFrame } = { singleFrame: false }) {
		if (!this.playing && !singleFrame) {
			return;
		}

		this.points.forEach((point) => {
			if (!point.animated) {
				return;
			}

			const noisePoint = {
				x: this.#simplex(point.noiseOffset.x, point.noiseOffset.x),
				y: this.#simplex(point.noiseOffset.y, point.noiseOffset.y),
			};
			const x = this.#scale(
				noisePoint.x,
				-1,
				1,
				point.origin.x - this.variance.x,
				point.origin.x + this.variance.x,
			);
			const y = this.#scale(
				noisePoint.y,
				-1,
				1,
				point.origin.y - this.variance.y,
				point.origin.y + this.variance.y,
			);

			if ((point.animated === true || point.animated.x) && typeof this.speed === 'number') {
				point.x = x;
				point.noiseOffset.x += this.speed;
			}

			if ((point.animated === true || point.animated.y) && typeof this.speed === 'number') {
				point.y = y;
				point.noiseOffset.y += this.speed;
			}
		});

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.restore();
		this.context.save();

		this.beforePaint?.(this);

		this.path = spline(this.points, 1, true);

		this.applyGradient();
		this.context.fill(new Path2D(this.path));

		this.afterPaint?.(this);

		this.#currentAnimationFrameId = singleFrame
			? null
			: requestAnimationFrame(() => this.animate());
	}

	/**
	 * Resume animation
	 */
	play() {
		if (this.playing) {
			return;
		}

		this.playing = true;
		this.animate();
	}

	/**
	 * Pause animation
	 */
	pause() {
		if (!this.playing) {
			return;
		}

		this.playing = false;

		if (this.#currentAnimationFrameId) {
			cancelAnimationFrame(this.#currentAnimationFrameId);
		}
	}
}
