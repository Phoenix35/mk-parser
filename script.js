(function(window, document, undefined) {
'use strict';

function appendFileInterface(file) {

  var progressDiv = document.createElement('div');

  // The file name, ...
  var progressLegend = document.createTextNode(file.name+ ' ');

  progressDiv.appendChild(progressLegend);

  // ... the progress bar, ...
  var progressBar = document.createElement('progress');
  progressBar.value = 0;
  progressBar.id = file.UID+ '-progress';

  progressDiv.appendChild(progressBar);

  // ... the file size, ...
  progressLegend = document.createTextNode(' ' +formatFileSize(file.size)+ ' ');

  progressDiv.appendChild(progressLegend);

  document.body.appendChild(progressDiv);
}

/*
.relativeOffset -> (e.g.: 0x53AC: offset at end of segment's length)
.absoluteOffset
.value
// SeekHead at end of file? (SeekHead refers to another SeekHead)
// => Fetch the last bytes

  1. Test first 4 bytes for EBML (START)
  // 1.1. Gather EBMLMaxIDLength
  // 1.2. Gather EBMLMaxSizeLength
  2. Go to end of EBML / Start of Segment
  3. Gather length of Segment, store offset of end)
  3.1 Do not treat multi segments (check with filesize)
  4. Decompose SeekHead
  4.1 Reference to another SeekHead ?
  .1Y Go to the pointed SeekHead (position is relative to beginning segment)
  5. Retrieve segmentInfo (0x1549A966)
  5.1 Retrieve duration (single precision)
  6. Retrieve tracks (0x1654AE6B)
  6.
*/

const EBML = {
  START: {
    name: 'EBML',
    id: [0x00, 0x1A45DFA3]
  },
  VERSION: {
    name: 'EBMLVersion',
    id: [0x00, 0x00004286],
    def: 1
  },
  READVERSION: {
    name: 'EBMLReadVersion',
    id: [0x00, 0x000042F7],
    def: 1
  },
  MAXIDLENGTH: {
    name: 'EBMLMaxIDLength',
    id: [0x00, 0x000042F2],
    def: 4
  },
  MAXSIZELENGTH: {
    name: 'EBMLMaxSizeLength',
    id: [0x00, 0x000042F3],
    def: 8
  },
  DOCTYPE: {
    name: 'DocType',
    id: [0x00, 0x00004282],
    def: 'matroska'
  },
  DOCTYPEVERSION: {
    name: 'DocTypeVersion',
    id: [0x00, 0x00004287],
    def: 1
  },
  DOCTYPEREADVERSION: {
    name: 'DocTypeReadVersion',
    id: [0x00, 0x00004285],
    def: 1
  },
  VOID: {
    name: 'void',
    id: [0x00, 0x000000EC]
  }
};
const SEGMENT = {
  name: 'Segment',
  id: [0x00, 0x18538067],
  SeekHead: {
    name: 'SeekHead',
    id: [0x00, 0x114D9B74],
    Seek: {
      name: 'Seek',
      id: [0x00, 0x4DBB], // tracks: 1654ae6b
      ID: {
        name: 'SeekID',
        id: [0x00, 0x53AB]
      },
      Position: {
        name: 'SeekPosition',
        id: [0x00, 0x53AC]
      }
    }
  },
  Info: {
    name: 'SegmentInfo',
    id: [0x00, 0x1549A966],
    UID: {
      name: 'SegmentUID',
      id: [0x00, 0x0073A4]
    },
    Filename: {
      name: 'SegmentFilename',
      id: [0x00, 0x007384]
    },
    PrevUID: {
      name: 'PrevUID',
      id: [0x00, 0x3CB923]
    },
    PrevFilename: {
      name: 'PrevFilename',
      id: [0x00, 0x3C83AB]
    },
    NextUID: {
      name: 'NextUID',
      id: [0x00, 0x3EB923]
    },
    NextFilename: {
      name: 'NextFilename',
      id: [0x00, 0x3E83BB]
    },
    TimecodeScale: {
      name: 'TimecodeScale',
      id: [0x00, 0x2AD7B1],
      def: 1000000
    },
    Duration: {
      name: 'Duration',
      id: [0x00, 0x004489]
    },
    DateUTC: {
      name: 'DateUTC',
      id: [0x00, 0x004461]
    },
    Title: {
      name: 'Title',
      id: [0x00, 0x007BA9]
    },
    MuxingApp: {
      name: 'MuxingApp',
      id: [0x00, 0x004D80]
    },
    WritingApp: {
      name: 'WritingApp',
      id: [0x00, 0x005741]
    },
  },
  /* I do not care about this one.
  Cluster: {

  },*/
  Tracks: {
    name: 'Tracks',
    id: [0x00, 0x1654AE6B],
    Entry: {
      name: 'TrackEntry',
      id: [0x00, 0x00AE],
      Number: {
        name: 'TrackNumber',
        id: [0x00, 0x0000D7]
      },
      UID: {
        name: 'TrackUID',
        id: [0x00, 0x0073C5]
      },
      Type: {
        name: 'TrackType',
        id: [0x00, 0x000083]
      },
      FlagEnabled: {

      },
      FlagDefault: {

      },
      FlagLacing: {

      },
      MinCache: {

      },
      MaxCache: {

      },
      DefaultDuration: {
        name: 'DefaultDuration',
        id: [0x00, 0x23E383]
      },
      TimecodeScale: {
        name: 'TrackTimecodescale',
        id: [0x00, 0x23314F],
        def: 1
      },
      Name: {
        name: 'Name',
        id: [0x00, 0x00536E]
      },
      Language: {
        name: 'Language',
        id: [0x00, 0x22B59C],
        def: 'eng'
      },
      CodecID: {
        name: 'CodecID',
        id: [0x00, 0x000086],
      },
      CodecPrivate: {

      },
      CodecName: {

      },
      CodecSettings: {

      },
      CodecInfoURL: {

      },
      CodecDownloadURL: {

      },
      CodecDecodeAll: {

      },
      TrackOverlay: {

      },
      Video: {
        name: 'Video',
        id: [0x00, 0x0000E0],
        FlagInterlaced: {
          id: [0x00, 0x00009A],
          def: 0
        },
        StereoMode: {
          id: [0x00, 0x0053B8],
          def: 0
        },
        PixelWidth: {
          name: 'PixelWidth',
          id: [0x00, 0x0000B0]
        },
        PixelHeight: {
          name: 'PixelHeight',
          id: [0x00, 0x0000BA]
        },
        DisplayWidth: {
          name: 'DisplayWidth',
          id: [0x00, 0x0054B0]
        },
        DisplayHeight: {
          name: 'DisplayHeight',
          id: [0x00, 0x0054BA]
        },
        DisplayUnit: {
          name: 'DisplayUnit',
          id: [0x00, 0x0054B2],
          def: 0
        },
        AspectRatioType: {
          id: [0x00, 0x0054B3],
          def: 0
        },
        ColourSpace: {
          id: [0x00, 0x2EB524]
        },
        GammaValue: {
          id: [0x00, 0x2FB523]
        }
      },
      Audio: {
        name: 'Audio',
        id: [0x00, 0x00E1],
        SamplingFrequency: {
          id: [0x00, 0x0000B5],
          def: Bytes2Float32(0x8000),
        },
        OutputSamplingFrequency: {
          id: [0x00, 0x0078B5],
          def: Bytes2Float32(0x8000),
        },
        Channels: {
          id: [0x00, 0x000094],
          def: 1
        },
        ChannelsPositions: {
          id: [0x00, 0x007D7B]
        },
        BitDepth: {
          id: [0x00, 0x006264]
        }
      },
      ContentEncodings: {

      }
    }
  },
  /* I do not care about those either.
  Cues: {

  },
  Attachments: {

  },
  Chapters: {

  },
  Tags: {

  },
  */
};

const HUMAN = {
  size: function ()  {

    return  (typeof this.value !== 'number') ?
      '' :
      (this.value >= 1073741824) ?
        (this.value / 1073741824).toFixed(2) + ' GiB' :
        (this.value >= 1048576) ?
          (this.value / 1048576).toFixed(2) + ' MiB' :
          (this.value / 1024).toFixed(2) + ' KiB';

  },
  duration: function () {
    let du = Math.ceil(this.value / 1000000),
        ms = ~~ ((du % 1000)),
        s  = ~~ ((du / 1000) % 60),
        m  = ~~ ((du / (1000*60)) % 60),
        h  = ~~ ((du / (1000*60*60)) % 24);

        h  = (h < 10) ? '0' + h : h;
        m  = (m < 10) ? '0' + m : m;
        s  = (s < 10) ? '0' + s : s;
        ms = ('00'+ms).slice(-3);

        return h + ":" + m + ":" + s + "." + ms;
  },
  type: {
    0x01: 'video',
    0x02: 'audio',
    0x03: 'complex',
    0x10: 'logo',
    0x11: 'subtitle',
    0x12: 'button',
    0x20: 'control'
  }
};

Math.log1p = Math.log1p || ((n) => {
  return Math.log(1 + n);
});
/**
 * Fast way of returning the length of a number in a given base.
 * @param {Number} n - The number to be rendered
 * @param {Number} base - The base in which the number is represented
 * @example
 * // returns 8
 * numberLength(0xAF,  2) // (0b10101111)
 * @example
 * // returns 3
 * numberLength(0xAF,  8) // (0o0257)
 * @example
 * // returns 2
 * numberLength(0xAF, 16) // (0xAF)
 * @example
 * // returns 1
 * numberLength(0xAF,256) // (unsigned integer 175)
 * @return {Number} Length of the number in the base
 */
let numberLength = (number, base) => {
  // http://jsperf.com/number-length-math-logs-style/3
  return Math.ceil(Math.log1p(number) / Math.log(base));
};

// Generate unique identifier for a file
// Allows to cancel individual file upload (resume in the future)
let generateUniqueIdentifier = (file) => {
  return file.size + '-' + file.name.replace(/[^0-9a-zA-Z_-]/img, '');
};

/**
 * Given an integer containing 4 bytes holding an IEEE-754 32-bit
 * single precision float, this will produce the (roughly) correct Javascript
 * number value. Used for Duration
 * Thanks [@Haravikk]{@link http://stackoverflow.com/a/16001019}
 * @example
 * // returns 2562200
 * Bytes2Float32(0x4a1c6260);
 * @param {Number} bytes - The bytes (single precision) to be converted
 * @return {Number} The number value
 */
function Bytes2Float32(bytes) {
  var sign = (bytes & 0x80000000) ? -1 : 1;
  var exponent = ((bytes >> 23) & 0xFF) - 127;
  var significand = (bytes & ~(-1 << 23));

  if (exponent == 128) {
      return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);
  }
  else if (exponent == -127) {
      if (significand == 0) {
        return sign * 0.0;
      }
      exponent = -126;
      significand /= (1 << 22);
  }
  else {
    significand = (significand | (1 << 23)) / (1 << 23);
  }
  return sign * significand * Math.pow(2, exponent);
}

/**
 * A little tool to help with 3 byte integers (always big endian)
 * @param {Number} byteOffset
 * @return {Number}
 */
DataView.prototype.getUint24 = function (byteOffset) {
    var b = new Uint8Array(this.buffer, this.byteOffset + byteOffset);
    return ((b[0] << 16) |
            (b[1] << 8) |
            (b[2]));
};

let selectText = (elm) => {
    let range,
        selection;

    if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(elm);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

// To find MSB: ( 1 << (numberLength(n, 2) - 1) )

/**
 * @typedef {FilePromise} A promise specialized to asynchronously render
 * informations about a file (using FileReader).
 * @extends Promise
 * @method readBytes
 */
let mk = {},
    filePromise;

/**
 * A function that asynchronously fetches a file
 * @param {Blob} file
 * @return {FilePromise}
 */
mk.fetchFile = function (file) {

  filePromise = new Promise(function(resolve, reject) {

    let reader = new FileReader();

    reader.onloadend = function(e) {
      if (e.target.readyState === FileReader.DONE) {

        if (e.target.result.byteLength === 0) {
          reject(Error('Empty file'));
        }
        // The file can be fetched, return it
        resolve(file);
      }
      else {
        reject(Error(e));
      }
    };

    reader.onerror = function(e) {
      reject(Error(e));
    };

    // Load the first byte to be sure the file is not empty
    // or that any silly error rises
    reader.readAsArrayBuffer(file.slice(0, 1));

  }).catch((err) => {
    mk.Error(err, 'Fetching file', file.name, 'failed!');
  });

  /**
   * Add a new function to asynchronously read the bytes
   * @param {Number} start - The beginning offset
   * @param {Number} stop - The end offset
   * @return {Promise.<Array>} A promise which resolves as an array of
   * [0] the filePromise object
   * [1] the bytes in a Uint8Array
   */
  filePromise.readBytes = function (start = 0, stop = file.size) {
    // Only read bytes if the file is successfully loaded
    return this.then(function() {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onloadend = function (e) {
          if (e.target.readyState === FileReader.DONE) {

            let result = new Uint8Array(e.target.result, 0);
            if (result.byteLength === 0) {
              reject(Error('Empty file'));
            }

            resolve([filePromise, result]);
          }
          else {
            reject(Error(e));
          }
        };

        reader.onerror = function(e) {
          reject(Error(e));
        };

        reader.readAsArrayBuffer(file.slice(start, stop));

      }).catch((err) => {
        mk.Error(err, 'Reading bytes', start, 'to', stop,
                'from', file.name, 'failed!');
      });
    });
  };

  return filePromise;
};

