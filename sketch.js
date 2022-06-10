//Inspiration - Drum sequence base - https://editor.p5js.org/carpece/sketches/_tbrpjK3k
//Array range - https://www.codegrepper.com/code-examples/javascript/how+to+fill+array+with+consecutive+numbers+javascript
//Icons created by Gregor Cresnar from NounProject.com

let hihatRow = []; //array for row 1
let clapRow = []; //array for row 2
let kickRow = []; //array for row 3
let snareRow = [];
let recRow = [];
let record = [];
let effect = [];
let beatCount = 24; //number of beats
let hihat, clap, snare, kick, rec;
let hihatArray = [];
let clapArray = [];
let snareArray = [];
let kickArray = [];
let recArray = [];
let hihatPhrase, clapPhrase, snarePhrase, kickPhrase, recPhrase, masterPhrase;
let drums;
let bpmCTRL;
let beatArray;
let masterArray;
let cursorPos;
let currentBeat;
let activeBeat;
let hihatIcon,
  clapIcon,
  snareIcon,
  kickIcon,
  recIcon,
  playIcon,
  stopIcon,
  pauseIcon,
  volumeIcon,
  reverbIcon,
  delayIcon;
let font;
let uiColour = "#FFAE43";
let uiColour2 = "#3A2A17";
let uiColour3 = "#1E150B";
var gui;
var responsive = false;
let kickVolume, snareVolume, clapVolume, hihatVolume, recVolume;
let kickColour = "#EFEF4D";
let snareColour = "#E25C59";
let clapColour = "#96BC39";
let hihatColour = "#5E80EA";
let recColour = "#9550EF";
let kickColour2 = "#424118";
let snareColour2 = "#471E1E";
let clapColour2 = "#2B3311";
let hihatColour2 = "#1B253F";
let recColour2 = "#24163A";
let kickColour3 = "#28270F";
let snareColour3 = "#281212";
let clapColour3 = "#191C0A";
let hihatColour3 = "#0C111C";
let recColour3 = "#110C1E";
let mic, recorder, soundFile;
let state = 0;
let kickSliderIconPosX;
let activeEffect = "";
let kickVerb, snareVerb, clapVerb, hihatVerb, recVerb;
let kickDel, snareDel, clapDel, hihatDel, recDel;
let kickReverb = 0;
let snareReverb = 0;
let clapReverb = 0;
let hihatReverb = 0;
let recReverb = 0;
let kickDelay = 0;
let snareDelay = 0;
let clapDelay = 0;
let hihatDelay = 0;
let recDelay = 0;
let recTimer = 3;
let recState = false;
let welcomeState = true;

//------MAIN PROGRAM------//
function preload() {
  gui = createGui();

  hihatIcon = loadImage("images/hihat.png");
  clapIcon = loadImage("images/clap.png");
  snareIcon = loadImage("images/snare.png");
  kickIcon = loadImage("images/kick.png");
  recIcon = loadImage("images/rec.png");
  playIcon = loadImage("images/play.png");
  stopIcon = loadImage("images/stop.png");
  pauseIcon = loadImage("images/pause.png");
  resetIcon = loadImage("images/reset.png");
  volumeIcon = loadImage("images/volume.png");
  reverbIcon = loadImage("images/reverb.png");
  delayIcon = loadImage("images/delay.png");

  hihat = loadSound("assets/hh_sample.mp3", () => {});
  clap = loadSound("assets/clap_sample.mp3", () => {});
  snare = loadSound("assets/snare_sample3.mp3", () => {});
  kick = loadSound("assets/bass_sample.mp3", () => {});
  rec = loadSound("assets/triangle_sample.mp3", () => {});

  font = loadFont("fonts/Uni Sans Heavy.otf");
}

function setup() {
  //create canvases
  createCanvas(windowWidth, windowHeight);
  playheadCanvas = createGraphics(windowWidth, windowHeight / 2);
  BPMCanvas = createGraphics(windowWidth, windowHeight);
  recCanvas = createGraphics(50, 50);
  welcomeCanvas = createGraphics(windowWidth, windowHeight);

  background(20);

  imageMode(CENTER);
  playheadCanvas.imageMode(CENTER);

  //create classes
  createClasses();

  //dynamic beat count based on window size
  dynamicBeatCount();

  //start record
  startRecord();

  //default setting
  defaultBeat();

  //beat select state
  beatSelectState();

  //build the drum phrases
  buildDrums();

  //build BMP slider
  buildBPMSlider();

  buildSliders();

  buildReverb();

  buildDelay();
}

function draw() {
  //build canvases
  image(BPMCanvas, windowWidth / 2, windowHeight / 2);
  image(playheadCanvas, windowWidth / 2, windowHeight / 2 - 75);
  image(
    recCanvas,
    windowWidth / 2 + (beatCount / 2) * 45 + 45,
    windowHeight / 2 + 30
  );

  userStartAudio();

  drawGui();

  drums.setBPM(bpmCTRL.val);

  //Sliders - requires if statement based of select state of control.
  //volumeSliders();

  //Build individual rows
  drawHihat();
  drawClap();
  drawSnare();
  drawKick();
  drawRec();

  drawControlButtons();

  drawRowIcons();

  drawSliderText();

  displaySliderIcons();

  drawEffectButtons();

  effectSliders();

  drawRecordCount();

  drawWelcomeScreen();
}

