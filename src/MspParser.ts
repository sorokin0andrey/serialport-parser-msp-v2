import { crc8_dvb_s2, MspDirection } from "./Msp";

export enum MspState {
  MSP_IDLE,
  MSP_HEADER_START,
  MSP_HEADER_M,
  MSP_HEADER_NATIVE,
  MSP_PAYLOAD_NATIVE,
  MSP_CHECKSUM_NATIVE,
  MSP_HEADER_X,
  MSP_HEADER_V2_NATIVE,
  MSP_PAYLOAD_V2_NATIVE,
  MSP_CHECKSUM_V2_NATIVE,
  MSP_COMMAND_RECEIVED,
  MSP_ERROR_RECEIVED,
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

export const createMspMsgState = (): MspMsgState => {
  return {
    state: MspState.MSP_IDLE,
    direction: MspDirection.FROM_FC,
    flag: 0,
    cmd: 0,
    length: 0,
    buffer: [],
    checksum: 0,
  };
};

export const parseNextCharCode = (mspMsgState: MspMsgState, ch: number) => {
  switch (mspMsgState.state) {
    case MspState.MSP_IDLE:
      if (String.fromCharCode(ch) == "$")
        mspMsgState.state = MspState.MSP_HEADER_START;
      else mspMsgState.state = MspState.MSP_IDLE;
      break;
    case MspState.MSP_HEADER_START:
      mspMsgState.buffer = [];
      mspMsgState.checksum = 0;
      if (String.fromCharCode(ch) == "X")
        mspMsgState.state = MspState.MSP_HEADER_X;
      else if (String.fromCharCode(ch) == "M")
        mspMsgState.state = MspState.MSP_HEADER_M;
      else mspMsgState.state = MspState.MSP_IDLE;
      break;

    //MSP
    case MspState.MSP_HEADER_M:
      if (String.fromCharCode(ch) == ">" || String.fromCharCode(ch) == "<") {
        mspMsgState.state = MspState.MSP_HEADER_NATIVE;
        mspMsgState.direction = ch;
      } else if (String.fromCharCode(ch) == "!")
        mspMsgState.state = MspState.MSP_ERROR_RECEIVED;
      else mspMsgState.state = MspState.MSP_IDLE;
      break;
    case MspState.MSP_HEADER_NATIVE:
      mspMsgState.buffer.push(ch & 0xff);
      if (mspMsgState.buffer.length == 2) {
        mspMsgState.length = mspMsgState.buffer[0];
        mspMsgState.cmd = mspMsgState.buffer[1];
        mspMsgState.checksum = mspMsgState.length ^ mspMsgState.cmd;
        mspMsgState.buffer = [];
        if (mspMsgState.length > 0)
          mspMsgState.state = MspState.MSP_PAYLOAD_NATIVE;
        else mspMsgState.state = MspState.MSP_CHECKSUM_NATIVE;
      }
      break;
    case MspState.MSP_PAYLOAD_NATIVE:
      mspMsgState.buffer.push(ch & 0xff);
      mspMsgState.length--;
      if (mspMsgState.length == 0)
        mspMsgState.state = MspState.MSP_CHECKSUM_NATIVE;
      break;
    case MspState.MSP_CHECKSUM_NATIVE:
      if (mspMsgState.checksum == (ch & 0xff))
        mspMsgState.state = MspState.MSP_COMMAND_RECEIVED;
      else mspMsgState.state = MspState.MSP_IDLE;
      break;

    //MSP2
    case MspState.MSP_HEADER_X:
      const char = String.fromCharCode(ch);
      if (char == ">" || char == "<") {
        mspMsgState.state = MspState.MSP_HEADER_V2_NATIVE;
        mspMsgState.direction =
          char == "<" ? MspDirection.TO_FC : MspDirection.FROM_FC;
      } else if (char == "!") mspMsgState.state = MspState.MSP_ERROR_RECEIVED;
      else mspMsgState.state = MspState.MSP_IDLE;
      break;
    case MspState.MSP_HEADER_V2_NATIVE:
      mspMsgState.buffer.push(ch & 0xff);
      mspMsgState.checksum = crc8_dvb_s2(mspMsgState.checksum, ch);
      if (mspMsgState.buffer.length == 5) {
        mspMsgState.flag = getFlag(mspMsgState.buffer);
        mspMsgState.cmd = getCmd(mspMsgState.buffer);
        mspMsgState.length = getLength(mspMsgState.buffer);
        mspMsgState.buffer = [];
        if (mspMsgState.length > 0)
          mspMsgState.state = MspState.MSP_PAYLOAD_V2_NATIVE;
        else mspMsgState.state = MspState.MSP_CHECKSUM_V2_NATIVE;
      }
      break;
    case MspState.MSP_PAYLOAD_V2_NATIVE:
      mspMsgState.buffer.push(ch & 0xff);
      mspMsgState.checksum = crc8_dvb_s2(mspMsgState.checksum, ch);
      mspMsgState.length--;
      if (mspMsgState.length == 0)
        mspMsgState.state = MspState.MSP_CHECKSUM_V2_NATIVE;
      break;
    case MspState.MSP_CHECKSUM_V2_NATIVE:
      if (mspMsgState.checksum == (ch & 0xff))
        mspMsgState.state = MspState.MSP_COMMAND_RECEIVED;
      else mspMsgState.state = MspState.MSP_IDLE;
      break;
    case MspState.MSP_ERROR_RECEIVED:
      mspMsgState.state = MspState.MSP_IDLE;
      break;
    default:
      mspMsgState.state = MspState.MSP_IDLE;
      break;
  }
};

//MSP2
const getFlag = (b: number[]) => b[0];
const getCmd = (b: number[]) => b[1] + (b[2] << 8);
const getLength = (b: number[]) => b[3] + (b[4] << 8);
