// Offscreen document
globalThis.bc = new BroadcastChannel("offscreen");

bc.addEventListener("message", async (e) => {
  if (e.data === "resume") {
    await workletStream.ac.resume();
  }
  if (e.data === "suspend") {
    await workletStream.ac.suspend();
  }
});

class AudioWorkletStream {
  constructor({
    codecs = ["audio/wav"],
    urls = [""],
    sampleRate = 44100,
    numberOfChannels = 2,
    latencyHint = 0.33,
    workletOptions = {},
  } = {}) {
    Object.assign(this, {
      ac: new AudioContext({
        sampleRate,
        numberOfChannels,
        latencyHint,
      }),
      codecs,
      urls,
      sampleRate,
      numberOfChannels,
      latencyHint,
      workletOptions,
    });
  }
  async start() {
    console.log(this.ac.baseLatency);
    this.ac.addEventListener("statechange", this.handleEvents);
    await this.ac.audioWorklet.addModule("audioWorklet.js");
    this.aw = new AudioWorkletNode(
      this.ac,
      "audio-worklet-stream",
      this.workletOptions,
    );
    this.aw.connect(this.ac.destination);
    this.worker = new Worker("worker.js", {
      type: "module",
    });
    this.worker.postMessage({
      urls: this.urls,
    }, [this.aw.port]);
    this.worker.addEventListener("message", async (e) => {
      if (e.data.ended) {
        console.log(
          "AudioWorklet stream done.",
          e.data.currentTime,
          e.data.currentFrame,
        );
        await this.stop();
      }
    });
  }
  async stop() {
    await this.ac.suspend();
    this.aw.disconnect();
    this.aw.port.close();
    await this.ac.close();
    this.worker.terminate();
    globalThis.close();
  }
  handleEvents(e) {
    globalThis.console.log(
      e.type === "statechange"
        ? "AudioContext.state:" + e.target.state
        : e.type,
    );
  }
}

let origin = "https://github.com/guest271314/AudioWorkletStream/raw/master/";

// Define this globally so we can inspect and manipulate in DevTools
globalThis.workletStream = new AudioWorkletStream({
  urls: Array.from({
    length: 4,
  }, (_, index) => `${origin}house--64kbs-${index}-wav`),
  // urls: ["https://ia800301.us.archive.org/10/items/DELTAnine2013-12-11.WAV/Deltanine121113Pt3Wav.wav"],
  latencyHint: 0
  workletOptions: {
    numberOfInputs: 1,
    numberOfOutputs: 2,
    channelCount: 2,
    processorOptions: {
      codec: "audio/wav",
      offset: 0,
      index: 0,
      key: 0,
      bytes: 0,
    },
  },
});

globalThis.workletStream.start().catch(console.error);