/**
 *
 * @param {Array<Blob>} files
 */
mk.inputFile = (files) => {

  for(let f of files) {
    f.UID = generateUniqueIdentifier(f);
    mk.displayInfo(f);
  }
  return false;

////////////////////////

  /*
  Create the interface for the user:
    name
    progress bar
    filesize uploaded/total filesize
    image to cancel
  */
  appendFileInterface(file);

  return false;

};
/*
  Store name
  Store size
  Read first 255 bytes
  Search SegmentInfo
  No SegmentInfo?
    Critical error
  Goto SegmentInfo
  [SegmentInfo
    No UID?
      Critical error
    Store UID
    title?
      Store title
    Store duration * timecodescale (time in nanoseconds)
  ]

  Search tracks
  No tracks?
    Search SeekHead
    No other SeekHead?
      End search
    Goto SeekHead
  Goto Tracks

  [SeekHead
    Search tracks
    No tracks?
      End search
    Goto Tracks
  ]

  [Tracks
    Loop through TrackEntry
      Search Type
      Type 0x01? (video)
        Store PixelWidth
        Store PixelHeight
        Store language || und
      Type 0x02? (audio)
        Store name || und
        Store language || und
      Type 0x11? (subtitle)
        Store name || und
        Store language || und
  ]

  Search chapters
  No chapters?
    End search
  Store chapter existence
*/

