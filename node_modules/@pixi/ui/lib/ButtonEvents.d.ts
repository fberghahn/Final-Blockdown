import { Container, FederatedPointerEvent } from 'pixi.js';
import { Signal } from 'typed-signals';
/** Events controller used for {@link Button}. */
export declare class ButtonEvents {
    protected _isMouseIn: boolean;
    protected _isDown: boolean;
    /** Event that is fired when the button is down. */
    onDown: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /**
     * Event that fired when a down event happened inside the button
     * and up event happened inside or outside of the button
     */
    onUp: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /**
     * Event that fired when mouse up event happens outside of the button
     * after the down event happened inside the button boundaries.
     */
    onUpOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that fired when the mouse is out of the view */
    onOut: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that is fired when the button is pressed. */
    onPress: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    /** Event that is fired when the mouse hovers the button. Fired only if device is not mobile.*/
    onHover: Signal<(btn?: this, e?: FederatedPointerEvent) => void>;
    constructor();
    protected connectEvents(view: Container): void;
    protected disconnectEvents(view: Container): void;
    protected processDown(e: FederatedPointerEvent): void;
    protected processUp(e?: FederatedPointerEvent): void;
    protected processUpOut(e?: FederatedPointerEvent): void;
    protected processOut(e?: FederatedPointerEvent): void;
    protected processPress(e: FederatedPointerEvent): void;
    protected processOver(e: FederatedPointerEvent): void;
    /**
     * Method called when the button pressed.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    down(_e?: FederatedPointerEvent): void;
    /**
     * Method called when the button is up.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    up(_e?: FederatedPointerEvent): void;
    /**
     * Method called when the up event happens outside of the button,
     * after the down event happened inside the button boundaries.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    upOut(_e?: FederatedPointerEvent): void;
    /**
     * Method called when the mouse leaves the button.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    out(_e?: FederatedPointerEvent): void;
    /**
     * Method called when the mouse press down the button.
     * To be overridden.
     * @param {FederatedPointerEvent} _e - event data
     */
    press(_e?: FederatedPointerEvent): void;
    /**
     * Method called when the mouse hovers the button.
     * To be overridden.
     * Fired only if device is not mobile.
     * @param {FederatedPointerEvent} _e - event data
     */
    hover(_e?: FederatedPointerEvent): void;
    /** Getter that returns if the button is down. */
    get isDown(): boolean;
}
//# sourceMappingURL=ButtonEvents.d.ts.map