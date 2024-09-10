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
exports.MspDecoder = void 0;
var stream_1 = require("stream");
var MspParser_1 = require("./MspParser");
var MspDecoder = /** @class */ (function (_super) {
    __extends(MspDecoder, _super);
    function MspDecoder(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, __assign(__assign({}, options), { objectMode: true })) || this;
        _this.applyMsgState = function () {
            var msgState = _this.msgState;
            if (msgState.state == MspParser_1.MspState.MSP_COMMAND_RECEIVED) {
                _this.push(toMspMsg(msgState));
                msgState.state = MspParser_1.MspState.MSP_IDLE;
            }
            else if (msgState.state == MspParser_1.MspState.MSP_ERROR_RECEIVED) {
                _this.push(new Error("MSP Error"));
                msgState.state = MspParser_1.MspState.MSP_IDLE;
            }
        };
        _this.msgState = (0, MspParser_1.createMspMsgState)();
        return _this;
    }
    MspDecoder.prototype._transform = function (buffer, _, cb) {
        var _this = this;
        buffer.forEach(function (c) {
            (0, MspParser_1.parseNextCharCode)(_this.msgState, c);
            _this.applyMsgState();
        });
        cb();
    };
    return MspDecoder;
}(stream_1.Transform));
exports.MspDecoder = MspDecoder;
var toMspMsg = function (_a) {
    var cmd = _a.cmd, _b = _a.flag, flag = _b === void 0 ? 0 : _b, buffer = _a.buffer;
    return { cmd: cmd, flag: flag, buffer: buffer };
};
