let capture, soundLine, whichSynth, depth, distort, test;
let counter = 0;
let synths = []
let blues = []
let greens = []
let Bends = [0]
let Gends = [0]
let Rends = [0]

let Bsyn = [0]
let Gsyn = [0]
let Rsyn = [0]

let red = 0
let blue = 0
let green = 0
let freq = 34
let BlueFreq = 136
let greenFreq = 68
let holder = 1
let buffer = 0
let shiftTime = 100000

const chorus = new Tone.Chorus(0, 0.2, 0.2).toDestination();
const disto = new Tone.Distortion(0.2).toDestination();
const pannerL = new Tone.Panner(0.25).connect(disto);
const pannerR = new Tone.Panner(0.75).toDestination(chorus);

Tone.Transport.start();

function setup() {
  let canvas = createCanvas(720, 960)
  capture = createCapture(VIDEO);
  capture.hide()


  for (let i = 0; i < 20; i++) {
    const synth = new Tone.Oscillator(0, 'square').toDestination().start();
    // synth.partials = []
    synths.push(synth)
    line(601, 480, 651, 480)
    line(601, 480 / 20 * i, 651, 480 / 20 * i)
  }

  for (let t = 0; t < 10; t++) {
    const synth1 = new Tone.Oscillator(0, 'sawtooth').connect(pannerL).start();
    synth1.partials = [0.0001]
    blues.push(synth1)
  }

  for (let t = 0; t < 5; t++) {
    const synth2 = new Tone.Oscillator(0, 'triangle').connect(pannerR).start();
    synth2.partials = [0.05, 0.09, 0.08, 0.07, 0.06, 0.04, 0.03, 0.02]
    greens.push(synth2)
  }
}


function draw() {
  fill(red, blue, green)
  rect(0, 0, 651, 480)
  // image(test, 0, 480, 651, 480)
  image(capture, 0, 0)
  stroke(0)
  strokeWeight(1)
  line(600, 0, 600, height / 2)
  let now = Tone.immediate()
  let present = Tone.now()

  BlueFreq = freq * 4
  greenFreq = freq * 2


  if (counter > shiftTime * 1.5) {
    counter = 0
    freq = random(27, 111)
    shiftTime = random(0, 100000)

  }


  for (let i = 0; i < height / 2; i++) {
    soundLine = get(599, i)
    let blue = soundLine[2]
    let green = soundLine[1]
    let red = soundLine[0]
    let bright = soundLine[0] + soundLine[1] + soundLine[2]
    whichSynth = floor(map(i, 0, height / 2, 0, synths.length))
    whichBlue = floor(map(i, 0, height / 2, 0, blues.length))
    whichGreen = floor(map(i, 0, height / 2, 0, greens.length))

    let volume = map(bright, 200, 765, -40, -24)

    if (red > 100 && green < 100 && blue < 100) {
      if ((i < Rends[Rends.length - 1] + buffer || i < Rends[Rends.length - 1] - buffer) && (present - holder) > 0.01) {

      }
      counter += 1
      holder = now
      if (i != Rends[Rends.length - 1]) {
        Rends.push(i)
      }
      Rsyn.push(whichSynth)
      let messyRed = map(i, height / 2, 0, 1, 20) * freq
      let cleanRed = floor(map(i, height / 2, 0, 1, 20)) * freq
      noStroke()
      fill(red, 0, 0)
      rect(50, i, 549, 5)
      synths[whichSynth].volume.value = volume
      if (counter > shiftTime) {
        synths[whichSynth].frequency.value = cleanRed
      } else {
        synths[whichSynth].frequency.value = messyRed
      }
      if (Rends.length > 19) {
        Rends.shift()
      }
    }
    else if (blue > 100 && red < 100 && green < 100 && (i > Bends[Bends.length - 1] + (buffer * 2) || i < Bends[Bends.length - 1] - (buffer * 2)) && (present - holder) > 0.01) {
      counter += 1
      if (i != Bends[Bends.length - 1]) {
        Bends.push(i)
      }
      let messyBlue = map(i, height / 2, 0, 1, 11) * BlueFreq
      let cleanBlue = floor(map(i, height / 2, 0, 1, 11)) * BlueFreq

      blues[whichBlue].volume.value = volume / 1.4
      if (counter > shiftTime) {
        blues[whichBlue].frequency.value = cleanBlue
      } else {
        blues[whichBlue].frequency.value = messyBlue
      }
      noStroke()
      fill(0, 0, blue)
      rect(50, i, 549, 20)
      if (Bends.length > 19) {
        Bends.shift()
      }
    }
    else if (bright < 320 && (i > Gends[Gends.length - 1] + (buffer * 3) || i < Gends[Gends.length - 1] - (buffer * 3)) && (present - holder) > 0.01) {
      counter += 1
      if (i != Gends[Gends.length - 1]) {
        Gends.push(i)
      }
      let messyGreen = map(i, height / 2, 0, 1, 11) * greenFreq
      let cleanGreen = floor(map(i, height / 2, 0, 1, 11)) * greenFreq
      greens[whichGreen].volume.value = volume / 1.2
      if (counter > shiftTime) {
        greens[whichGreen].frequency.value = cleanGreen
      } else {
        greens[whichGreen].frequency.value = messyGreen
      }
      noStroke()
      fill(0, green, 0)
      rect(50, i, 549, 5)
    } else {
      blues[whichBlue].volume.rampTo(-100, 4)
      greens[whichGreen].volume.rampTo(-100, 6)
      synths[whichSynth].volume.rampTo(-100, 8)
    }
    if (Gends.length > 19) {
      Gends.shift()
    }

    for (let i = 0; i < 20; i++) {
      fill(0)
      line(601, 480 / 20 * i, 651, 480 / 20 * i)
    }
  }




}


function average(ends) {
  var i = 0, summ = 0, ArrayLen = ends.length;
  while (i < ArrayLen) {
    summ = summ + ends[i++];
  }
  return summ / ArrayLen;
}




