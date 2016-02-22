# Matroska EBML Parser #

This is not a substitute for the amazing [MediaInfo](https://mediaarea.net/) program.  
It just parses the headers of a matroska file and return a JSON with the info **I** deem important.

## How to use ##
Feed a matroska (`mkv`, `mk3d`, `mka`, or `mks`) file.  

```javascript
/**
 * The only function you should care about
 * @param {File/Blob} mkFile - The matroska file 
 */
mkInputFile(mkFile)
```

## Output ##

A javascript object is returned.  

`name`: {string} The name of the file  
`size`: {integer} The size of the file (in bytes)  
`duration`: {string} The duration of the file (in hh:mm:ss.ms format)  

The differents tracks are in the `tracks` object. **Always &ge; 1 track(s)**.  

### Tracks ###
`id`: {integer} The identification number of the track = 1 (!)  
`kind`: {string} The kind of stream (`video`, `audio`, `subtitle`) = 1 (!)  
`name`: {string} The name of the track (default = '')  
`language`: {string} The language of the track using ISO639-2 (default = '')  

##### Videos tracks #####
= 1 (!) for mkv, mk3d  
= 0 (!) otherwise  
`width`: {integer} The width of the video (in pixels)  
`height`: {integer} The height of the video (in pixels)  

##### Audio tracks #####
&ge; 1 (!) for mka  
= 0 for mks  
&ge; 0 otherwise  

##### Subtitle tracks #####
&ge; 1 (!) for mks  
&ge; 0 otherwise  


## Example ##

If you didn't understand the crap above, here is a concrete, human-friendly, example.

> Psycho Pass 2 - 01 vostfr

```javascript
// on a dragdrop event for example
let result = mkInputFile(e.dataTransfer.files[0]);

// after processing, this should be your output
result = {
  name: 'Psycho Pass 2 - 01 vostfr BD [x264_AC3][HI10p][1920x1080].mkv',
  size: 857381271, // equals to 818 MiB
  duration: '00:22:21.760',
  tracks: {
    {
      id: 1,
      kind: 'video',
      name: '',
      language: 'jpn',
      width: 1920,
      height: 1080
    },
    {
      id: 2,
      kind: 'audio',
      name: '',
      language: 'jpn'
    },
    {
      id: 3,
      kind: 'subtitle',
      name: 'Piste sans honorifiques',
      language: 'fra'
    },
    {
      id: 4,
      kind: 'subtitle',
      name: 'Piste avec honorifiques',
      language: 'fra'
    }
  }
}
```

## Browser support ##
Anything that supports ECMAScript6.  
Firefox, Chrome, IE 11+...  
I do not intend to support older browsers. Sorry. Too bad.

## License ##

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Matroska EBML Parser</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/Phoenix35/mk-parser" property="cc:attributionName" rel="cc:attributionURL">https://github.com/Phoenix35/mk-parser</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.

[![forthebadge](http://forthebadge.com/images/badges/uses-js.svg)](http://forthebadge.com)
