/// <reference types="node" />
import { Transform } from "stream";
import { MspMsgState } from "./MspParser";
export declare class MspDecoder extends Transform {
    msgState: MspMsgState;
    constructor(options?: {});
    _transform(buffer: any, _: any, cb: any): void;
    private applyMsgState;
}
