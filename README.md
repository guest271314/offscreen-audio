# offscreen-audio
Offscreen audio, side panel controller, until we make audio in/from a ServiceWorker without a document happen

![Screenshot_2023-09-24_17-58-53](https://github.com/guest271314/offscreen-audio/assets/4174848/9b06e260-0e76-4ca9-8e71-4cc6f596bb78)


# References:

- [Expose AudioContext in Worker/ServiceWorker #2383](https://github.com/WebAudio/web-audio-api/issues/2383)

# Prior art/related work:

- [sw-extension-audio
](https://github.com/guest271314/sw-extension-audio)
- [AudioWorkletStream](https://github.com/guest271314/AudioWorkletStream)

# Installation:

Download and unzip, or use `git` to fetch the repository. Navigate to `chrome://extensions`, toggle `Developer mode` to on, click `Load unpacked`, select the `offscreen-audio` folder.

# TODO: 

- Convert from MP3, Opus, AAC, FLAC, etc. to floats on the fly 
- Include folder and file drag and drop capability in controller to implements playlists
- Implement an indefinite stream where peers can add to, share, and listen to the same stream
- Figure out a way to use Media Session with Web Audio API displayed in controlled from global media controls on the main window
- ...

We can already do most of the above. We just need to carefully incorporate such functionality into our controller panel.

# License
[WTFPLv2](http://www.wtfpl.net/about/)
