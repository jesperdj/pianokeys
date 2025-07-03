# PianoKeys

Piano keyboard rendered as SVG. This is not a complete app; it is meant to be used as a component in webapps.

See the [demo application](https://github.com/jesperdj/pianokeys-demo).

## Install with npm

You can install PianoKeys as an npm package in your project:

    npm i @jesperdj/pianokeys

## Using PianoKeys

Create a HTML `div` element in your HTML or using JavaScript that will hold the keyboard.

```html
<div id="container"></div>
```

Then in your script, create an instance of `PianoKeys.Keyboard`, passing it the container element.

```javascript
import PianoKeys from '@jesperdj/pianokeys';

const container = document.getElementById('container');
const keyboard = new PianoKeys.Keyboard(container);
```

This will render a keyboard corresponding to a regular 88-key piano, starting at the note A0 and ending at C8.

![88-key keyboard](./example-01.png)

### Rendering a partial keyboard

The constructor of `PianoKeys.Keyboard` takes an optional second parameter, which is an object with options. You can render a partial keyboard by setting the `lowest` and `highest` properties in the options object to set the lowest and highest note (key). These are specified as a note name with an octave number, for example `'A0'`, `'Bb4'`, `'D#6'`.

Note: The keyboard always starts and ends with a white key. If you specify a note name that corresponds to a black key, the next lower or higher white key will be used.

Example:

```javascript
const keyboard = new PianoKeys.Keyboard(container, {
    lowest: 'C2',
    highest: 'C5'
});
```

![Keyboard staring at C2 and ending at C5](./example-02.png)

### Using custom colors

You can set the following properties in the options object to specify custom colors:

- `keyStroke` - stroke style for the outline of keys
- `whiteKeyFill` - fill style for the white keys
- `blackKeyFill` - fill style for the black keys

Example:

```javascript
const keyboard = new PianoKeys.Keyboard(container, {
    lowest: 'C2',
    highest: 'C5',
    keyStroke: '#444',
    whiteKeyFill: 'black',
    blackKeyFill: 'white'
});
```

![Keyboard with custom colors](./example-03.png)

### Highlighting keys

To highlight keys, call `fillKey()` on the keyboard. Example:

```javascript
keyboard.fillKey('C3');
keyboard.fillKey('Bb3');
keyboard.fillKey('Eb4');
keyboard.fillKey('G4');
```

![Keyboard with highlighted keys](./example-04.png)

The `fillKey()` function optionally takes a second parameter to set the fill style to use for that key instead of the default highlight style.

```javascript
keyboard.fillKey('C3', 'red');
```

Call `clearKey()` to unhighlight a key.

```javascript
keyboard.clearKey('C3');
```
If you want to use a custom highlight fill style but you don't want to specify it in each call to `fillKey()`, then you can set the default highlight fill style by adding the following properties to the options that you pass to the constructor:

- `whiteKeyHighlightFill` - default highlight fill style for white keys
- `blackKeyHighlightFill` - default highlight fill style for black keys

Example:

```javascript
const keyboard = new PianoKeys.Keyboard(container, {
    lowest: 'C2',
    highest: 'C5',
    keyStroke: '#444',
    whiteKeyFill: 'black',
    whiteKeyHighlightFill: 'yellow',
    blackKeyFill: 'white',
    blackKeyHighlightFill: 'orange'
});
```

![Keyboard with custom default highlight colors](./example-05.png)

### Responding to key presses

You can set a custom function to be called when a key on PianoKeys is clicked.

The function receives the `MouseEvent` as well as an object containing a note number and string representation of the note (eg: `Bb3` for Bb in the 3rd octave)

Example:

```javascript
const keyboard = new PianoKeys.Keyboard(container);

keyboard.setOnKeyClick((e, keyInfo) => {
    console.log(`key pressed - note number: ${keyInfo.note} ${keyInfo.name}`);
});
```