//------EVENT FUNCTIONS------//
function mouseClicked() {
  for (i = 0; i < beatCount; i++) {
    if (hihatRow[i].hoverState == true && hihatRow[i].selectState == true) {
      hihatRow[i].selectState = false;
    } else if (
      hihatRow[i].hoverState == true &&
      hihatRow[i].selectState == false
    ) {
      hihatRow[i].selectState = true;
      if (!drums.isPlaying) {
        hihat.play();
      }
    }
  }

  for (i = 0; i < beatCount; i++) {
    if (clapRow[i].hoverState == true && clapRow[i].selectState == true) {
      clapRow[i].selectState = false;
    } else if (
      clapRow[i].hoverState == true &&
      clapRow[i].selectState == false
    ) {
      clapRow[i].selectState = true;
      if (!drums.isPlaying) {
        clap.play();
      }
    }
  }

  for (i = 0; i < beatCount; i++) {
    if (snareRow[i].hoverState == true && snareRow[i].selectState == true) {
      snareRow[i].selectState = false;
    } else if (
      snareRow[i].hoverState == true &&
      snareRow[i].selectState == false
    ) {
      snareRow[i].selectState = true;
      if (!drums.isPlaying) {
        snare.play();
      }
    }
  }

  for (i = 0; i < beatCount; i++) {
    if (kickRow[i].hoverState == true && kickRow[i].selectState == true) {
      kickRow[i].selectState = false;
    } else if (
      kickRow[i].hoverState == true &&
      kickRow[i].selectState == false
    ) {
      kickRow[i].selectState = true;
      if (!drums.isPlaying) {
        kick.play();
      }
    }
  }

  for (i = 0; i < beatCount; i++) {
    if (recRow[i].hoverState == true && recRow[i].selectState == true) {
      recRow[i].selectState = false;
    } else if (recRow[i].hoverState == true && recRow[i].selectState == false) {
      recRow[i].selectState = true;
      if (!drums.isPlaying) {
        rec.play();
      }
    }
  }

  if (record[0].hoverState == true && record[0].selectState == true) {
    recState = false;
    record[0].selectState = false;
    record[0].colour = 100;
    recorder.stop();
    recTimer = 3;
    recCanvas.background(20);
  } else if (
    record[0].hoverState == true &&
    record[0].selectState == false &&
    !drums.isPlaying
  ) {
    recState = true;
  }

  if (playButton.hoverState == true && playButton.selectState == true) {
    playButton.selectState = false;
    stopButton.selectState = true;
    //drums.pause();
  } else if (playButton.hoverState == true && playButton.selectState == false) {
    playButton.selectState = true;
    stopButton.selectState = false;
    //if (!drums.isPlaying) {
    //  drums.loop();
    //}
  }

  if (stopButton.hoverState == true && stopButton.selectState == true) {
    stopButton.selectState = false;
    playButton.selectState = true;
    //playButton.selectState = true;
  } else if (stopButton.hoverState == true && stopButton.selectState == false) {
    stopButton.selectState = true;
    //drums.pause();
    playButton.selectState = false;
  }

  if (resetButton.hoverState == true) {
    resetButton.selectState = true;
    window.location.reload();
  }

  if (effect[0].hoverState == true && effect[0].selectState == false) {
    effect[0].selectState = true;
    effect[1].selectState = false;
    effect[2].selectState = false;

    kickSlider.val = kickVolume / 100;
    snareSlider.val = snareVolume / 100;
    clapSlider.val = clapVolume / 100;
    hihatSlider.val = hihatVolume / 100;
    recSlider.val = recVolume / 100;
  }
  if (effect[1].hoverState == true && effect[1].selectState == false) {
    effect[0].selectState = false;
    effect[1].selectState = true;
    effect[2].selectState = false;

    kickSlider.val = kickReverb / 100;
    snareSlider.val = snareReverb / 100;
    clapSlider.val = clapReverb / 100;
    hihatSlider.val = hihatReverb / 100;
    recSlider.val = recReverb / 100;
  }
  if (effect[2].hoverState == true && effect[2].selectState == false) {
    effect[0].selectState = false;
    effect[1].selectState = false;
    effect[2].selectState = true;

    kickSlider.val = kickDelay / 100;
    snareSlider.val = snareDelay / 100;
    clapSlider.val = clapDelay / 100;
    hihatSlider.val = hihatDelay / 100;
    recSlider.val = recDelay / 100;
  }

  if (
    mouseX > kickSliderIconPosX - 25 &&
    mouseX < kickSliderIconPosX + 264 + 25
  ) {
    if (mouseY > windowHeight / 2 + 300 && mouseY < windowHeight / 2 + 350) {
      if (activeEffect == "volume") {
        kickSlider.val = 0.8;
        snareSlider.val = 0.8;
        clapSlider.val = 0.8;
        hihatSlider.val = 0.8;
        recSlider.val = 0.8;
      }
      if (activeEffect == "reverb") {
        kickSlider.val = 0.0;
        snareSlider.val = 0.0;
        clapSlider.val = 0.0;
        hihatSlider.val = 0.0;
        recSlider.val = 0.0;
      }
      if (activeEffect == "delay") {
        kickSlider.val = 0.0;
        snareSlider.val = 0.0;
        clapSlider.val = 0.0;
        hihatSlider.val = 0.0;
        recSlider.val = 0.0;
      }
    }
  }
}

function keyPressed() {
  if (welcomeState == true) {
    welcomeState = false;
  }

  if (key === " ") {
    if (playButton.selectState == true) {
      playButton.selectState = false;
      stopButton.selectState = true;
      //drums.pause();
    } else if (playButton.selectState == false) {
      playButton.selectState = true;
      stopButton.selectState = false;
      // if (!drums.isPlaying) {
      //   drums.loop();
      // }
    }
  }

  if (key === "h") {
    hihat.play();
  }
  if (key === "c") {
    clap.play();
  }
  if (key === "s") {
    snare.play();
  }
  if (key == "k") {
    kick.play();
  }
}

//------CLASSES------//
class noteClass {
  constructor() {
    this.posX = width / 2;
    this.posY = 50;
    this.size = 40;
    this.colour = "blue";
    this.selectColour = "#FFFFFF";
    this.baseColour = "#CCCCCC";
    this.beatColour = "#FFFFFF";
    this.pitch = 1;
    this.hoverState = false;
    this.selectState = false;
    this.beatState = false;
  }

  display() {
    rectMode(CENTER);
    noStroke();
    if (this.selectState == true) {
      this.colour = this.selectColour;
    } else {
      this.colour = this.baseColour;
    }
    fill(this.colour);
    square(this.posX, this.posY, this.size, 10);

    if (this.beatState == true) {
      strokeWeight(5);
      stroke(this.beatColour);
    } else {
      noStroke();
    }
  }

  hover() {
    if (
      mouseX < this.posX + this.size / 2 &&
      mouseX > this.posX - this.size / 2
    ) {
      if (
        mouseY < this.posY + this.size / 2 &&
        mouseY > this.posY - this.size / 2
      ) {
        this.hoverState = true;
      } else {
        this.hoverState = false;
      }
    } else {
      this.hoverState = false;
    }
  }
}

