declare class Keyboard {
    constructor(container: HTMLElement, options?: {});
    fillKey(noteName: string, fill?: string): void;
    clearKey(noteName: string): void;
    /**
     * Set a custom callback function which is executed anytime a key is clicked.
     *
     * A data object is passed to the callback, containing note information:
     *          { note: integer, name: string }
     */
    setOnKeyClick(
        callback: (event: MouseEvent, keyInfo: { note: number, name: string }) => void
    ): void;
}
declare const PianoKeys: {
    Keyboard: typeof Keyboard;
};
export default PianoKeys;
