class ParseNoteError extends Error {
    constructor(noteName) {
        super('Invalid note name: ' + noteName);
        this.name = 'ParseNoteError';
        this.noteName = noteName;
    }
}

function parsePitchClass(noteName) {
    const letter = noteName[0];
    if (letter === '-') throw new ParseNoteError(noteName);
    const pitchClass = 'C-D-EF-G-A-B'.indexOf(letter);
    if (pitchClass == -1) throw new ParseNoteError(noteName);
    return pitchClass;
}

function parseAccidental(noteName) {
    const letter = noteName[1];
    if (letter === 'b') return -1;
    if (letter === '#') return 1;
    throw new ParseNoteError(noteName);
}

function parseOctave(noteName) {
    const letter = noteName[noteName.length == 2 ? 1 : 2];
    const octave = '0123456789'.indexOf(letter);
    if (octave == -1) throw new ParseNoteError(noteName);
    return octave;
}

function parseNoteName(noteName) {
    if (noteName.length == 2) return parsePitchClass(noteName) + 12 * parseOctave(noteName);
    if (noteName.length == 3) return parsePitchClass(noteName) + parseAccidental(noteName) + 12 * parseOctave(noteName);
    throw new ParseNoteError(noteName);
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
            const octave = getOctave(note);
            const pitchClass = getPitchClass(note);
            const x = 168 * octave + KEY_POSITIONS[pitchClass] - offset;

            const whiteKey = isWhiteKey(note);
            const attrs = whiteKey ?
                { x, y: 1, width: 24, height: 140, rx: 2, ry: 2, stroke: keyStroke, 'stroke-width': 2, fill: whiteKeyFill } :
                { x, y: 1, width: 14, height:  90, rx: 2, ry: 2, stroke: keyStroke, 'stroke-width': 2, fill: blackKeyFill };

            const key = createSvgElement('rect', attrs);
            keys[note] = key;
            if (whiteKey) whiteKeys.push(key); else blackKeys.push(key);
        }

        this._keys = keys;

        const svg = createSvgElement('svg', { width: 2 + 24 * whiteKeys.length, height: 142 });
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
}

const PianoKeys = { Keyboard };
export default PianoKeys;