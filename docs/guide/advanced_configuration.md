# Advanced Configuration

Deep control of the Blava is possible with more advanced options.

```javascript
new Blava(c, {
  //Overrides "style" and "pointCount" options
  //Points are based on a 100×100 coordinate system
  //Animation can be set individually on each
  //point in each dimension
  points: [
    { x: 30, y: 30, animated: true },
    { x: 60, y: 30, animated: false },
    { x: 60, y: 60, animated: { x: true, y: false } },
    { x: 60, y: 30 },
  ],

  gradient: {
    from: {
      //Position is based on a 100×100 grid
      position: {
        x: 0,
        y: 50,
      },
      color: "hsl(20, 100%, 82%)",
    },
    to: {
      position: {
        x: 100,
        y: 50,
      },
      color: "hsl(58, 100%, 82%)",
    },
  },
  //How much on the 100×100 grid animated points will move
  //in each dimension
  variance: {
    x: 10,
    y: 15,
  },
  beforePaint: (instance) => {
    //A function to run before the Blava is drawn on the canvas
    //Points are calculated before this function runs

    //Access properties of the Blava by deconstructing the
    //passed instance argument
    let { points, canvas, context } = instance;

    //Set the context.globalCompositeOperation before returning
    //to affect the Blava paint
  },
  afterPaint: (instance) => {
    //A function to run after the Blava is drawn on the canvas
  },
});
```

Since Blava is based on the [canvas element](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), all manipulations relevant to that
API are also available.