/**
 * @param {File} file
 */
mk.displayInfo = (file) => {

  let result,
      chunk,
      offset,
      reading,
      segmentInfo,
      tracks,
      seekHead,
      start,
      chunkLength,
      fileInfo = {};

  let handleSegmentInfo = () => {

  };
  let handleTracks = () => {

  };

  result = mk.
    fetchFile(file).
    readBytes(0, 255). // This an arbitrary length. It should be enough
    then((fp) => {

      console.log();
      console.group(file.UID);

      offset = 0;
      chunk = fp[1];

      mk.HTMLText('Reading file ' +file.name+ '...');
      /*
        Start of EBML block
      */
      console.log('Reading first few bytes to confirm EBML');

      [reading, offset] = mk.seekElement(chunk, EBML.START,
        offset);

      if (!reading) {
        mk.Error(
          new Error('First bytes do not correspond to EBML'),
          file.name+ ' is not a Matroska file'
        );
      }
      // You can look for more infos (EBMLVersion, EBMLMaxIDLength, etc...)
      console.log('EBML found');
      /*
        End of EBML block
      */

      /*
        Start of SeekHead
        Search for SegmentInfo + (tracks || SeekHead)
      */

      /**
       * Fails test4.mkv => does not support streaming (no SeekHead)
       * @todo Support streaming (make SeekHead not mandatory for them)
       */
       console.log('Searching for SeekHead');

      [reading, offset] = mk.seekElement(chunk, SEGMENT.SeekHead,
        offset, null, true);
      // reading.offset is the offset at which SeekHead start
      // This corresponds to the relative offset of others' position

      console.log('SeekHead found. Searching for SegmentInfo and Tracks');
      // SegmentInfo is for me mandatory
      if (!(segmentInfo = mk.seekPosition(chunk, SEGMENT.Info, reading.offset))
      ) {
        console.log('SegmentInfo not found. Searching for secondary SeekHead');
        seekHead = mk.seekPosition(chunk, SEGMENT.SeekHead, reading.offset);
      }
      else {
        console.log('SegmentInfo found');
      }

      if ((tracks = mk.seekPosition(chunk, SEGMENT.Tracks, reading.offset))) {
      /**
       * TO DO: Update documentation
       * @return {Array<*>} The FilePromise for further bytes reading,
       * the Segmentinfo's and Tracks' positions.
       * If there is no Tracks but a SeekHead, return the promise to find it
       * You can extend this by adding other elements (cues, chapters, ...)
       */
        console.log('Tracks found');
        return [
          fp[0],
          // 15 = 7 bytes for MaxIDLength + 8 bytes for maximum Vint value
          fp[0].readBytes(reading.offset + segmentInfo,
            reading.offset + segmentInfo + 15),
          fp[0].readBytes(reading.offset + tracks,
            reading.offset + tracks + 15)
        ];
      }

      console.log('Tracks not found. Go to secondary SeekHead');
      return fp[0].
        readBytes(reading.offset + seekHead).
        then((chunk) => {

          // This corresponds to the relative offset of others' position
          start = reading.offset;

          console.log('Secondary SeekHead found at offset', seekHead);

          /**
           * Fails test4.mkv => does not support streaming (no SeekHead)
           * @todo Support streaming (make SeekHead not mandatory for them)
           */
          [reading, offset] = mk.seekElement(chunk[1], SEGMENT.SeekHead,
            0, null, true);


          console.log('Searching for SegmentInfo');
          // SegmentInfo is for me mandatory
          if (!(segmentInfo = mk.seekPosition(
            chunk[1],
            SEGMENT.Info,
            reading.offset)
          )) {
            mk.Error(
              new Error('SegmentInfo not found'),
              'Malformed matroska file'
            );
          }
          console.log('SegmentInfo found');

          console.log('Searching for Tracks');
          if ((tracks = mk.seekPosition(
            chunk[1],
            SEGMENT.Tracks,
            reading.offset)
          )) {
            console.log('Tracks found');
            reading.offset = start;

          /**
           * @return {Array<*>} The FilePromise for further bytes reading,
           * the Segmentinfo's and Tracks' positions.
           * You can extend this by adding other elements (cues, chapters, ...)
           */
            return [
              chunk[0],
              // 15 = 7 bytes for MaxIDLength + 8 bytes for maximum Vint value
              chunk[0].readBytes(start + segmentInfo,
                start + segmentInfo + 15),
              chunk[0].readBytes(start + tracks,
                start + tracks + 15)
            ];
          }
          else {
            console.log('Tracks not found');
            return [
              chunk[0],
              chunk[0].readBytes(start + segmentInfo,
                start + segmentInfo + 15),
            ];
          }

      });

      /*
        End of SeekHead
      */

    }).
    then((res) => {

    // If you want to externalize it, mind the function scoped variables
    // file, reading, segmentInfo
      /*
        Reminder:
        res[0] = FilePromise
        res[1] = SegmentInfo
        res[2] = Tracks || undefined
      */

      /*
        Start of SegmentInfo
      */
      res[1].then((fifteen) => {

        console.log('Serializing SegmentInfo');
        [chunkLength, offset] = mk.elementSize(fifteen[1], SEGMENT.Info);
        start = reading.offset + segmentInfo;

        // Return the data in the SegmentInfo chunk
        res[0].
        readBytes(start + offset,
          start + offset + chunkLength[0] * 4294967296 + chunkLength[1]
        ).
        then((chunk) => {

          /*
            TODO: Separate each step
            Find a way to avoid overlap which results in bad results
            Overlap: The ID of one element is present
            in the value of a previous element
            One way: parse EVERYTHING and select afterwards
          */
          return {
            name: file.name.substr(0, file.name.lastIndexOf('.')) || file.name,
            size: {
              value: file.size,
              toHuman: HUMAN.size
            },
            // UID is mandatory for me
            UID: mk.sumBytes(mk.seekElement(chunk[1],
              SEGMENT.Info.UID,
              0,
              null,
              true)[0].value),
            duration: {
              value: (mk.sumBytes(mk.seekElement(chunk[1],
                SEGMENT.Info.TimecodeScale,
                0,
                null,
                false)[0].value)[0] || SEGMENT.Info.TimecodeScale.def) *
                mk.getFloat(mk.seekElement(chunk[1],
                SEGMENT.Info.Duration,
                0,
                null,
                false)[0].value),
              toHuman: HUMAN.duration
            },
            // title can also be found in Tags.Tag.SimpleTag.TagString = TITLE
            title: mk.bytesToString(mk.seekElement(chunk[1],
                SEGMENT.Info.Title,
                0,
                null,
                false)[0].value) || undefined,
          };

        }).
        then((f) => {
          fileInfo = f;
        });

      });
      /*
        End of SegmentInfo
      */

     return res;
    }).
    then((res) => {

      /*
        Start of Tracks
      */
      if (res[2]) {
        res[2].then((fifteen) => {

          console.log('Serializing Tracks');
          [chunkLength, offset] = mk.elementSize(fifteen[1], SEGMENT.Tracks);
          start = reading.offset + tracks;
          // Return the data in the Tracks chunk
          res[0].
          readBytes(start + offset,
            start + offset + chunkLength[0] * 4294967296 + chunkLength[1]
          ).
          then((chunk) => {

            return mk.splitTracks(chunk[1]).map(function (track) {

              track = track.value;

              let t = {
                id: mk.seekElement(track,
                  this.Number,
                  0,
                  null,
                  true)[0].value[0],
                // Being non-consistent is awesome
                // Never use HUMAN inside the JSON, only for HTML display
                type: HUMAN.type[mk.seekElement(track,
                  this.Type,
                  0,
                  null,
                  true)[0].value[0]],
                name: mk.bytesToString(mk.seekElement(track,
                  this.Name,
                  0,
                  null,
                  false)[0].value) || undefined,
                language: mk.bytesToString(mk.seekElement(track,
                  this.Language,
                  0,
                  null,
                  false)[0].value) || this.Language.def,
                codec: mk.bytesToString(mk.seekElement(track,
                  this.CodecID,
                  0,
                  null,
                  true)[0].value)
              };

              if (t.type === this.Video.id[1]) {

              /*
                Other B0 (PixelWidth) and BA (PixelHeight)
                may appear in the entry, which crashes this test

                t.width = mk.seekElement(track,
                  this.Video.PixelWidth,
                  0,
                  null,
                  true)[0].value;
                t.height = mk.seekElement(track,
                  this.Video.PixelHeight,
                  0,
                  null,
                  true)[0].value;
              */
              }

              return t;
            }, SEGMENT.Tracks.Entry);

          }).then((f) => {

            fileInfo.tracks = f;

            console.log('Successful operation!');
            console.log(fileInfo);
            console.groupEnd();
            mk.HTMLText(fileInfo);

          });


        });
      }
      /*
        End of Tracks
      */

    }).
    then((res) => {
    }).
    catch((err) => {
      console.group();
      console.info('Process aborted for', file.UID);
      console.log(err);
      console.groupEnd();
    });

}

