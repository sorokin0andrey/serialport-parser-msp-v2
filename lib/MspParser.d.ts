import { MspDirection } from "./Msp";
export declare enum MspState {
    MSP_IDLE = 0,
    MSP_HEADER_START = 1,
    MSP_HEADER_M = 2,
    MSP_HEADER_NATIVE = 3,
    MSP_PAYLOAD_NATIVE = 4,
    MSP_CHECKSUM_NATIVE = 5,
    MSP_HEADER_X = 6,
    MSP_HEADER_V2_NATIVE = 7,
    MSP_PAYLOAD_V2_NATIVE = 8,
    MSP_CHECKSUM_V2_NATIVE = 9,
    MSP_COMMAND_RECEIVED = 10,
    MSP_ERROR_RECEIVED = 11
}
export interface MspMsgState {
    state: MspState;
    direction: MspDirection;
    flag: number;
    cmd: number;
    length: number;
    buffer: number[];
    checksum: number;
}
export declare const createMspMsgState: () => MspMsgState;
export declare const parseNextCharCode: (mspMsgState: MspMsgState, ch: number) => void;