class buttonClass {
  constructor() {
    this.posX = windowWidth / 2;
    this.posY = windowHeight / 2 - 305;
    this.size = 60;
    this.colour = "blue";
    this.hoverState = false;
    this.selectState = false;
  }

  display(button) {
    rectMode(CENTER);
    noStroke();
    if (this.selectState == true) {
      this.colour = uiColour;
    } else {
      this.colour = uiColour2;
    }
    fill(this.colour);
    square(this.posX, this.posY, this.size, 10);
    if (button == "play") {
      image(playIcon, this.posX + 2, this.posY, 50, 50);
    } else if (button == "stop") {
      image(stopIcon, this.posX, this.posY, 50, 50);
    } else if (button == "pause") {
      image(pauseIcon, this.posX, this.posY, 50, 50);
    } else if (button == "reset") {
      image(resetIcon, this.posX, this.posY, 50, 50);
    } else if (button == "volume") {
      image(volumeIcon, this.posX, this.posY, 50, 50);
    } else if (button == "reverb") {
      image(reverbIcon, this.posX, this.posY, 50, 50);
    } else if (button == "delay") {
      image(delayIcon, this.posX, this.posY, 50, 50);
    }
  }

  hover() {
    if (
      mouseX < this.posX + this.size / 2 &&
      mouseX > this.posX - this.size / 2
    ) {
      if (
        mouseY < this.posY + this.size / 2 &&
        mouseY > this.posY - this.size / 2
      ) {
        this.hoverState = true;
      } else {
        this.hoverState = false;
      }
    } else {
      this.hoverState = false;
    }
  }
}

class recordClass {
  constructor() {
    this.posX = windowWidth / 2 + (beatCount / 2) * 45 + 35;
    this.posY = windowHeight / 2;
    this.size = 30;
    this.colour = 100;
    this.pitch = 1;
    this.hoverState = false;
    this.selectState = false;
  }

  display() {
    rectMode(CENTER);
    noStroke();

    if (this.hoverState == true && recState == false) {
      this.colour = 80;
    } else {
      this.colour = 100;
    }
    if (recState == true) {
      this.colour = uiColour;
      if (this.selectState == true) {
        this.colour = "red";
      }
    }
    fill(this.colour);
    circle(this.posX, this.posY, this.size);
  }

  hover() {
    if (
      mouseX < this.posX + this.size / 2 &&
      mouseX > this.posX - this.size / 2
    ) {
      if (
        mouseY < this.posY + this.size / 2 &&
        mouseY > this.posY - this.size / 2
      ) {
        this.hoverState = true;
      } else {
        this.hoverState = false;
      }
    } else {
      this.hoverState = false;
    }
  }
}

//------CONSTANTS------//
const sequence = (time, beatIndex) => {
  setTimeout(() => {
    currentBeat = beatIndex;
    playheadCanvas.background(20);
    drawPlayhead(beatIndex);
  }, time * 1000);
};

const drawPlayhead = (beatIndex) => {
  playheadCanvas.stroke("#444444");
  playheadCanvas.fill("#444444");
  playheadCanvas.rectMode(CENTER);
  playheadCanvas.push();
  playheadCanvas.translate(
    windowWidth / 2 - (beatCount / 2) * 45 + 5,
    windowHeight / 4
  );
  if (currentBeat > 4) {
    playheadCanvas.translate(10, 0);
  }
  if (currentBeat > 8) {
    playheadCanvas.translate(10, 0);
  }
  if (currentBeat > 12) {
    playheadCanvas.translate(10, 0);
  }
  if (currentBeat > 16) {
    playheadCanvas.translate(10, 0);
  }
  if (currentBeat > 20) {
    playheadCanvas.translate(10, 0);
  }
  if (currentBeat > 24) {
    playheadCanvas.translate(10, 0);
  }
  if (currentBeat > 28) {
    playheadCanvas.translate(10, 0);
  }
  if (currentBeat > 32) {
    playheadCanvas.translate(10, 0);
  }
  playheadCanvas.rect((beatIndex - 1) * 45, 0, 45, 350, 10);
  playheadCanvas.pop();
};

//------SETUP FUNCTIONS------//
function createClasses() {
  for (i = 0; i < beatCount; i++) {
    hihatRow[i] = new noteClass();
    clapRow[i] = new noteClass();
    kickRow[i] = new noteClass();
    snareRow[i] = new noteClass();
    recRow[i] = new noteClass();
  }
  playButton = new buttonClass();
  stopButton = new buttonClass();
  resetButton = new buttonClass();

  for (i = 0; i < 3; i++) {
    effect[i] = new buttonClass();
  }

  for (i = 0; i < 4; i++) {
    record[i] = new recordClass();
  }
}

function dynamicBeatCount() {
  if (windowWidth / 55 > 32) {
    beatCount = 32;
  } else if (windowWidth / 55 > 24) {
    beatCount = 24;
  } else if (windowWidth / 55 > 16) {
    beatCount = 16;
  } else if (windowWidth / 55 > 8) {
    beatCount = 8;
  } else {
    beatCount = 4;
  }
}

function startRecord() {
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
}

function defaultBeat() {
  for (i = 0; i < beatCount; i++) {
    if (i % 2 == 0) {
      append(hihatArray, 1);
    } else {
      append(hihatArray, 0);
    }
  }

  for (i = 0; i < beatCount; i++) {
    if (i % 4 == 0 && i % 8 != 0) {
      append(clapArray, 0);
    } else {
      append(clapArray, 0);
    }
  }

  for (i = 0; i < beatCount; i++) {
    if (i % 4 == 0 && i % 8 != 0) {
      append(snareArray, 1);
    } else {
      append(snareArray, 0);
    }
  }

  for (i = 0; i < beatCount; i++) {
    if (i % 8 == 0) {
      append(kickArray, 1);
    } else {
      append(kickArray, 0);
    }
  }

  for (i = 0; i < beatCount; i++) {
    if (i % 8 == 0) {
      append(recArray, 0);
    } else {
      append(recArray, 0);
    }
  }

  beatArray = range(1, beatCount);
}