/*

  Symbol

  Done
  // base64 of Google design ic_done_black_18dp_1x.png
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAD8x0bcAAAAUUlEQVR4AWMYYoCJoZ1BgZCSeQz/GQrwKWEEK2nAr2QumUpEGfYy6MKVzMFuijzDA4bXDHqoSjCBAliZAcNsmBLcyn7BlOBX1kA4jAUGRUwDAKkmGZ4jJs3sAAAAAElFTkSuQmCC

  Error
  // base64 of Google design ic_error_black_18dp_1x.png  data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAD8x0bcAAAAkElEQVR4AZXNUUqAQBRG4e8taysVlUvNMoWWEkHQFhKxdQQJNZMgxMjkkOc8XTj811Eu3Rl8LL5pnMuotIKY+O3WyTZ5FuU+pVkn7tiwcrV5hOQKLoBWzKJsayxGAzAXo8//RDMwiQVHoC8u3QN1IQquWXkUd+z8cub1z+TFKUmWrQW9Skat9+5rcfLgxjF+AOWIugU3FZTwAAAAAElFTkSuQmCC

  Canceled
  // base64 of Google design ic_do_not_disturb_black_18dp_2x.png  data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAD8x0bcAAAAwklEQVR4AZXRO4pqQRSG0ZWpsXV0Dlc7UHEmikNRx+AjMRMRBUfmawrnUgbVScOBohK/nS7Ywe/7KgtrawtBsb6Lj/R30VlP1o+32tZIS8vYTu1lSFPfW3LVxMDdUwXARe0q2WTsvxNA5WOLTc7sRQFYSEYU2EQyB9aSFgXWkaxylLO2ZNm8G1NgU8kMCKIdBXYQdQHOaoOcuYmOAPS83DN2kzwETYaeansTHW1TB9HDP1mVk6gZ+CgoFsytLM10fdsvA/9Qy13LEEYAAAAASUVORK5CYII=

*/

