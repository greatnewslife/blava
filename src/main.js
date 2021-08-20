import SimplexNoise from "simplex-noise";
import { spline } from "@georgedoescode/spline";

/**
 * @typedef BlavaGradient
 *
 * An object containing color and position information about a Blava gradient stop
 *
 * @param {string|object} from            The beginning stop of the linear gradient
 * @param {object}        from.position   The coordinate (on a 100x100 grid) of the beginning stop
 * @param {number}        from.position.x The horizontal position of the beginning stop coordinate
 * @param {number}        from.position.y The vertical position of the beginning stop coordinate
 * @param {string}        from.color      The color of the beginning stop
 * @param {string|object} to              The ending stop of the linear gradient
 * @param {object}        to.position     The coordinate (on a 100x100 grid) of the ending stop
 * @param {number}        to.position.x   The horizontal position of the ending stop coordinate
 * @param {number}        to.position.y   The vertical position of the ending stop coordinate
 * @param {string}        to.color        The color of the ending stop
 */

/**
 * A simple point in space
 */
export class Point {
  /**
   * Construct a Point for Blava use
   *
   * @param {number}         x                       The horizontal coordinate
   * @param {number}         y                       The vertical coordinate
   * @param {object}         [config]                 Configuration options
   * @param {boolean|object} [config.animated = true] A boolean specifying whether the Point should move or an object
   *                                                 specifying movement choice for each direction
   * @param {boolean}        [config.animated.x]      Whether the Point should move horizontally
   * @param {boolean}        [config.animated.y]      Whether the Point should move vertically
   */
  constructor(x, y, { animated = true } = {}) {
    this.x = x;
    this.y = y;
    this.origin = {
      x: x,
      y: y,
    };
    this.noiseOffset = {
      x: Math.random() * 1_000,
      y: Math.random() * 1_000,
    };
    this.animated = animated;
  }
}

/**
 * An artful blob generator
 */
export class Blava {
  noiseSteps = {
    molasses: 0.000_05,
    slow: 0.000_3,
    medium: 0.001,
    fast: 0.003,
    jelly: 0.03,
  };
  simplex = new SimplexNoise();

  /**
   *
   * @param {HTMLCanvasElement} canvas The canvas element to manipulate
   *
   * @param {object}               [config]                        Configuration options
   * @param {number|string}        [config.movementSpeed = "slow"] The speed of animation as a number or one of a set of default
   *                                                              speeds (molasses, slow, medium, fast, or jelly)
   * @param {string}               [config.style = "wave"]         A choice of default presentation styles (wave or blob) if a list
   *                                                              of points is not supplied
   * @param {object}               [config.variance]               The measurements determining the amount of variance in position
   * @param {number}               [config.variance.x = 5]         The amount of x variance
   * @param {number}               [config.variance.y = 10]        The amount of y variance
   * @param {string|BlavaGradient} [config.gradient = "auto"]      A description of the linear gradient to use for fill or "auto"
   * @param {Point[]}              [config.points = []]            The ordered list of points to animate
   * @param {number}               [config.pointCount = 4]         The number of points to generate if the shape is
   *                                                              automatically generated. Not used if config.points is supplied
   *
   * @param {function}             [config.beforePaint = null]     A function run before every paint frame. The first argument is
   *                                                              the Blava instance
   * @param {function}             [config.afterPaint = null]      A function run before every paint frame. The first argument is
   *                                                              the Blava instance
   */
  constructor(
    canvas,
    {
      movementSpeed = "slow",
      variance = { x: 5, y: 10 },
      gradient = "auto",
      points = [],
      pointCount = 6,
      style = "wave",
      beforePaint = null,
      afterPaint = null,
    } = {}
  ) {
    //Points can be passed in as objects of {x,y} coordinates fitting within 100×100 grid

    if (!points || points.length == 0) {
      this.points =
        style == "wave"
          ? this.createWavePoints(pointCount)
          : this.createBlobPoints(pointCount);
    } else {
      this.points = points.map((point) => {
        if (point instanceof Point) {
          return point;
        }

        return new Point(point.x, point.y, {
          animated: point.animated ?? true,
        });
      });
    }

    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    //An optional callback to run before painting the Blava
    if (beforePaint) {
      this.beforePaint = beforePaint;
    }

    //An optional callback to run after painting the Blava
    if (afterPaint) {
      this.afterPaint = afterPaint;
    }

    //The degree to which the position of animated points fluctuate
    this.speed =
      typeof movementSpeed == "number"
        ? movementSpeed
        : this.noiseSteps[movementSpeed] ?? this.noiseSteps["slow"];

    //How much a point's position fluctuates
    this.variance = variance;

    //Whether the animation of the blob is currently running
    this.playing = true;

    if (gradient === "auto") {
      let hue = Math.random() * 360;

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
      //Convert from and to properties into full gradient descriptions if they're only strings
      this.gradient = gradient;

      if (typeof this.gradient.from == "string") {
        this.gradient.from = {
          color: this.gradient.from,
          position: {
            x: 50,
            y: 50,
          },
        };
      }
      if (typeof this.gradient.to == "string") {
        this.gradient.to = {
          color: this.gradient.to,
          position: {
            x: 50,
            y: 100,
          },
        };
      }
    }

    window.addEventListener("resize", this.handleResize.bind(this));

    this.applyGradient();
    this.handleResize();
    this.animate();
  }

