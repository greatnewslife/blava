# Advanced Configuration

## Config options

Deep control of the Blava is possible with more advanced options.

```javascript
new Blava(c, {
  /**
   * Overrides "style" and "pointCount" options.
   * Points are based on a 100×100 coordinate system.
   * Animation can be set individually on each
   * point in each dimension
   */
  points: [
    { x: 30, y: 30, animated: true },
    { x: 60, y: 30, animated: false },
    { x: 60, y: 60, animated: { x: true, y: false } },
    { x: 60, y: 30 },
  ],

  /**
   * Allows for reproducible randomness.
   * Used for any configuration and manipulation based on
   * randomness (including initial positioning, movement,
   * and gradient hue selection)
   */
  seed: 'apsv9a8wj938nvas',

  gradient: {
    from: {
      //Position is based on a 100×100 grid
      position: {
        x: 0,
        y: 50,
      },
      color: 'hsl(20, 100%, 82%)',
    },
    to: {
      position: {
        x: 100,
        y: 50,
      },
      color: 'hsl(58, 100%, 82%)',
    },
  },

  /**
   * How much on the 100×100 grid animated points will move
   * in each dimension
   */
  variance: {
    x: 10,
    y: 15,
  },

  /**
   * A function to run before the Blava is drawn on the canvas.
   * Points are calculated before this function runs
   *
   * @arg {Blava} instance The Blava instance for accessing properties
   */
  beforePaint: (instance) => {
    //Access properties of the Blava by deconstructing the
    //passed instance argument
    let { points, canvas, context } = instance;

    //Set the context.globalCompositeOperation before returning
    //to affect the Blava paint
  },

  /**
   * A function to run after the Blava is drawn on the canvas.
   *
   * @arg {Blava} instance The Blava instance for accessing properties
   */
  afterPaint: (instance) => {},
});
```

## Resizing the Blava canvas

Blava responds to layout changes of its containing canvas element,
automatically resizing itself to fit its 100×100 grid. The element's
`width` and `height` attributes are automatically set, so handle all
layout through CSS.

## Other notes

Since Blava is based on the [canvas element](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), all manipulations relevant to that
API are also available.