function beatSelectState() {
  for (i = 0; i < beatCount; i++) {
    if (hihatArray[i] == 1) {
      hihatRow[i].selectState = true;
    }
    if (clapArray[i] == 1) {
      clapRow[i].selectState = true;
    }
    if (kickArray[i] == 1) {
      kickRow[i].selectState = true;
    }
    if (snareArray[i] == 1) {
      snareRow[i].selectState = true;
    }
    if (recArray[i] == 1) {
      recRow[i].selectState = true;
    }
  }
}

function buildDrums() {
  hihatPhrase = new p5.Phrase(
    "hihat",
    (time) => {
      hihat.play(time);
    },
    hihatArray
  );
  clapPhrase = new p5.Phrase(
    "clap",
    (time) => {
      clap.play(time);
    },
    clapArray
  );
  snarePhrase = new p5.Phrase(
    "snare",
    (time) => {
      snare.play(time);
    },
    snareArray
  );
  kickPhrase = new p5.Phrase(
    "kick",
    (time) => {
      kick.play(time);
    },
    kickArray
  );
  recPhrase = new p5.Phrase(
    "rec",
    (time) => {
      rec.play(time);
    },
    recArray
  );

  drums = new p5.Part();

  drums.addPhrase(hihatPhrase);
  drums.addPhrase(clapPhrase);
  drums.addPhrase(snarePhrase);
  drums.addPhrase(kickPhrase);
  drums.addPhrase(recPhrase);

  drums.addPhrase("masterPhrase", sequence, beatArray);
}

function buildBPMSlider() {
  let bpmSliderPosX =
    windowWidth / 2 + (beatCount / 2) * 45 + (beatCount / 4 / 2) * 10 - 45;

  bpmCTRL = createSliderV(
    "BPM",
    bpmSliderPosX,
    windowHeight / 2 + 125,
    32,
    160,
    20,
    120
  );
  bpmCTRL.isInteger = true;
  bpmCTRL.val = 80;
  bpmCTRL.setStyle({
    fillBg: color(uiColour2),
    fillBgHover: color(uiColour2),
    fillBgActive: color(uiColour2),

    strokeHandle: color(uiColour),
    strokeHandleHover: color(uiColour),
    strokeHandleActive: color(uiColour),

    fillHandle: color(uiColour2),
    fillHandleActive: color(uiColour),
    fillHandleHover: color(uiColour),

    fillTrack: color(uiColour3),
    fillTrackActive: color(uiColour3),
    fillTrackHover: color(uiColour3),

    strokeTrack: color(uiColour3),
    strokeTrackHover: color(uiColour3),
    strokeTrackActive: color(uiColour3),

    strokeBg: color(20),
    strokeBgHover: color(20),
    strokeBgActive: color(20),
  });
}

function buildSliders() {
  let kickSliderPosX = windowWidth / 2 - (beatCount / 2) * 45 + 5;

  kickSlider = createSliderV(
    "Kick Slider",
    kickSliderPosX + 50,
    windowHeight / 2 + 125,
    32,
    160,
    0,
    1
  );
  kickSlider.val = 0.8;
  kickSlider.setStyle({
    fillBg: color(kickColour2),
    fillBgHover: color(kickColour2),
    fillBgActive: color(kickColour2),

    strokeHandle: color(kickColour),
    strokeHandleHover: color(kickColour),
    strokeHandleActive: color(kickColour),

    fillHandle: color(kickColour2),
    fillHandleActive: color(kickColour),
    fillHandleHover: color(kickColour),

    fillTrack: color(kickColour3),
    fillTrackActive: color(kickColour3),
    fillTrackHover: color(kickColour3),

    strokeTrack: color(kickColour3),
    strokeTrackHover: color(kickColour3),
    strokeTrackActive: color(kickColour3),

    strokeBg: color(20),
    strokeBgHover: color(20),
    strokeBgActive: color(20),
  });

  snareSlider = createSliderV(
    "Snare Slider",
    kickSliderPosX + 116,
    windowHeight / 2 + 125,
    32,
    160,
    0,
    1
  );
  snareSlider.val = 0.8;
  snareSlider.setStyle({
    fillBg: color(snareColour2),
    fillBgHover: color(snareColour2),
    fillBgActive: color(snareColour2),

    strokeHandle: color(snareColour),
    strokeHandleHover: color(snareColour),
    strokeHandleActive: color(snareColour),

    fillHandle: color(snareColour2),
    fillHandleActive: color(snareColour),
    fillHandleHover: color(snareColour),

    fillTrack: color(snareColour3),
    fillTrackActive: color(snareColour3),
    fillTrackHover: color(snareColour3),

    strokeTrack: color(snareColour3),
    strokeTrackHover: color(snareColour3),
    strokeTrackActive: color(snareColour3),

    strokeBg: color(20),
    strokeBgHover: color(20),
    strokeBgActive: color(20),
  });

  clapSlider = createSliderV(
    "Clap Slider",
    kickSliderPosX + 182,
    windowHeight / 2 + 125,
    32,
    160,
    0,
    1
  );
  clapSlider.val = 0.8;
  clapSlider.setStyle({
    fillBg: color(clapColour2),
    fillBgHover: color(clapColour2),
    fillBgActive: color(clapColour2),

    strokeHandle: color(clapColour),
    strokeHandleHover: color(clapColour),
    strokeHandleActive: color(clapColour),

    fillHandle: color(clapColour2),
    fillHandleActive: color(clapColour),
    fillHandleHover: color(clapColour),

    fillTrack: color(clapColour3),
    fillTrackActive: color(clapColour3),
    fillTrackHover: color(clapColour3),

    strokeTrack: color(clapColour3),
    strokeTrackHover: color(clapColour3),
    strokeTrackActive: color(clapColour3),

    strokeBg: color(20),
    strokeBgHover: color(20),
    strokeBgActive: color(20),
  });

  hihatSlider = createSliderV(
    "Hihat Slider",
    kickSliderPosX + 248,
    windowHeight / 2 + 125,
    32,
    160,
    0,
    1
  );
  hihatSlider.val = 0.8;
  hihatSlider.setStyle({
    fillBg: color(hihatColour2),
    fillBgHover: color(hihatColour2),
    fillBgActive: color(hihatColour2),

    strokeHandle: color(hihatColour),
    strokeHandleHover: color(hihatColour),
    strokeHandleActive: color(hihatColour),

    fillHandle: color(hihatColour2),
    fillHandleActive: color(hihatColour),
    fillHandleHover: color(hihatColour),

    fillTrack: color(hihatColour3),
    fillTrackActive: color(hihatColour3),
    fillTrackHover: color(hihatColour3),

    strokeTrack: color(hihatColour3),
    strokeTrackHover: color(hihatColour3),
    strokeTrackActive: color(hihatColour3),

    strokeBg: color(20),
    strokeBgHover: color(20),
    strokeBgActive: color(20),
  });

  recSlider = createSliderV(
    "Rec Slider",
    kickSliderPosX - 16,
    windowHeight / 2 + 125,
    32,
    160,
    0,
    1
  );
  recSlider.val = 0.8;
  recSlider.setStyle({
    fillBg: color(recColour2),
    fillBgHover: color(recColour2),
    fillBgActive: color(recColour2),

    strokeHandle: color(recColour),
    strokeHandleHover: color(recColour),
    strokeHandleActive: color(recColour),

    fillHandle: color(recColour2),
    fillHandleActive: color(recColour),
    fillHandleHover: color(recColour),

    fillTrack: color(recColour3),
    fillTrackActive: color(recColour3),
    fillTrackHover: color(recColour3),

    strokeTrack: color(recColour3),
    strokeTrackHover: color(recColour3),
    strokeTrackActive: color(recColour3),

    strokeBg: color(20),
    strokeBgHover: color(20),
    strokeBgActive: color(20),
  });

  effect[0].selectState = true;
}

