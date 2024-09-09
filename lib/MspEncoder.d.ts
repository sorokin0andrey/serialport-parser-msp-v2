/// <reference types="node" />
import { Transform } from "stream";
import { MspMsg } from "./Msp";
export declare class MspEncoder extends Transform {
    constructor(options?: {});
    _transform(buffer: any, _: any, cb: any): void;
}
export declare const numberToInt16LE: (n: number) => number[];
export declare const stringToCharArray: (buffer: string) => number[];
export declare const encode: ({ cmd, buffer, flag, direction, msp2, }: MspMsg) => Buffer;
export declare const checksum: (buffer: Buffer) => number;