  /**
   * Generate evenly-spaced points on a line for a wave pattern
   *
   * @param {number}    [count=4] The amount of points to generate
   *
   * @return {Point[]} The generated Points
   */
  createWavePoints(count) {
    let result = [
      new Point(0, 50, {
        animated: { x: false, y: true },
      }),
    ];
    let step = 100 / count;

    //Create points along the line
    for (let i = 0; i <= count; i++) {
      let animated = [0, count].includes(i) ? { x: false, y: true } : true;

      result.push(
        new Point(step * i, (Math.random() * 50) / 2 + 25, {
          animated: animated,
        })
      );
    }

    result.push(
      new Point(100, 50, { animated: false }),
      new Point(100, 100, { animated: false }),
      new Point(0, 100, { animated: false })
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
  createBlobPoints(count) {
    let result = [];
    let angleStep = (Math.PI * 2) / count;
    let radius = 25;

    for (let i = 1; i <= count; i++) {
      let theta = i * angleStep;

      result.push(
        new Point(50 + Math.cos(theta) * radius, 50 + Math.sin(theta) * radius)
      );
    }

    return result;
  }

  /**
   * Generate simple linear gradient to use as blob fill
   *
   * @param {string|object} (optional) Either "auto" or an object with to and from color strings
   */
  applyGradient(input) {
    let result = this.context.createLinearGradient(
      this.gradient.from.position.x,
      this.gradient.from.position.y,
      this.gradient.to.position.x,
      this.gradient.to.position.y
    );

    result.addColorStop(0, this.gradient.from.color);
    result.addColorStop(1, this.gradient.to.color);

    this.context.fillStyle = result;
  }

  /**
   * Adjust canvas size to cover the entirety of its parent element
   */
  handleResize() {
    let rect = this.canvas.parentElement.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;

    //Clear saved state on the stack
    this.context.restore();

    //Scaling is based on current scale, so original transform must
    //first be restored before scaling again
    this.canvas.setAttribute("height", height);
    this.canvas.setAttribute("width", width);

    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.scale(width / 100, height / 100);

    this.context.clearRect(0, 0, width, height);

    //Reset clipping path to cover full canvas
    this.context.clip(new Path2D("M0,0 H100 V100 H0 V0 Z"));

    //Save the context state
    this.context.save();
  }

  /**
   * Scale a number between two ranges
   *
   * @param   {number} n    The number to scale
   * @param   {number} xMin The minimum of the input range
   * @param   {number} xMax The maximum of the input range
   * @param   {number} yMin The minimum of the output range
   * @param   {number} yMax The maximum of the output range
   *
   * @returns {number} The scaled number
   */
  scale(n, xMin, xMax, yMin, yMax) {
    return ((n - xMin) / (xMax - xMin)) * (yMax - yMin) + yMin;
  }

  /**
   * Animate the movement of the blob
   */
  animate() {
    if (!this.playing) {
      return;
    }

    this.points.forEach((point, index) => {
      if (!point.animated) {
        return;
      }

      let noisePoint = {
        x: this.simplex.noise2D(point.noiseOffset.x, point.noiseOffset.x),
        y: this.simplex.noise2D(point.noiseOffset.y, point.noiseOffset.y),
      };
      let x = this.scale(
        noisePoint.x,
        -1,
        1,
        point.origin.x - this.variance.x,
        point.origin.x + this.variance.x
      );
      let y = this.scale(
        noisePoint.y,
        -1,
        1,
        point.origin.y - this.variance.y,
        point.origin.y + this.variance.y
      );

      if (point.animated == true || point.animated.x) {
        point.x = x;
        point.noiseOffset.x += this.speed;
      }

      if (point.animated == true || point.animated.y) {
        point.y = y;
        point.noiseOffset.y += this.speed;
      }
    });

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
    this.context.save();

    this.beforePaint?.(this);

    this.path = spline(this.points, 1, true);
    let p = new Path2D(this.path);

    this.applyGradient();
    this.context.fill(p);

    this.afterPaint?.(this);

    requestAnimationFrame(this.animate.bind(this));
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
  }
}
