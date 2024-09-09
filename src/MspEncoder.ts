import { Transform } from "stream";
import { crc8_dvb_s2, MspDirection, MspMsg } from "./Msp";

export class MspEncoder extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
  }

  _transform(buffer, _, cb) {
    cb(null, encode(buffer));
  }
}

export const numberToInt16LE = (n: number) => [n & 0x00ff, (n & 0xff00) >> 8];

export const stringToCharArray = (buffer: string): number[] =>
  Array.from(buffer, (c) => c.charCodeAt(0));

export const encode = ({
  cmd,
  buffer,
  flag = 0,
  direction = MspDirection.TO_FC,
  msp2 = true,
}: MspMsg): Buffer => {
  if (msp2) {
    const headerSize = 3;
    const result = Buffer.allocUnsafe(headerSize + 5 + buffer.length + 1);
    result.writeUInt8(0x24, 0);
    result.writeUInt8(0x58, 1);
    result.writeUInt8(direction, 2);
    result.writeUInt8(flag, headerSize);
    result.writeUInt16LE(cmd, headerSize + 1);
    result.writeUInt16LE(buffer.length, headerSize + 3);
    buffer.forEach((v, i) => result.writeUInt8(v, headerSize + 5 + i));
    result.writeUInt8(
      checksum(result.slice(headerSize, result.length - 1)),
      result.length - 1
    );

    return result;
  } else {
    const payload = Buffer.from(buffer);
    const size = payload.length;
    let checksum = size ^ cmd;
    for (let i = 0; i < size; i++) {
      checksum ^= payload[i];
    }
    const result = Buffer.concat([
      Buffer.from([0x24, 0x4d, direction]), // '$', 'M', '>' | '<' in ASCII
      Buffer.from([size, cmd]),
      payload,
      Buffer.from([checksum]),
    ]);

    return result;
  }
};

export const checksum = (buffer: Buffer): number =>
  buffer.reduce((crc, n) => crc8_dvb_s2(crc, n), 0);