function buildReverb() {
  kickVerb = new p5.Reverb();
  snareVerb = new p5.Reverb();
  clapVerb = new p5.Reverb();
  hihatVerb = new p5.Reverb();
  recVerb = new p5.Reverb();
  kickVerb.process(kick, 1, 2);
  snareVerb.process(snare, 1, 2);
  clapVerb.process(clap, 1, 2);
  hihatVerb.process(hihat, 1, 2);
  recVerb.process(rec, 1, 2);
  kickVerb.drywet(0);
  snareVerb.drywet(0);
  clapVerb.drywet(0);
  hihatVerb.drywet(0);
  recVerb.drywet(0);
}

function buildDelay() {
  kickDel = new p5.Delay();
  snareDel = new p5.Delay();
  clapDel = new p5.Delay();
  hihatDel = new p5.Delay();
  recDel = new p5.Delay();
  let delayTime = 60 / bpmCTRL.val / 4;
  let feedback = 0.18;
  kickDel.process(kick, delayTime, feedback, 2300);
  snareDel.process(snare, delayTime, feedback, 2300);
  hihatDel.process(hihat, delayTime, feedback, 10000);
  clapDel.process(clap, delayTime, feedback, 10000);
  recDel.process(rec, delayTime, feedback, 10000);
  kickDel.amp(0);
  snareDel.amp(0);
  hihatDel.amp(0);
  clapDel.amp(0);
  recDel.amp(0);
}

//------DRAW FUNCTIONS------//
function effectSliders() {
  if (activeEffect == "volume") {
    //kickSlider.val = kick.getOutputVolume();
    kick.setVolume(kickSlider.val);
    kickVolume = floor(kickSlider.val * 100);

    snare.setVolume(snareSlider.val);
    snareVolume = floor(snareSlider.val * 100);

    clap.setVolume(clapSlider.val);
    clapVolume = floor(clapSlider.val * 100);

    hihat.setVolume(hihatSlider.val);
    hihatVolume = floor(hihatSlider.val * 100);

    rec.setVolume(recSlider.val);
    recVolume = floor(recSlider.val * 100);
  }

  if (activeEffect == "reverb") {
    //kickSlider.val = kick.getOutputVolume();
    kickVerb.drywet(kickSlider.val);
    kickReverb = floor(kickSlider.val * 100);

    snareVerb.drywet(snareSlider.val);
    snareReverb = floor(snareSlider.val * 100);

    clapVerb.drywet(clapSlider.val);
    clapReverb = floor(clapSlider.val * 100);

    hihatVerb.drywet(hihatSlider.val);
    hihatReverb = floor(hihatSlider.val * 100);

    recVerb.drywet(recSlider.val);
    recReverb = floor(recSlider.val * 100);
  }

  if (activeEffect == "delay") {
    //kickSlider.val = kick.getOutputVolume();
    kickDel.amp(kickSlider.val);
    kickDelay = floor(kickSlider.val * 100);

    snareDel.amp(snareSlider.val);
    snareDelay = floor(snareSlider.val * 100);

    clapDel.amp(clapSlider.val);
    clapDelay = floor(clapSlider.val * 100);

    hihatDel.amp(hihatSlider.val);
    hihatDelay = floor(hihatSlider.val * 100);

    recDel.amp(recSlider.val);
    recDelay = floor(recSlider.val * 100);
  }
}

//Individual row builds
function drawHihat() {
  for (i = 0; i < beatCount; i++) {
    if (i == 0) {
      hihatRow[0].posX = windowWidth / 2 - (beatCount / 2) * 45 + 5;
    }
    if (i != 0) {
      hihatRow[i].posX = hihatRow[i - 1].posX + 45;
      for (j = 0; j < beatCount; j++) {
        if (j % 4 === 0) {
          hihatRow[j].posX = hihatRow[i - 1].posX + 55;
        }
      }
    }
    hihatRow[i].posY = windowHeight / 2 - 225;
    hihatRow[i].hover();
    hihatRow[i].selectColour = hihatColour;
    hihatRow[i].baseColour = hihatColour2;
    hihatRow[i].display();
    if (hihatRow[i].selectState == true) {
      hihatArray[i] = 1;
    } else {
      hihatArray[i] = 0;
    }
  }
  //pop();
}

function drawClap() {
  for (i = 0; i < beatCount; i++) {
    if (i == 0) {
      clapRow[0].posX = windowWidth / 2 - (beatCount / 2) * 45 + 5;
    }
    if (i != 0) {
      clapRow[i].posX = clapRow[i - 1].posX + 45;
      for (j = 0; j < beatCount; j++) {
        if (j % 4 === 0) {
          clapRow[j].posX = clapRow[i - 1].posX + 55;
        }
      }
    }
    clapRow[i].posY = windowHeight / 2 - 150;
    clapRow[i].hover();
    clapRow[i].selectColour = clapColour;
    clapRow[i].baseColour = clapColour2;
    clapRow[i].display();

    if (clapRow[i].selectState == true) {
      clapArray[i] = 1;
    } else {
      clapArray[i] = 0;
    }
  }
}

