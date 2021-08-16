# Blava

Performant artful blob generator using canvas 📋

## Install

Via npm, Yarn, pnpm

```bash
pnpm i blava
```

## How to use

1. Import with

   `import { Blava, Point } from '@/main.js';`

2. Place a blank canvas element into a parent container. The canvas will be resized to cover the parent element, which is assumed to be square in aspect ratio
3. Initialize the Blava object with `new Blava(canvas)` where `canvas` is a reference to the canvas element. An additional configuration object can also be included. Animation automatically begins. To toggle the animation, call `Blava.pause` and `Blava.play`

## Configuration options

| parameter     | default value | options                                                                               | notes                                                                                               |
| ------------- | ------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| variance      | `{x:5,y:10}`  | Any object with `x` and `y` number parameters                                         | The extent of movement in each direction                                                            |
| gradient      | `'auto'       | `'auto'` or an object with `from` and `to` color string parameters                    | The gradient fill of the Blava                                                                      |
| movementSpeed | `'slow'`      | One of `['molasses', 'slow', 'medium', 'fast', 'jelly']` or any number                | The speed of movement in point animation. Typically any number between 0.000_05 and 0.01 works well |
| points        | `null`        | `null`, an array of Points, or an array of objects with `x` and `y` number parameters | The points to build the Blava blob with                                                             |
| pointCount    | `6`           | Any number                                                                            | The number of points to build the Blava blob with. Does nothing if `points` parameter is supplied   |
| style         | `'wave'`      | One of `['wave','blob']`                                                              | The style of Blava to generate. Does nothing if `points` parameter is supplied                      |

## Other notes

### Canvas coordinates & animation

A Blava is generated on a canvas whose container element is assumed to be a square. Points are placed on a 100×100 grid, with `{x: 0, y: 0}` being the top left corner of the canvas. The `variance` setting determines the maximum distance the point can travel vertically or horizontally during animation (assuming the Point's `animated` property for that dimension is set to `true`)

### Points

A custom `Point` class is included to track positioning and per-direction animation state of each point in the Blava. The constructor takes an `x` and `y` position as well as an optional configuration object. The configuration object can have an `animated` property with either a boolean to determine whether the Point is animated at all or an object with `x` and `y` properties to set animation state per dimension
