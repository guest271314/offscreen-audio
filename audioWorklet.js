// AudioWorkletGlobalScope
import { CODECS } from "./codecs.js";
console.log(globalThis);
class AudioWorkletStream extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    Object.assign(this, options.processorOptions);
    this.map = new Map();
    this.port.onmessage = this.handleStream.bind(this);
  }
  async handleStream({
    data: {
      readable,
    },
  }) {
    this.readable = readable;
    // Another way to do this is define buffer and view on the class
    // slice() the buffer, set in Map, and resize(0) in the for loop
    let buffer = new ArrayBuffer(0, { maxByteLength: 512 });
    let view = new DataView(buffer);
    globalThis.console.log(currentTime, currentFrame);
    const processStream = await this.readable.pipeTo(
      new WritableStream({
        write: async (value) => {
          for (
            let i = this.index === 0 ? 44 : 0;
            i < value.length;
            i++, this.index++
          ) {
            if (buffer.byteLength === 512) {
              this.map.set(
                this.key++,
                buffer,
              );
              buffer = new ArrayBuffer(0, { maxByteLength: 512 });
              view = new DataView(buffer);
            }
            if (buffer.byteLength < 512) {
              buffer.resize(buffer.byteLength + 1);
              view.setUint8(buffer.byteLength - 1, value[i]);
            }
          }
        },
        close() {
          console.log("Writable closed.");
        },
      }),
      new ByteLengthQueuingStrategy({
        highWaterMark: 512,
      }),
    ).then(() => "Done reading and writing stream.").catch(console.error);
    console.log(processStream, currentTime, currentFrame);
  }
  endOfStream() {
    console.log(this.map);
    this.port.postMessage({
      ended: true,
      currentTime,
      currentFrame,
    });
  }
  process(inputs, outputs) {
    if (this.index < 512) {
      return true;
    }

    if (this.bytes >= this.index) {
      this.endOfStream();
      return false;
    }
    const channels = outputs.flat();
    const buffer = this.map.get(this.offset);
    if (buffer === undefined) {
      this.endOfStream();
      return false;
    }
    this.bytes += buffer.byteLength;
    const uint16 = new Uint16Array(buffer);
    CODECS.get(this.codec)(uint16, channels);
    buffer.resize(0);
    this.map.delete(this.offset++);
    return true;
  }
}
try {
  registerProcessor("audio-worklet-stream", AudioWorkletStream);
} catch (e) {
  console.log(e);
}
