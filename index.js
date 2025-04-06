// PianoKeys - Piano keyboard rendered as SVG
//
// https://github.com/jesperdj/pianokeys
// https://www.npmjs.com/package/@jesperdj/pianokeys
//
// MIT License
//
// Copyright (c) 2021 Jesper de Jong
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function parseNoteName(noteName) {
    class NoteNameParseError extends Error {
        constructor() {
            super('Invalid note name: ' + noteName);
            this.name = 'NoteNameParseError';
            this.noteName = noteName;
        }
    }

    function parseLetter(letter) {
        if (letter == '-') throw new NoteNameParseError();
        const value = 'C-D-EF-G-A-B'.indexOf(letter);
        if (value == -1) throw new NoteNameParseError();
        return value;
    }

    function parseAccidental(accidental) {
        switch (accidental) {
            case 'b': return -1;
            case '#': return 1;
            default: throw new NoteNameParseError();
        }
    }

    function parseOctave(octave) {
        const value = '0123456789'.indexOf(octave);
        if (value == -1) throw new NoteNameParseError();
        return 12 * value;
    }

    switch (noteName.length) {
        case 2: return parseLetter(noteName[0]) + parseOctave(noteName[1]);
        case 3: return parseLetter(noteName[0]) + parseAccidental(noteName[1]) + parseOctave(noteName[2]);
        default: throw new NoteNameParseError();
    }
}

function getOctave(note) {
    return Math.floor(note / 12);
}

function getPitchClass(note) {
    return note % 12;
}

const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_KEYS = [1, 3, 6, 8, 10];

function isWhiteKey(note) {
    return WHITE_KEYS.indexOf(getPitchClass(note)) >= 0;
}

function isBlackKey(note) {
    return BLACK_KEYS.indexOf(getPitchClass(note)) >= 0;
}

function createSvgElement(tag, attrs = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
    }
    return element;
}

const KEY_POSITIONS = [1, 18, 25, 42, 49, 73, 90, 97, 114, 121, 138, 145];

class Keyboard {
    constructor(container, options = {}) {
        let lowest = parseNoteName(options.lowest || 'A0');
        if (isBlackKey(lowest)) lowest--;
        if (lowest < 0) lowest = 0;

        let highest = parseNoteName(options.highest || 'C8');
        if (isBlackKey(highest)) highest++;

        if (highest < lowest) throw new RangeError('Highest note must not be lower than lowest note.');

        const keyStroke = options.keyStroke || 'black';

        const whiteKeyFill = options.whiteKeyFill || 'white';
        this._whiteKeyFill = whiteKeyFill;
        this._whiteKeyHighlightFill = options.whiteKeyHighlightFill || '#00EA9C';

        const blackKeyFill = options.blackKeyFill || 'black';
        this._blackKeyFill = blackKeyFill;
        this._blackKeyHighlightFill = options.blackKeyHighlightFill || '#00CC88';

        const keys = [];
        const whiteKeys = [];
        const blackKeys = [];

        const offset = 168 * getOctave(lowest) + KEY_POSITIONS[getPitchClass(lowest)] - 1;

        for (let note = lowest; note <= highest; note++) {
            const x = 168 * getOctave(note) + KEY_POSITIONS[getPitchClass(note)] - offset;

            const whiteKey = isWhiteKey(note);
            const attrs = whiteKey ?
                { x, y: 1, width: 24, height: 140, rx: 2, ry: 2, stroke: keyStroke, 'stroke-width': 2, fill: whiteKeyFill } :
                { x, y: 1, width: 14, height:  90, rx: 2, ry: 2, stroke: keyStroke, 'stroke-width': 2, fill: blackKeyFill };

            const key = createSvgElement('rect', attrs);
            keys[note] = key;
            if (whiteKey) whiteKeys.push(key); else blackKeys.push(key);
        }

        this._keys = keys;

        // Why it's better to set viewBox instead of width and height: https://css-tricks.com/scale-svg/
        const width = 2 + 24 * whiteKeys.length;
        const svg = createSvgElement('svg', { viewBox: `0 0 ${width} 142` });

        // First add white keys and then black keys, so that the black keys are drawn on top
        for (const whiteKey of whiteKeys) svg.appendChild(whiteKey);
        for (const blackKey of blackKeys) svg.appendChild(blackKey);

        container.appendChild(svg);
    }

    fillKey(noteName, fill) {
        const note = parseNoteName(noteName);
        const key = this._keys[note];
        if (key) key.setAttribute('fill', fill ? fill : (isWhiteKey(note) ? this._whiteKeyHighlightFill : this._blackKeyHighlightFill));
    }

    clearKey(noteName) {
        const note = parseNoteName(noteName);
        const key = this._keys[note];
        if (key) key.setAttribute('fill', isWhiteKey(note) ? this._whiteKeyFill : this._blackKeyFill);
    }

    clearAllKeys() {
        for (const note in this._keys) {
            const key = this._keys[note];
            if (key) {
                key.setAttribute('fill', isWhiteKey(parseInt(note)) ? this._whiteKeyFill : this._blackKeyFill);
            }
        }
    }
}

const PianoKeys = { Keyboard };
export default PianoKeys;
