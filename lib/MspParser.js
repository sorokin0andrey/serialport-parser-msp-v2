"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNextCharCode = exports.createMspMsgState = exports.MspState = void 0;
var Msp_1 = require("./Msp");
var MspState;
(function (MspState) {
    MspState[MspState["MSP_IDLE"] = 0] = "MSP_IDLE";
    MspState[MspState["MSP_HEADER_START"] = 1] = "MSP_HEADER_START";
    MspState[MspState["MSP_HEADER_M"] = 2] = "MSP_HEADER_M";
    MspState[MspState["MSP_HEADER_NATIVE"] = 3] = "MSP_HEADER_NATIVE";
    MspState[MspState["MSP_PAYLOAD_NATIVE"] = 4] = "MSP_PAYLOAD_NATIVE";
    MspState[MspState["MSP_CHECKSUM_NATIVE"] = 5] = "MSP_CHECKSUM_NATIVE";
    MspState[MspState["MSP_HEADER_X"] = 6] = "MSP_HEADER_X";
    MspState[MspState["MSP_HEADER_V2_NATIVE"] = 7] = "MSP_HEADER_V2_NATIVE";
    MspState[MspState["MSP_PAYLOAD_V2_NATIVE"] = 8] = "MSP_PAYLOAD_V2_NATIVE";
    MspState[MspState["MSP_CHECKSUM_V2_NATIVE"] = 9] = "MSP_CHECKSUM_V2_NATIVE";
    MspState[MspState["MSP_COMMAND_RECEIVED"] = 10] = "MSP_COMMAND_RECEIVED";
    MspState[MspState["MSP_ERROR_RECEIVED"] = 11] = "MSP_ERROR_RECEIVED";
})(MspState = exports.MspState || (exports.MspState = {}));
var createMspMsgState = function () {
    return {
        state: MspState.MSP_IDLE,
        direction: Msp_1.MspDirection.FROM_FC,
        flag: 0,
        cmd: 0,
        length: 0,
        buffer: [],
        checksum: 0,
    };
};
exports.createMspMsgState = createMspMsgState;
var parseNextCharCode = function (mspMsgState, ch) {
    switch (mspMsgState.state) {
        case MspState.MSP_IDLE:
            if (String.fromCharCode(ch) == "$")
                mspMsgState.state = MspState.MSP_HEADER_START;
            else
                mspMsgState.state = MspState.MSP_IDLE;
            break;
        case MspState.MSP_HEADER_START:
            mspMsgState.buffer = [];
            mspMsgState.checksum = 0;
            if (String.fromCharCode(ch) == "X")
                mspMsgState.state = MspState.MSP_HEADER_X;
            else if (String.fromCharCode(ch) == "M")
                mspMsgState.state = MspState.MSP_HEADER_M;
            else
                mspMsgState.state = MspState.MSP_IDLE;
            break;
        //MSP
        case MspState.MSP_HEADER_M:
            if (String.fromCharCode(ch) == ">" || String.fromCharCode(ch) == "<") {
                mspMsgState.state = MspState.MSP_HEADER_NATIVE;
                mspMsgState.direction = ch;
            }
            else if (String.fromCharCode(ch) == "!")
                mspMsgState.state = MspState.MSP_ERROR_RECEIVED;
            else
                mspMsgState.state = MspState.MSP_IDLE;
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
                else
                    mspMsgState.state = MspState.MSP_CHECKSUM_NATIVE;
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
            else
                mspMsgState.state = MspState.MSP_IDLE;
            break;
        //MSP2
        case MspState.MSP_HEADER_X:
            var char = String.fromCharCode(ch);
            if (char == ">" || char == "<") {
                mspMsgState.state = MspState.MSP_HEADER_V2_NATIVE;
                mspMsgState.direction =
                    char == "<" ? Msp_1.MspDirection.TO_FC : Msp_1.MspDirection.FROM_FC;
            }
            else if (char == "!")
                mspMsgState.state = MspState.MSP_ERROR_RECEIVED;
            else
                mspMsgState.state = MspState.MSP_IDLE;
            break;
        case MspState.MSP_HEADER_V2_NATIVE:
            mspMsgState.buffer.push(ch & 0xff);
            mspMsgState.checksum = (0, Msp_1.crc8_dvb_s2)(mspMsgState.checksum, ch);
            if (mspMsgState.buffer.length == 5) {
                mspMsgState.flag = getFlag(mspMsgState.buffer);
                mspMsgState.cmd = getCmd(mspMsgState.buffer);
                mspMsgState.length = getLength(mspMsgState.buffer);
                mspMsgState.buffer = [];
                if (mspMsgState.length > 0)
                    mspMsgState.state = MspState.MSP_PAYLOAD_V2_NATIVE;
                else
                    mspMsgState.state = MspState.MSP_CHECKSUM_V2_NATIVE;
            }
            break;
        case MspState.MSP_PAYLOAD_V2_NATIVE:
            mspMsgState.buffer.push(ch & 0xff);
            mspMsgState.checksum = (0, Msp_1.crc8_dvb_s2)(mspMsgState.checksum, ch);
            mspMsgState.length--;
            if (mspMsgState.length == 0)
                mspMsgState.state = MspState.MSP_CHECKSUM_V2_NATIVE;
            break;
        case MspState.MSP_CHECKSUM_V2_NATIVE:
            if (mspMsgState.checksum == (ch & 0xff))
                mspMsgState.state = MspState.MSP_COMMAND_RECEIVED;
            else
                mspMsgState.state = MspState.MSP_IDLE;
            break;
        case MspState.MSP_ERROR_RECEIVED:
            mspMsgState.state = MspState.MSP_IDLE;
            break;
        default:
            mspMsgState.state = MspState.MSP_IDLE;
            break;
    }
};
exports.parseNextCharCode = parseNextCharCode;
//MSP2
var getFlag = function (b) { return b[0]; };
var getCmd = function (b) { return b[1] + (b[2] << 8); };
var getLength = function (b) { return b[3] + (b[4] << 8); };
