"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checksum = exports.encode = exports.stringToCharArray = exports.numberToInt16LE = exports.MspEncoder = void 0;
var stream_1 = require("stream");
var Msp_1 = require("./Msp");
var MspEncoder = /** @class */ (function (_super) {
    __extends(MspEncoder, _super);
    function MspEncoder(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, __assign(__assign({}, options), { objectMode: true })) || this;
    }
    MspEncoder.prototype._transform = function (buffer, _, cb) {
        cb(null, (0, exports.encode)(buffer));
    };
    return MspEncoder;
}(stream_1.Transform));
exports.MspEncoder = MspEncoder;
var numberToInt16LE = function (n) { return [n & 0x00ff, (n & 0xff00) >> 8]; };
exports.numberToInt16LE = numberToInt16LE;
var stringToCharArray = function (buffer) {
    return Array.from(buffer, function (c) { return c.charCodeAt(0); });
};
exports.stringToCharArray = stringToCharArray;
var encode = function (_a) {
    var cmd = _a.cmd, buffer = _a.buffer, _b = _a.flag, flag = _b === void 0 ? 0 : _b, _c = _a.direction, direction = _c === void 0 ? Msp_1.MspDirection.TO_FC : _c, _d = _a.msp2, msp2 = _d === void 0 ? true : _d;
    if (msp2) {
        var headerSize_1 = 3;
        var result_1 = Buffer.allocUnsafe(headerSize_1 + 5 + buffer.length + 1);
        result_1.writeUInt8(0x24, 0);
        result_1.writeUInt8(0x58, 1);
        result_1.writeUInt8(direction, 2);
        result_1.writeUInt8(flag, headerSize_1);
        result_1.writeUInt16LE(cmd, headerSize_1 + 1);
        result_1.writeUInt16LE(buffer.length, headerSize_1 + 3);
        buffer.forEach(function (v, i) { return result_1.writeUInt8(v, headerSize_1 + 5 + i); });
        result_1.writeUInt8((0, exports.checksum)(result_1.slice(headerSize_1, result_1.length - 1)), result_1.length - 1);
        return result_1;
    }
    else {
        var payload = Buffer.from(buffer);
        var size = payload.length;
        var checksum_1 = size ^ cmd;
        for (var i = 0; i < size; i++) {
            checksum_1 ^= payload[i];
        }
        var result = Buffer.concat([
            Buffer.from([0x24, 0x4d, direction]),
            Buffer.from([size, cmd]),
            payload,
            Buffer.from([checksum_1]),
        ]);
        return result;
    }
};
exports.encode = encode;
var checksum = function (buffer) {
    return buffer.reduce(function (crc, n) { return (0, Msp_1.crc8_dvb_s2)(crc, n); }, 0);
};
exports.checksum = checksum;
