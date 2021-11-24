import { Blava, Point } from './index';

export interface BlavaOptions {
  /**
   * The speed of movement in point animation.
   * Typically any number between 0.000_05 and 0.01 works well.
   */
  movementSpeed?: MovementSpeed;
  /**
   * The extent of movement in each direction.
   */
  variance?: Coordinates;
  /**
   * The gradient fill of the Blava.
   */
  gradient?: Gradient;
  /**
   * The points to build the Blava blob with.
   */
  points?: Point[];
  /**
   * Any number	The number of points to build the Blava blob with.
   *
   * Does nothing if points parameter is supplied
   */
  pointCount?: number;
  /**
   * A seed on which all random generation (such as movement, initial positioning, & gradient hue) will be based
   */
  seed?: string;
  /**
   * The style of Blava to generate.
   *
   * Does nothing if points parameter is supplied
   */
  style?: Style;
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
}

/**
 * The speed of movement in point animation.
 * Typically any number between 0.000_05 and 0.01 works well
 */
export type MovementSpeed =
  | 'molasses'
  | 'slow'
  | 'medium'
  | 'fast'
  | 'jelly'
  | number;

/**
 * The style of Blava to generate.
 * Does nothing if points parameter is supplied
 */
export type Style = 'wave' | 'blob';

/**
 * The gradient fill of the Blava.
 */
export type Gradient =
  | 'auto'
  | {
      from: GradientStop;
      to: GradientStop;
    };

type GradientStop =
  | {
      position: {
        x: number;
        y: number;
      };
      color: string;
    }
  | string;

export interface PointOptions {
  /**
   * Either auto-animate or freeze an axis of movement with a boolean, or define a custom amount of movement in a given direction with a number.
   */
  animated?: AnimateAxes;

  random?: number | null;
}

export type AnimateAxes =
  | boolean
  | {
      x: number | boolean;
      y: number | boolean;
    };

/**
 * Object containing x and y coordinates.
 */
export interface Coordinates {
  x: number;
  y: number;
}
