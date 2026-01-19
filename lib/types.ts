import { Blava, Point } from './main';

type BlavaOptionsCommon = {
	/**
	 * The speed of movement in point animation.
	 *
	 * Typically any number between 0.000_05 and 0.01 works well.
	 */
	movementSpeed?: keyof typeof noiseSteps | number;

	/**
	 * The extent of movement in each direction.
	 */
	variance?: {
		x: number;
		y: number;
	};

	/**
	 * The gradient fill of the Blava.
	 */
	gradient?: Gradient | string;

	/**
	 * A seed on which all random generation (such as movement, initial positioning, & gradient hue)
	 * will be based. Strings are internally converted into numbers
	 */
	seed?: string | number;

	/**
	 * Function called before painting the Blava on the canvas.
	 * The points and path of the Blava are calculated by this step.
	 *
	 * First argument is the Blava instance
	 */
	beforePaint?: (blava: Blava) => void;

	/**
	 * Function called after painting the Blava on the canvas.
	 *
	 * First argument is the Blava instance
	 */
	afterPaint?: (blava: Blava) => void;
};

type BlavaOptionsBasic = BlavaOptionsCommon & {
	style?: never;
	points?: never;
	pointCount?: never;
};

type BlavaOptionsWithStylePreset = BlavaOptionsCommon & {
	/**
	 * The style of Blava to generate
	 *
	 * Does nothing if points parameter is supplied
	 */
	style?: 'wave' | 'blob';
	pointCount?: number;

	points?: never;
};

type BlavaOptionsWithPoints = BlavaOptionsCommon & {
	/**
	 * The points to build the Blava blob with
	 */
	points: (Point | { x: number; y: number; animated?: AnimateAxes })[];

	style?: never;
	pointCount?: never;
};

export type BlavaOptions = BlavaOptionsBasic | BlavaOptionsWithStylePreset | BlavaOptionsWithPoints;

export const noiseSteps = {
	molasses: 0.000_05,
	slow: 0.000_3,
	medium: 0.001,
	fast: 0.003,
	jelly: 0.03,
} as const;

/**
 * The gradient fill of the Blava.
 */
export type Gradient = {
	from: GradientStop;
	to: GradientStop;
};

type GradientStop =
	| {
			position?: {
				x: number;
				y: number;
			};
			color: string;
	  }
	| string;

export type PointOptions = {
	/**
	 * Either auto-animate or freeze an axis of movement with a boolean, or define a custom amount
	 * of movement in a given direction with a number
	 */
	animated?: AnimateAxes;

	random?: number | null;
};

export type AnimateAxes =
	| boolean
	| {
			x: number | boolean;
			y: number | boolean;
	  };