//file.abort();

/**
 * Return the bytes in a 32-bit integers format from the array.
 * Always assume each value is an unsigned 8-bit integer
 * @example
 * // returns [0x1A45]
 * mk.sumBytes([0x1A, 0x45]);
 * @param {(TypedArray|Array)} array - The array containing the data to sum
 * @param {Number} start - The offset at which to start the sum
 * @param {Number} stop - The offset at which to stop the sum
 * @return {Array} An array of 32-bit integers
 */
mk.sumBytes = (array = [], start = 0, stop = - 1) => {

  // Normalize the behavior
  if (start < 0) {
    start = array.length + start;
  }
  if (stop < 0) {
    stop = array.length + stop;
  }

  // To slice, we add one to the end index
  stop++;

  // Recurse until the function encounter 4 or less bytes
  // array.slice has a huge performance impact.
  // Looping may be a good solution? Dunno
  if (stop - start  > 4) {
    return [mk.sumUint32(array.slice(start, start + 4)),
            mk.sumBytes(array.slice(start + 4, stop))
           ].reduce((a, b) => { // We flatten the array on the fly
              return a.concat(b);
            }, []);
  }

  // End call to the subfunction
  return [mk.sumUint32(array.slice(start, stop))];

};

/**
 * Subfunction to be called by sumBytes.
 * Accepts an array of 0 to 4 bytes.
 * @param {TypedArray | Array} array - The array containing the integer to sum
 * @return {Number} The unsigned integer (value < 2^32)
 */