function drawSnare() {
  for (i = 0; i < beatCount; i++) {
    if (i == 0) {
      snareRow[0].posX = windowWidth / 2 - (beatCount / 2) * 45 + 5;
    }
    if (i != 0) {
      snareRow[i].posX = snareRow[i - 1].posX + 45;
      for (j = 0; j < beatCount; j++) {
        if (j % 4 === 0) {
          snareRow[j].posX = snareRow[i - 1].posX + 55;
        }
      }
    }
    snareRow[i].posY = windowHeight / 2 - 75;
    snareRow[i].hover();
    snareRow[i].selectColour = snareColour;
    snareRow[i].baseColour = snareColour2;
    snareRow[i].display();

    if (snareRow[i].selectState == true) {
      snareArray[i] = 1;
    } else {
      snareArray[i] = 0;
    }
  }
}

function drawKick() {
  for (i = 0; i < beatCount; i++) {
    if (i == 0) {
      kickRow[0].posX = windowWidth / 2 - (beatCount / 2) * 45 + 5;
    }
    if (i != 0) {
      kickRow[i].posX = kickRow[i - 1].posX + 45;
      for (j = 0; j < beatCount; j++) {
        if (j % 4 === 0) {
          kickRow[j].posX = kickRow[i - 1].posX + 55;
        }
      }
    }
    kickRow[i].posY = windowHeight / 2;
    kickRow[i].hover();
    kickRow[i].selectColour = kickColour;
    kickRow[i].baseColour = kickColour2;
    kickRow[i].display();

    if (kickRow[i].selectState == true) {
      kickArray[i] = 1;
    } else {
      kickArray[i] = 0;
    }
  }
}

function drawRec() {
  for (i = 0; i < beatCount; i++) {
    if (i == 0) {
      recRow[0].posX = windowWidth / 2 - (beatCount / 2) * 45 + 5;
    }
    if (i != 0) {
      recRow[i].posX = recRow[i - 1].posX + 45;
      for (j = 0; j < beatCount; j++) {
        if (j % 4 === 0) {
          recRow[j].posX = recRow[i - 1].posX + 55;
        }
      }
    }
    recRow[i].posY = windowHeight / 2 + 75;
    recRow[i].hover();
    recRow[i].selectColour = recColour;
    recRow[i].baseColour = recColour2;
    recRow[i].display();

    if (recRow[i].selectState == true) {
      recArray[i] = 1;
    } else {
      recArray[i] = 0;
    }
  }
}

function drawRecordCount() {
  if (recState == true) {
    if (frameCount % 60 == 0 && recTimer >= 0) {
      recCanvas.background(20);
      recCanvas.textSize(25);
      recCanvas.fill(uiColour);
      recCanvas.textFont(font);
      recCanvas.rectMode(CENTER);
      recCanvas.textAlign(CENTER);
      recCanvas.text(recTimer, 25, 35);
      recTimer--;
    }
    if (recTimer == -1) {
      recorder.record(rec);
      record[0].selectState = true;
      recCanvas.background(20);
    }
  }
}

//Button & Icon builds
function drawControlButtons() {
  playButton.hover();
  playButton.posX = windowWidth / 2 - 40;
  playButton.display("play");

  stopButton.hover();
  stopButton.posX = windowWidth / 2 + 40;
  stopButton.display("stop");

  resetButton.hover();
  resetButton.posX =
    windowWidth / 2 + (beatCount / 2) * 45 + (beatCount / 4 / 2) * 10 - 30;
  resetButton.display("reset");

  // pauseButton.hover();
  // pauseButton.posX = windowWidth/2+75
  // pauseButton.display("pause");

  if (playButton.selectState == true) {
    drums.loop();
  } else {
    drums.stop();
  }

  for (i = 0; i < 1; i++) {
    record[0].posY = windowHeight / 2 + 75;
    record[i].posX = hihatRow[beatCount - 1].posX + 55;
    record[i].hover();
    record[i].display();
  }
}

function drawRowIcons() {
  let iconX = windowWidth / 2 - (beatCount / 2) * 45 - 75;
  image(hihatIcon, iconX, hihatRow[0].posY, 50, 50);
  image(clapIcon, iconX, clapRow[0].posY, 50, 50);
  image(kickIcon, iconX, kickRow[0].posY, 50, 50);
  image(snareIcon, iconX, snareRow[0].posY, 50, 50);
  image(recIcon, iconX, recRow[0].posY, 50, 50);
}

