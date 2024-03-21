import { AbstractText, AnyTextStyle, AnyTextStyleOptions } from 'pixi.js';
export type PixiText = AbstractText;
export type AnyText = string | number | PixiText;
export type PixiTextClass = new ({ text, style }: {
    text: string;
    style?: PixiTextStyle;
    [x: string]: any;
}) => PixiText;
export type PixiTextStyle = AnyTextStyle | Partial<AnyTextStyleOptions>;
export declare function getTextView(text: AnyText): PixiText;
//# sourceMappingURL=text.d.ts.map