mk.sumUint32 = (array = []) => {
  if (array.length > 4) {
    mk.Error('Incorrect sumUint32 call. Array length was ' +array.length);
  }
  return array.reduce((previousValue, currentValue) => {
    // Move the previous value from 1 byte (2^8) and add the current.
    return (previousValue * 256) + currentValue;
  }, 0);
};

/**
 * Return a float from a 4- or 8-byte array (always big endian).
 * DO NOT pass a DataView (if you already have one, you know what to do,
 * there is no need for this function)
 * @example
 * // returns 2562200
 * mk.getFloat({Uint8Array} [0x4a, 0x1c, 0x62, 0x60]);
 * @param {(TypedArray|ArrayBuffer)} array - The 32 or 64-bit float
 * @return {Number} The float value
 */
mk.getFloat = (array = new ArrayBuffer()) => {
  // iff we have a TypedArray, overwrite it with its ArrayBuffer
  if (ArrayBuffer.isView(array) && array.BYTES_PER_ELEMENT !== undefined) {
    array = array.buffer;
  }
  return (array.byteLength < 4) ?
    0 :
    (array.byteLength === 4) ?
      new DataView(array).getFloat32(0, false) :
      new DataView(array).getFloat64(0, false);
};

/**
 * Return the element
 * @param {(TypedArray|Array)} buffer - The data
 * @param {Object} elm - The element being searched
 * @param {Number} offset - The byte at which to start the read
 * @param {Number} maxOffset - The byte at which to end the read
 * @param {Boolean} mandatory - If true, rise an error if elm was not found.
 * @return {?(Object)} The given element
 */
