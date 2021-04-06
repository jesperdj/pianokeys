declare class Keyboard {
    constructor(container: HTMLElement, options?: {});
    fillKey(noteName: string, fill: string): void;
    clearKey(noteName: string): void;
}
declare const PianoKeys: {
    Keyboard: typeof Keyboard;
};
export default PianoKeys;
