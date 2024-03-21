import { Spring } from './Spring';
export default class ScrollSpring {
    done: boolean;
    to: number;
    protected _spring: Spring;
    protected _pos: number;
    protected _speed: number;
    protected _correctSpeed: boolean;
    constructor();
    start(speed: number, pos: number, to: number): void;
    update(): number;
    cancel(): void;
}
//# sourceMappingURL=ScrollSpring.d.ts.map