function drawSliderText() {
  let bpmSliderPosX =
    windowWidth / 2 + (beatCount / 2) * 45 + (beatCount / 4 / 2) * 10 - 30;
  BPMCanvas.background(20);
  BPMCanvas.textSize(25);
  BPMCanvas.fill(uiColour);
  BPMCanvas.textFont(font);
  BPMCanvas.rectMode(CENTER);
  BPMCanvas.textAlign(CENTER);
  BPMCanvas.text(bpmCTRL.val + " BPM", bpmSliderPosX, windowHeight / 2 + 335);

  kickSliderIconPosX = windowWidth / 2 - (beatCount / 2) * 45 + 5;
  if (
    mouseX > kickSliderIconPosX - 25 &&
    mouseX < kickSliderIconPosX + 264 + 25
  ) {
    if (mouseY > windowHeight / 2 + 300 && mouseY < windowHeight / 2 + 350) {
      if (activeEffect == "volume") {
        BPMCanvas.fill(kickColour);
        BPMCanvas.text(
          kickVolume + "%",
          kickSliderIconPosX + 66,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(snareColour);
        BPMCanvas.text(
          snareVolume + "%",
          kickSliderIconPosX + 132,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(clapColour);
        BPMCanvas.text(
          clapVolume + "%",
          kickSliderIconPosX + 198,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(hihatColour);
        BPMCanvas.text(
          hihatVolume + "%",
          kickSliderIconPosX + 264,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(recColour);
        BPMCanvas.text(
          recVolume + "%",
          kickSliderIconPosX,
          windowHeight / 2 + 335
        );
      }
      if (activeEffect == "reverb") {
        BPMCanvas.fill(kickColour);
        BPMCanvas.text(
          kickReverb + "%",
          kickSliderIconPosX + 66,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(snareColour);
        BPMCanvas.text(
          snareReverb + "%",
          kickSliderIconPosX + 132,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(clapColour);
        BPMCanvas.text(
          clapReverb + "%",
          kickSliderIconPosX + 198,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(hihatColour);
        BPMCanvas.text(
          hihatReverb + "%",
          kickSliderIconPosX + 264,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(recColour);
        BPMCanvas.text(
          recReverb + "%",
          kickSliderIconPosX,
          windowHeight / 2 + 335
        );
      }

      if (activeEffect == "delay") {
        BPMCanvas.fill(kickColour);
        BPMCanvas.text(
          kickDelay + "%",
          kickSliderIconPosX + 66,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(snareColour);
        BPMCanvas.text(
          snareDelay + "%",
          kickSliderIconPosX + 132,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(clapColour);
        BPMCanvas.text(
          clapDelay + "%",
          kickSliderIconPosX + 198,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(hihatColour);
        BPMCanvas.text(
          hihatDelay + "%",
          kickSliderIconPosX + 264,
          windowHeight / 2 + 335
        );
        BPMCanvas.fill(recColour);
        BPMCanvas.text(
          recDelay + "%",
          kickSliderIconPosX,
          windowHeight / 2 + 335
        );
      }
      BPMCanvas.fill("white");
      BPMCanvas.textSize(20);
      BPMCanvas.text(
        "Click to reset",
        kickSliderIconPosX + 132,
        windowHeight / 2 + 370
      );
    }
  }

  if (activeEffect == "volume") {
    if (kickSlider.isHeld) {
      BPMCanvas.fill(kickColour);
      BPMCanvas.text(
        kickVolume + "%",
        kickSliderIconPosX + 66,
        windowHeight / 2 + 335
      );
    }
    if (snareSlider.isHeld) {
      BPMCanvas.fill(snareColour);
      BPMCanvas.text(
        snareVolume + "%",
        kickSliderIconPosX + 132,
        windowHeight / 2 + 335
      );
    }
    if (clapSlider.isHeld) {
      BPMCanvas.fill(clapColour);
      BPMCanvas.text(
        clapVolume + "%",
        kickSliderIconPosX + 198,
        windowHeight / 2 + 335
      );
    }
    if (hihatSlider.isHeld) {
      BPMCanvas.fill(hihatColour);
      BPMCanvas.text(
        hihatVolume + "%",
        kickSliderIconPosX + 264,
        windowHeight / 2 + 335
      );
    }
    if (recSlider.isHeld) {
      BPMCanvas.fill(recColour);
      BPMCanvas.text(
        recVolume + "%",
        kickSliderIconPosX,
        windowHeight / 2 + 335
      );
    }
  }
  if (activeEffect == "reverb") {
    if (kickSlider.isHeld) {
      BPMCanvas.fill(kickColour);
      BPMCanvas.text(
        kickReverb + "%",
        kickSliderIconPosX + 66,
        windowHeight / 2 + 335
      );
    }
    if (snareSlider.isHeld) {
      BPMCanvas.fill(snareColour);
      BPMCanvas.text(
        snareReverb + "%",
        kickSliderIconPosX + 132,
        windowHeight / 2 + 335
      );
    }
    if (clapSlider.isHeld) {
      BPMCanvas.fill(clapColour);
      BPMCanvas.text(
        clapReverb + "%",
        kickSliderIconPosX + 198,
        windowHeight / 2 + 335
      );
    }
    if (hihatSlider.isHeld) {
      BPMCanvas.fill(hihatColour);
      BPMCanvas.text(
        hihatReverb + "%",
        kickSliderIconPosX + 264,
        windowHeight / 2 + 335
      );
    }
    if (recSlider.isHeld) {
      BPMCanvas.fill(recColour);
      BPMCanvas.text(
        recReverb + "%",
        kickSliderIconPosX,
        windowHeight / 2 + 335
      );
    }
  }

  if (activeEffect == "delay") {
    if (kickSlider.isHeld) {
      BPMCanvas.fill(kickColour);
      BPMCanvas.text(
        kickDelay + "%",
        kickSliderIconPosX + 66,
        windowHeight / 2 + 335
      );
    }
    if (snareSlider.isHeld) {
      BPMCanvas.fill(snareColour);
      BPMCanvas.text(
        snareDelay + "%",
        kickSliderIconPosX + 132,
        windowHeight / 2 + 335
      );
    }
    if (clapSlider.isHeld) {
      BPMCanvas.fill(clapColour);
      BPMCanvas.text(
        clapDelay + "%",
        kickSliderIconPosX + 198,
        windowHeight / 2 + 335
      );
    }
    if (hihatSlider.isHeld) {
      BPMCanvas.fill(hihatColour);
      BPMCanvas.text(
        hihatDelay + "%",
        kickSliderIconPosX + 264,
        windowHeight / 2 + 335
      );
    }
    if (recSlider.isHeld) {
      BPMCanvas.fill(recColour);
      BPMCanvas.text(
        recDelay + "%",
        kickSliderIconPosX,
        windowHeight / 2 + 335
      );
    }
  }
}

function displaySliderIcons() {
  if (
    mouseX > kickSliderIconPosX - 25 &&
    mouseX < kickSliderIconPosX + 264 + 25
  ) {
    if (mouseY > windowHeight / 2 + 300 && mouseY < windowHeight / 2 + 350) {
    } else {
      if (kickSlider.isHeld == false) {
        image(
          kickIcon,
          kickSliderIconPosX + 66,
          windowHeight / 2 + 325,
          50,
          50
        );
      }
      if (snareSlider.isHeld == false) {
        image(
          snareIcon,
          kickSliderIconPosX + 132,
          windowHeight / 2 + 325,
          50,
          50
        );
      }
      if (clapSlider.isHeld == false) {
        image(
          clapIcon,
          kickSliderIconPosX + 198,
          windowHeight / 2 + 325,
          50,
          50
        );
      }
      if (hihatSlider.isHeld == false) {
        image(
          hihatIcon,
          kickSliderIconPosX + 264,
          windowHeight / 2 + 325,
          50,
          50
        );
      }
      if (recSlider.isHeld == false) {
        image(recIcon, kickSliderIconPosX, windowHeight / 2 + 325, 50, 50);
      }
    }
  } else {
    if (kickSlider.isHeld == false) {
      image(kickIcon, kickSliderIconPosX + 66, windowHeight / 2 + 325, 50, 50);
    }
    if (snareSlider.isHeld == false) {
      image(
        snareIcon,
        kickSliderIconPosX + 132,
        windowHeight / 2 + 325,
        50,
        50
      );
    }
    if (clapSlider.isHeld == false) {
      image(clapIcon, kickSliderIconPosX + 198, windowHeight / 2 + 325, 50, 50);
    }
    if (hihatSlider.isHeld == false) {
      image(
        hihatIcon,
        kickSliderIconPosX + 264,
        windowHeight / 2 + 325,
        50,
        50
      );
    }
    if (recSlider.isHeld == false) {
      image(recIcon, kickSliderIconPosX, windowHeight / 2 + 325, 50, 50);
    }
  }
}

function drawEffectButtons() {
  for (i = 0; i < 3; i++) {
    effect[i].hover();
    effect[i].size = 50;
    effect[i].posX = windowWidth / 2 - (beatCount / 2) * 45 - 75;
    effect[0].posY = windowHeight / 2 + 170;
    effect[1].posY = effect[0].posY + 60;
    effect[2].posY = effect[1].posY + 60;
    effect[0].display("volume");
    effect[1].display("reverb");
    effect[2].display("delay");
  }

  if (effect[0].selectState == true) {
    activeEffect = "volume";
  }
  if (effect[1].selectState == true) {
    activeEffect = "reverb";
  }
  if (effect[2].selectState == true) {
    activeEffect = "delay";
  }
}

function drawWelcomeScreen() {
  if (welcomeState == true) {
    image(welcomeCanvas, windowWidth / 2, windowHeight / 2);
    welcomeCanvas.background(50);
    welcomeCanvas.textFont(font);
    welcomeCanvas.rectMode(CENTER);
    welcomeCanvas.textAlign(CENTER);
    welcomeCanvas.imageMode(CENTER);

    welcomeCanvas.textSize(65);
    welcomeCanvas.fill(uiColour);
    welcomeCanvas.text(
      "STEP SEQUENCER",
      windowWidth / 2,
      windowHeight / 2 - 250
    );
    welcomeCanvas.textSize(25);
    welcomeCanvas.fill("white");
    welcomeCanvas.text(
      "This program has 5 different instruments",
      windowWidth / 2,
      windowHeight / 2 - 160
    );
    welcomeCanvas.image(
      recIcon,
      windowWidth / 2 - 200,
      windowHeight / 2 - 100,
      80,
      80
    );
    welcomeCanvas.textSize(18);
    welcomeCanvas.fill(recColour);
    welcomeCanvas.text("Mic", windowWidth / 2 - 200, windowHeight / 2 - 30);

    welcomeCanvas.image(
      kickIcon,
      windowWidth / 2 - 100,
      windowHeight / 2 - 100,
      80,
      80
    );
    welcomeCanvas.fill(kickColour);
    welcomeCanvas.text("Kick", windowWidth / 2 - 100, windowHeight / 2 - 30);

    welcomeCanvas.image(
      snareIcon,
      windowWidth / 2,
      windowHeight / 2 - 100,
      80,
      80
    );
    welcomeCanvas.fill(snareColour);
    welcomeCanvas.text("Snare", windowWidth / 2, windowHeight / 2 - 30);

    welcomeCanvas.image(
      clapIcon,
      windowWidth / 2 + 100,
      windowHeight / 2 - 100,
      80,
      80
    );
    welcomeCanvas.fill(clapColour);
    welcomeCanvas.text("Clap", windowWidth / 2 + 100, windowHeight / 2 - 30);

    welcomeCanvas.image(
      hihatIcon,
      windowWidth / 2 + 200,
      windowHeight / 2 - 100,
      80,
      80
    );
    welcomeCanvas.fill(hihatColour);
    welcomeCanvas.text("HiHat", windowWidth / 2 + 200, windowHeight / 2 - 30);

    welcomeCanvas.textSize(25);
    welcomeCanvas.fill("white");
    welcomeCanvas.text(
      "And 3 Different Effects",
      windowWidth / 2,
      windowHeight / 2 + 30
    );

    welcomeCanvas.fill(uiColour);
    welcomeCanvas.square(windowWidth / 2 - 100, windowHeight / 2 + 100, 60, 10);
    welcomeCanvas.image(
      volumeIcon,
      windowWidth / 2 - 100,
      windowHeight / 2 + 100,
      50,
      50
    );
    welcomeCanvas.textSize(18);
    welcomeCanvas.text("Volume", windowWidth / 2 - 100, windowHeight / 2 + 160);

    welcomeCanvas.square(windowWidth / 2, windowHeight / 2 + 100, 60, 10);
    welcomeCanvas.image(
      reverbIcon,
      windowWidth / 2,
      windowHeight / 2 + 100,
      50,
      50
    );
    welcomeCanvas.text("Reverb", windowWidth / 2, windowHeight / 2 + 160);

    welcomeCanvas.square(windowWidth / 2 + 100, windowHeight / 2 + 100, 60, 10);
    welcomeCanvas.image(
      delayIcon,
      windowWidth / 2 + 100,
      windowHeight / 2 + 100,
      50,
      50
    );
    welcomeCanvas.text("Delay", windowWidth / 2 + 100, windowHeight / 2 + 160);

    welcomeCanvas.textSize(25);
    welcomeCanvas.fill("white");
    welcomeCanvas.text(
      "Press enter key to get started!",
      windowWidth / 2,
      windowHeight / 2 + 230
    );

    recSlider.enabled = false;
    kickSlider.enabled = false;
    snareSlider.enabled = false;
    clapSlider.enabled = false;
    hihatSlider.enabled = false;
    bpmCTRL.enabled = false;
  } else {
    recSlider.enabled = true;
    kickSlider.enabled = true;
    snareSlider.enabled = true;
    clapSlider.enabled = true;
    hihatSlider.enabled = true;
    bpmCTRL.enabled = true;
  }
}

//Array Function
function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}