mk.seekElement = (buffer, elm, offset = 0, maxOffset = buffer.length,
                  mandatory = false) => {

  let reading,
      view,
      elmIDlength,
      resultOffset = offset,
      resultId,
      resultLength,
      resultValue,
      method; // Uint8 = base256

  // Always deal with Uint8Array
  if (!(buffer instanceof Uint8Array)) {
    try {
      buffer = Uint8Array.from(buffer);
    }
    catch (e) {
      mk.Error(e);
    }
  }
  // The id is more than 4 bytes
  if (elm.id[0]) {
    mk.Error(
      new Error('ID ' +elm.name+ ' > 4 bytes'),
      'I do not deal with this shit yet'
    );
  }

  view = new DataView(buffer.buffer);

  elmIDlength = numberLength(elm.id[1], 256);

  switch (elmIDlength) {
    case 4:
      view.method = DataView.prototype.getUint32;
    break;
    case 3:
      view.method = DataView.prototype.getUint24;
    break;
    case 2:
      view.method = DataView.prototype.getUint16;
    break;
    case 1:
      view.method = DataView.prototype.getUint8;
    break;
    default:
      mk.Error(
        new Error(elm.name+ ' ID.length outside range of 1-4 bytes'),
        'ID of', elm.name, 'not consistent with specs.'
      );
  }

  // If we give a range of 0, then we do not know when it ends.
  // Default behavior is then to seek all the buffer
  maxOffset = maxOffset || buffer.byteLength;

  /**
   * @todo Consider ID length > 4 bytes
   */
  // Search the existence of the element
  try {
    while (reading !== elm.id[1] && offset < maxOffset) {
      reading = view.method(offset);
      ++offset;
    }
  }
  catch (e) {
    if (mandatory) {
      // If it does not appear, then it is a shitty file.
      mk.Error(
        new Error('Mandatory element ' +elm.name+' not found'),
        'Malformed matroska file.');
    }
    else {
      return [false, resultOffset];
    }
  }

  // The offset at which the element start
  resultOffset = --offset;

  // Equivalent to elm.id[1]
  resultId = reading;

  // The offset is shifted to read the next part
  // => length
  offset += elmIDlength;

  // resultLength[0] is the integer (split into [0][0]and [0][1] 32 bit)
  // resultLength[1] is the number of bytes taken to write this integer
  resultLength = mk.readVint(buffer, offset);

  /**
   * If the length is greater than the maximum safe integer,
   * split the buffer length into its 32-bit parts
   * @todo treat high and low ([0] and [1]) separately
   */
  /*
  if (resultLength[0][0] > 0x001FFFFF) {

  }
  */
  // Note: This method is imprecise if byteLength > Number.MAX_SAFE_INTEGER
  /*
  if (offset +
      resultLength[1] +
      (resultLength[0][0] * 4294967296) + // = (<< 32) 53-bit proof
      resultLength[0][1] > buffer.byteLength) {
    mk.Error(
      new Error('Buffer or file too short'),
      'All required datas cannot be accessed.'
     );
  }
  */
  // The offset is shifted to read the next part
  // => The value
  offset += resultLength[1];

  resultValue = buffer.slice(offset,
                             offset + (resultLength[0][0] * 4294967296) +
                             resultLength[0][1]
                            );

  // The offset is shifted to be at the end of the element
  offset += (resultLength[0][0] * 4294967296) + resultLength[0][1];

  return [{
      id: resultId,
      offset: resultOffset,
      length: resultLength[0],
      value: resultValue
    }, offset];

};

/**
 * This is reeeeaaaaaalllllllly not optimized. I should optimize it a lot
 * For example: do not call seekElement, as I have already checked everything
 */
mk.seekPosition = (buffer, elm, offset = 0, maxOffset = buffer.length) => {
  let reading,
      view,
      elmIDlength,
      position;

  // Always deal with Uint8Array
  if (!(buffer instanceof Uint8Array)) {
    try {
      buffer = Uint8Array.from(buffer);
    }
    catch (e) {
      mk.Error(e);
    }
  }
  // The id is more than 4 bytes
  if (elm.id[0]) {
    mk.Error(
      new Error('ID ' +elm.name+ ' > 4 bytes'),
      'I do not deal with this shit yet'
    );
  }

  view = new DataView(buffer.buffer);

  elmIDlength = numberLength(elm.id[1], 256);

  switch (elmIDlength) {
    case 4:
      view.method = DataView.prototype.getUint32;
    break;
    case 3:
      view.method = DataView.prototype.getUint24;
    break;
    case 2:
      view.method = DataView.prototype.getUint16;
    break;
    case 1:
      view.method = DataView.prototype.getUint8;
    break;
    default:
      mk.Error(
        new Error(elm.name+ ' ID.length outside range of 1-4 bytes'),
        'ID of', elm.name, 'not consistent with specs.'
      );
  }

  /**
   * @todo Consider ID length > 4 bytes
   */
  // Search the existence of the element
  try {
    while (reading !== elm.id[1] && offset < maxOffset) {
      reading = view.method(offset);
      ++offset;
    }
  }
  catch (e) {
    return false;
  }

  // Return an integer, no need for an array
  return mk.seekElement(
    buffer.slice(--offset),
    SEGMENT.SeekHead.Seek.Position
  )[0].value.reduce((a, b) => {
    return (a*256) + b;
  });

};

/**
 * Return the different tracks in the format of seekElement
 * @param {(TypedArray|Array)} buffer
 * @param {Array} The different tracks
 */
mk.splitTracks = (buffer) => {

  let reading,
      offset = 0,
      tracks = [];

  // Handle tracks containing SEGMENT.Tracks.Entry.id
  while (offset < buffer.byteLength) {
    [reading, offset] = mk.seekElement(buffer,
      SEGMENT.Tracks.Entry,
      offset,
      null,
      false);
    tracks.push(reading);
  }
  return tracks;
}

/**
 * Return the size of the chunk
 * @param {(TypedArray|Array)} buffer - Shall begin with the ID of the element
 * @param {Object} elm
 * @return {Array} The size of the chunk and the new offset
 */
mk.elementSize = (buffer, elm) => {

  let offset = numberLength(elm.id[0], 256) + numberLength(elm.id[1], 256);

  let chunkLength = mk.
    readVint(buffer.slice(offset, offset + 8));

  return [chunkLength[0], offset + chunkLength[1]];
}

/**
 * Return the variable length integer.
 * Does not take care of unknown length (all bits set to 1).
 * Get your shit together, muxer.
 * @param {(TypedArray|Array)} buffer - The data
 * @param {Number} offset - The byte at which to start the read
 * @return {Array} A 2 32-bit unsigned integers array representing the size
 *                 and the number of bytes it takes
 */
mk.readVint = (buffer, offset = 0) => {

  let s_size,
      bytesToLookAt = 9 - numberLength(buffer[offset], 2);
  // Only a maximum of 7 leading zeros is allowed.
  // If the byte at [offset] === 0x00, an error is raised
  if (bytesToLookAt === 9) {
    mk.Error(
      new Error('Integer > 56 bits forbidden'),
      'Incorrect matroska file.'
    );
  }

  // Matroska maximum 56-bit integers       = [0x00FFFFFF, 0xFFFFFFFF]
  // and Javascript Number.MAX_SAFE_INTEGER = [0x001FFFFF, 0xFFFFFFFF]
  // s_size is now an array of 1 to 2 32-bit integers (big endian)
  s_size = mk.sumBytes(buffer.slice(offset, offset + bytesToLookAt));

  /**
   * The MSB was used to finish the sequence of leading zeros.
   * Discard it (special case 0 is already taken care of).
   * Thanks [@jazzpi]{@link http://stackoverflow.com/a/20200933}
   */
  s_size[0] = ( 1 << (numberLength(s_size[0], 2) - 1) ) ^ s_size[0];

  // Always return 2 32-bit integers.
  // I could also use the spread operator.
  // I do not know which one performs better.
  return [(s_size.length === 1 ) ? [0, s_size[0]] : s_size,
          bytesToLookAt];

};

/** Convert an array of byte into a string (assume ASCII)
 * @param array {(TypedArray|Array)} The buffer containing the string
 * @return The decoded string
 // Use String.fromCodePoint if things become messy
 */
mk.bytesToString = (array = []) => {
  return String.fromCharCode(...array); // All hail the spread operator!
};


mk.HTMLText = (texts, style = {}) => {
  let div,
      pre,
      code;

  if (!(texts instanceof Array)) {
    texts = [texts];
  }

  for (let i in texts) {
    div = document.createElement('div');

    for (let o in style) {
      (o === 'className') ?
        div.className  = style[o]:
        div.style[o] = style[o];
    }

    // Deal with JSON in a pre
    if (typeof texts[i] === 'object') {
      pre = document.createElement('pre');
      pre.addEventListener('click',
        function () {
          selectText(this);
        },
        false);

      code = document.createElement('code');
      code.className = 'language-json';

      /*for (let j in texts[i]) {
        if (texts[i][j] instanceof Object && texts[i][j].toHuman) {
          texts[i][j] = texts[i][j].toHuman();
        }
      }*/

      code.appendChild(document.createTextNode(JSON.stringify(
            texts[i],
            function (k, v) {
              if (v && v.toHuman) {
                return v.toHuman();
              }
              return v;
            },
            '  '
          )
        )
      );
      pre.appendChild(code);
      div.appendChild(pre);
    }
    else {
      div.appendChild(document.createTextNode('\n' + texts[i] + '\n'));
    }
    document.body.appendChild(div);
  }

};

/**
 * @param {Error} e - The reason behind the error
 * @param {Array<String>} args - The consequence of the error
 */
mk.Error = (e, ...args) => {
  if (e instanceof Error && args.length) {
    mk.HTMLText(args.join(' ') +' - Reason: ' +e.message, {color: 'red'});
  }
  throw e;
};

document.addEventListener("DOMContentLoaded", () => {

  document.querySelector('input[type="file"]').addEventListener('change', function (e) {
    mk.inputFile(this.files);
  }, false);

  let dropzone = document.getElementById('dropzone');

  dropzone.ondragover = dropzone.ondragenter = function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.className = 'hover';
  };

  dropzone.ondragleave = dropzone.ondragexit = function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.className = '';
  };

  dropzone.ondrop = function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.className = '';

    mk.inputFile(e.dataTransfer.files);

  };

});

})(window, document);
