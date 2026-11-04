let screen = "home";

let selected = null;
let choice = "";

let dragging = false;
let dragX = 0;
let dragY = 0;

let animationStart = 0;
let animationDuration = 900;

let journeyStep = 0;

let audioContext = null;


// ============================================================
// COLOURS
// ============================================================

const BG = "#F6F2EB";
const TEXT = "#292824";
const MUTED = "#8C877F";

const GREEN = "#788C6B";
const GREEN_LIGHT = "#DDE6D8";

const BROWN = "#987C62";
const BROWN_LIGHT = "#E8DCCE";

const BLUE = "#8298A8";
const BLUE_LIGHT = "#DCE5EA";


// ============================================================
// OBJECTS
// ============================================================

const items = [

  {
    name: "Plastic bottle",
    emoji: "🥤",
    type: "bottle"
  },

  {
    name: "Pizza",
    emoji: "🍕",
    type: "pizza"
  },

  {
    name: "Banana",
    emoji: "🍌",
    type: "banana"
  },

  {
    name: "T-shirt",
    emoji: "👕",
    type: "shirt"
  },

  {
    name: "Phone",
    emoji: "📱",
    type: "phone"
  },

  {
    name: "Cardboard",
    emoji: "📦",
    type: "cardboard"
  }

];


// ============================================================
// SETUP
// ============================================================

function setup() {

  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER, CENTER);

  textFont("Arial");

  initHands();

}


// ============================================================
// RESIZE
// ============================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  if (typeof placeHandBtn === "function") placeHandBtn();

}


// ============================================================
// SIMPLE SOUND SYSTEM
// ============================================================

function startAudio() {

  if (audioContext === null) {

    audioContext =
      new (window.AudioContext ||
      window.webkitAudioContext)();

  }

  if (
    audioContext.state === "suspended"
  ) {

    audioContext.resume();

  }

}


// ============================================================
// DROP SOUND
// ============================================================

function dropSound() {

  startAudio();

  if (!audioContext) return;

  let oscillator =
    audioContext.createOscillator();

  let gain =
    audioContext.createGain();

  oscillator.type = "triangle";

  oscillator.frequency.setValueAtTime(
    180,
    audioContext.currentTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    60,
    audioContext.currentTime + 0.25
  );

  gain.gain.setValueAtTime(
    0.001,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.2,
    audioContext.currentTime + 0.02
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.3
  );

  oscillator.connect(gain);

  gain.connect(
    audioContext.destination
  );

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + 0.3
  );

}


// ============================================================
// RECYCLING SOUND
// ============================================================

function recycleSound() {

  startAudio();

  if (!audioContext) return;

  let notes = [
    440,
    554,
    659
  ];

  for (
    let i = 0;
    i < notes.length;
    i++
  ) {

    let oscillator =
      audioContext.createOscillator();

    let gain =
      audioContext.createGain();

    let start =
      audioContext.currentTime +
      i * 0.12;

    oscillator.type = "sine";

    oscillator.frequency.value =
      notes[i];

    gain.gain.setValueAtTime(
      0.001,
      start
    );

    gain.gain.exponentialRampToValueAtTime(
      0.15,
      start + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      start + 0.3
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start(start);

    oscillator.stop(
      start + 0.3
    );

  }

}


// ============================================================
// SUCCESS SOUND
// ============================================================

function successSound() {

  startAudio();

  if (!audioContext) return;

  let notes = [
    523,
    659,
    784
  ];

  for (
    let i = 0;
    i < notes.length;
    i++
  ) {

    let oscillator =
      audioContext.createOscillator();

    let gain =
      audioContext.createGain();

    let start =
      audioContext.currentTime +
      i * 0.15;

    oscillator.type = "sine";

    oscillator.frequency.value =
      notes[i];

    gain.gain.setValueAtTime(
      0.001,
      start
    );

    gain.gain.exponentialRampToValueAtTime(
      0.18,
      start + 0.03
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      start + 0.45
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start(start);

    oscillator.stop(
      start + 0.45
    );

  }

}


// ============================================================
// DRAW
// ============================================================

function draw() {

  background(BG);

  if (screen === "home") {

    homeScreen();

  }

  else if (screen === "selected") {

    selectedScreen();

  }

  else if (screen === "dropping") {

    droppingScreen();

  }

  else if (screen === "choice") {

    choiceScreen();

  }

  else if (screen === "journey") {

    journeyScreen();

  }

  else if (screen === "ending") {

    endingScreen();

  }

  // Hand overlay + gesture updates (must stay last)
  handFrame();

}


// ============================================================
// HOME SCREEN
// ============================================================

function homeScreen() {

  fill(TEXT);

  textSize(
    min(width * 0.055, 46)
  );

  text(
    "Where does it go?",
    width / 2,
    height * 0.13
  );

  fill(MUTED);

  textSize(16);

  text(
    "Choose something you're done with.",
    width / 2,
    height * 0.20
  );


  let spacing =
    min(
      width * 0.135,
      110
    );

  let startX =
    width / 2 -
    spacing * 2.5;


  // FLOATING ICONS

  for (
    let i = 0;
    i < items.length;
    i++
  ) {

    let x =
      startX +
      i * spacing;

    let baseY =
      height * 0.42;

    let floatAmount =
      sin(
        millis() * 0.002 +
        i
      ) * 10;

    let y =
      baseY +
      floatAmount;


    // shadow

    noStroke();

    fill(
      200,
      195,
      188,
      50
    );

    ellipse(
      x,
      baseY + 48,
      48,
      9
    );


    // circle

    fill(
      255,
      255,
      255,
      150
    );

    circle(
      x,
      y,
      82
    );


    // icon

    textSize(46);

    text(
      items[i].emoji,
      x,
      y
    );

  }


  drawBin(
    width / 2,
    height * 0.76
  );


  fill(MUTED);

  textSize(14);

  text(
    "drag it into the bin",
    width / 2,
    height * 0.85
  );

}


// ============================================================
// SELECTED SCREEN
// ============================================================

function selectedScreen() {

  fill(TEXT);

  textSize(
    min(width * 0.04, 36)
  );

  text(
    "You're done with this.",
    width / 2,
    height * 0.14
  );

  fill(MUTED);

  textSize(16);

  text(
    "Drag it into the bin.",
    width / 2,
    height * 0.21
  );


  if (dragging) {

    textSize(90);

    text(
      selected.emoji,
      dragX,
      dragY
    );

  }

  else {

    let floatY =
      sin(
        millis() * 0.003
      ) * 8;

    textSize(90);

    text(
      selected.emoji,
      width / 2,
      height * 0.43 +
      floatY
    );

  }


  drawBin(
    width / 2,
    height * 0.76
  );

  drawBack();

}


// ============================================================
// DROPPING
// ============================================================

function droppingScreen() {

  let elapsed =
    millis() -
    animationStart;

  let progress =
    constrain(
      elapsed /
      animationDuration,
      0,
      1
    );


  fill(TEXT);

  textSize(27);

  text(
    "You threw it away.",
    width / 2,
    height * 0.14
  );

  fill(MUTED);

  textSize(16);

  text(
    "But it didn't disappear.",
    width / 2,
    height * 0.21
  );


  drawBin(
    width / 2,
    height * 0.76
  );


  let startY =
    height * 0.42;

  let endY =
    height * 0.76;

  let currentY =
    lerp(
      startY,
      endY,
      easeInOut(progress)
    );

  let size =
    lerp(
      90,
      20,
      progress
    );


  push();

  translate(
    width / 2,
    currentY
  );

  rotate(
    progress * 0.7
  );

  textSize(size);

  text(
    selected.emoji,
    0,
    0
  );

  pop();


  if (
    progress >= 1
  ) {

    screen =
      "choice";

  }

}


// ============================================================
// CHOICE SCREEN
// ============================================================

function choiceScreen() {

  fill(TEXT);

  textSize(
    min(width * 0.04, 36)
  );

  text(
    "Where does it go now?",
    width / 2,
    height * 0.14
  );

  fill(MUTED);

  textSize(16);

  text(
    "You decide what happens next.",
    width / 2,
    height * 0.21
  );


  let floatY =
    sin(
      millis() * 0.003
    ) * 7;

  textSize(75);

  text(
    selected.emoji,
    width / 2,
    height * 0.37 +
    floatY
  );


  drawChoice(
    width / 2 - 155,
    height * 0.61,
    "♻️",
    "Give it another life",
    GREEN_LIGHT
  );


  drawChoice(
    width / 2 + 155,
    height * 0.61,
    "🗑️",
    "Leave it there",
    BROWN_LIGHT
  );


  drawBack();

}


// ============================================================
// CHOICE BUTTON
// ============================================================

function drawChoice(
  x,
  y,
  icon,
  label,
  colour
) {

  rectMode(CENTER);

  noStroke();

  fill(colour);

  rect(
    x,
    y,
    275,
    75,
    20
  );


  textSize(27);

  text(
    icon,
    x - 85,
    y
  );


  fill(TEXT);

  textSize(15);

  text(
    label,
    x + 20,
    y
  );

}


// ============================================================
// JOURNEY
// ============================================================

function journeyScreen() {

  let data =
    journeyData(
      selected.type,
      choice
    );

  let current =
    data[journeyStep];


  fill(TEXT);

  textSize(
    min(width * 0.045, 40)
  );

  text(
    current.title,
    width / 2,
    height * 0.12
  );


  fill(MUTED);

  textSize(16);

  text(
    current.description,
    width / 2,
    height * 0.20
  );


  drawJourneyAnimation(
    selected.type,
    current
  );


  drawProgress(
    journeyStep,
    data.length
  );


  drawNext(
    journeyStep ===
    data.length - 1
  );


  drawBack();

}


// ============================================================
// JOURNEY DATA
// ============================================================

function journeyData(
  type,
  route
) {

  if (type === "bottle") {

    if (route === "recycle") {

      return [

        {
          title: "Collected",
          description:
          "The bottle enters the recycling system."
        },

        {
          title: "Sorted",
          description:
          "PET bottles are separated from other materials."
        },

        {
          title: "Washed",
          description:
          "The bottle is cleaned before processing."
        },

        {
          title: "Shredded",
          description:
          "The bottle becomes small plastic flakes."
        },

        {
          title: "Processed",
          description:
          "The flakes can be processed into recycled PET."
        },

        {
          title: "A new life",
          description:
          "Recovered material can become part of another product."
        }

      ];

    }

    else {

      return [

        {
          title: "Buried",
          description:
          "The bottle becomes part of the landfill."
        },

        {
          title: "Covered",
          description:
          "Layers of waste slowly build above it."
        },

        {
          title: "Years pass",
          description:
          "PET does not readily biodegrade."
        },

        {
          title: "Still here",
          description:
          "You stopped seeing it. It did not disappear."
        }

      ];

    }

  }


  if (type === "pizza") {

    if (route === "recycle") {

      return [

        {
          title: "Food waste",
          description:
          "The leftover food enters a composting system."
        },

        {
          title: "Breakdown",
          description:
          "Microorganisms break down the organic material."
        },

        {
          title: "Compost",
          description:
          "The material becomes nutrient-rich compost."
        },

        {
          title: "New growth",
          description:
          "The compost can support new plant growth."
        }

      ];

    }

    else {

      return [

        {
          title: "Landfill",
          description:
          "The food is buried with other waste."
        },

        {
          title: "Decomposition",
          description:
          "Organic waste breaks down in low-oxygen conditions."
        },

        {
          title: "Methane",
          description:
          "Landfill decomposition can generate methane."
        }

      ];

    }

  }


  if (type === "banana") {

    if (route === "recycle") {

      return [

        {
          title: "Organic waste",
          description:
          "The banana enters a composting environment."
        },

        {
          title: "Decomposition",
          description:
          "Microorganisms break down the banana."
        },

        {
          title: "Compost",
          description:
          "The material becomes part of nutrient-rich compost."
        },

        {
          title: "Back to the soil",
          description:
          "The compost can support new plant growth."
        }

      ];

    }

    else {

      return [

        {
          title: "Discarded",
          description:
          "The banana becomes part of buried waste."
        },

        {
          title: "Decomposition",
          description:
          "Organic material breaks down in low-oxygen conditions."
        },

        {
          title: "Methane",
          description:
          "Landfill decomposition can generate methane."
        }

      ];

    }

  }


  if (type === "shirt") {

    if (route === "recycle") {

      return [

        {
          title: "Sorted",
          description:
          "The textile is separated for reuse or recycling."
        },

        {
          title: "Reuse",
          description:
          "A wearable shirt can be passed on to someone else."
        },

        {
          title: "Fibre",
          description:
          "Some textiles can be processed into recovered fibres."
        },

        {
          title: "Another life",
          description:
          "Recovered fibres can become another textile product."
        }

      ];

    }

    else {

      return [

        {
          title: "Discarded",
          description:
          "The textile enters the waste stream."
        },

        {
          title: "Buried",
          description:
          "It becomes part of a landfill."
        },

        {
          title: "Still material",
          description:
          "The fabric does not simply vanish."
        }

      ];

    }

  }


  if (type === "phone") {

    if (route === "recycle") {

      return [

        {
          title: "E-waste",
          description:
          "The phone enters a specialized e-waste system."
        },

        {
          title: "Disassembled",
          description:
          "Its components are separated."
        },

        {
          title: "Materials recovered",
          description:
          "Useful materials can be recovered through processing."
        },

        {
          title: "A second life",
          description:
          "Recovered materials can become inputs for new products."
        }

      ];

    }

    else {

      return [

        {
          title: "Discarded",
          description:
          "The phone enters the waste stream."
        },

        {
          title: "Electronic waste",
          description:
          "Electronics contain many different materials."
        },

        {
          title: "Not just a phone",
          description:
          "Its materials do not disappear when discarded."
        }

      ];

    }

  }


  if (type === "cardboard") {

    if (route === "recycle") {

      return [

        {
          title: "Sorted",
          description:
          "The cardboard is separated from other materials."
        },

        {
          title: "Pulped",
          description:
          "The cardboard is processed into paper pulp."
        },

        {
          title: "Fibres",
          description:
          "The paper fibres are cleaned and prepared."
        },

        {
          title: "New sheet",
          description:
          "Recovered fibres become new paper or cardboard."
        },

        {
          title: "Another box",
          description:
          "The material becomes part of a new cardboard product."
        }

      ];

    }

    else {

      return [

        {
          title: "Discarded",
          description:
          "The cardboard enters the general waste stream."
        },

        {
          title: "Buried",
          description:
          "It becomes part of a landfill."
        },

        {
          title: "A missed opportunity",
          description:
          "A recyclable material has left the recycling stream."
        }

      ];

    }

  }

}


// ============================================================
// JOURNEY ANIMATIONS
// ============================================================

function drawJourneyAnimation(
  type,
  step
) {

  let x =
    width / 2;

  let y =
    height * 0.46;


  // BOTTLE

  if (type === "bottle") {

    if (
      step.title === "Collected"
    ) {

      animateTruck(x, y);

    }

    else if (
      step.title === "Sorted"
    ) {

      animateSorting(x, y);

    }

    else if (
      step.title === "Washed"
    ) {

      animateWashing(x, y);

    }

    else if (
      step.title === "Shredded"
    ) {

      animateShredding(x, y);

    }

    else if (
      step.title === "Processed"
    ) {

      animatePellets(x, y);

    }

    else if (
      step.title === "A new life"
    ) {

      animateFinalProduct(
        x,
        y,
        "🥤"
      );

    }

    else {

      animateLandfill(
        x,
        y
      );

    }

  }


  // FOOD

  else if (
    type === "pizza" ||
    type === "banana"
  ) {

    if (
      step.title === "Food waste" ||
      step.title === "Organic waste"
    ) {

      drawLargeEmoji(
        selected.emoji,
        x,
        y
      );

    }

    else if (
      step.title === "Breakdown" ||
      step.title === "Decomposition"
    ) {

      animateDecomposition(
        x,
        y
      );

    }

    else if (
      step.title === "Compost"
    ) {

      animateCompost(
        x,
        y
      );

    }

    else if (
      step.title === "New growth" ||
      step.title === "Back to the soil"
    ) {

      animateFinalPlant(
        x,
        y
      );

    }

    else {

      animateLandfill(
        x,
        y
      );

    }

  }


  // SHIRT

  else if (
    type === "shirt"
  ) {

    if (
      step.title === "Sorted"
    ) {

      animateSorting(
        x,
        y
      );

    }

    else if (
      step.title === "Reuse"
    ) {

      animateReuse(
        x,
        y
      );

    }

    else if (
      step.title === "Fibre"
    ) {

      animateFibres(
        x,
        y
      );

    }

    else if (
      step.title === "Another life"
    ) {

      animateFinalProduct(
        x,
        y,
        "👕"
      );

    }

    else {

      animateLandfill(
        x,
        y
      );

    }

  }


  // PHONE

  else if (
    type === "phone"
  ) {

    if (
      step.title === "E-waste"
    ) {

      drawLargeEmoji(
        "📱",
        x,
        y
      );

    }

    else if (
      step.title === "Disassembled"
    ) {

      animatePhoneParts(
        x,
        y
      );

    }

    else if (
      step.title === "Materials recovered"
    ) {

      animateMaterials(
        x,
        y
      );

    }

    else if (
      step.title === "A second life"
    ) {

      animateFinalProduct(
        x,
        y,
        "📱"
      );

    }

    else {

      animateLandfill(
        x,
        y
      );

    }

  }


  // CARDBOARD

  else if (
    type === "cardboard"
  ) {

    if (
      step.title === "Sorted"
    ) {

      animateSorting(
        x,
        y
      );

    }

    else if (
      step.title === "Pulped"
    ) {

      animatePulp(
        x,
        y
      );

    }

    else if (
      step.title === "Fibres"
    ) {

      animateFibres(
        x,
        y
      );

    }

    else if (
      step.title === "New sheet"
    ) {

      animatePaper(
        x,
        y
      );

    }

    else if (
      step.title === "Another box"
    ) {

      animateFinalProduct(
        x,
        y,
        "📦"
      );

    }

    else {

      animateLandfill(
        x,
        y
      );

    }

  }

}


// ============================================================
// LARGE EMOJI
// ============================================================

function drawLargeEmoji(
  emoji,
  x,
  y
) {

  let floatY =
    sin(
      millis() * 0.003
    ) * 5;

  textSize(90);

  text(
    emoji,
    x,
    y + floatY
  );

}


// ============================================================
// TRUCK
// ============================================================

function animateTruck(
  x,
  y
) {

  let movement =
    (millis() * 0.05) %
    300;

  let truckX =
    x - 150 +
    movement;


  rectMode(CENTER);

  noStroke();

  fill("#D6D0C5");

  rect(
    truckX,
    y + 20,
    130,
    65,
    12
  );

  fill("#B9B1A5");

  rect(
    truckX + 70,
    y + 30,
    50,
    45,
    10
  );


  fill(BG);

  circle(
    truckX - 40,
    y + 55,
    24
  );

  circle(
    truckX + 55,
    y + 55,
    24
  );


  textSize(30);

  text(
    "♻️",
    truckX,
    y + 15
  );

}


// ============================================================
// SORTING
// ============================================================

function animateSorting(
  x,
  y
) {

  stroke("#C7C1B8");

  strokeWeight(5);

  line(
    x - 170,
    y + 50,
    x + 170,
    y + 50
  );

  noStroke();


  for (
    let i = 0;
    i < 8;
    i++
  ) {

    let px =
      x - 150 +
      (
        millis() * 0.04 +
        i * 50
      ) % 300;

    fill("#D5CEC4");

    circle(
      px,
      y + 50,
      15
    );

  }


  textSize(70);

  text(
    selected.emoji,
    x,
    y
  );

}


// ============================================================
// WASHING
// ============================================================

function animateWashing(
  x,
  y
) {

  noStroke();

  fill(BLUE_LIGHT);

  ellipse(
    x,
    y + 30,
    250,
    120
  );


  textSize(70);

  text(
    "🥤",
    x,
    y
  );


  for (
    let i = 0;
    i < 10;
    i++
  ) {

    let bx =
      x - 100 +
      i * 23;

    let by =
      y + 40 -
      (
        (
          millis() * 0.04 +
          i * 20
        ) % 100
      );


    noFill();

    stroke(BLUE);

    strokeWeight(2);

    circle(
      bx,
      by,
      8
    );

  }

}


// ============================================================
// SHREDDING
// ============================================================

function animateShredding(
  x,
  y
) {

  textSize(70);

  text(
    "🥤",
    x - 60,
    y
  );


  rectMode(CENTER);

  noStroke();

  fill("#D3CEC4");

  rect(
    x + 90,
    y,
    100,
    150,
    15
  );


  fill(GREEN);

  circle(
    x + 90,
    y,
    50
  );


  for (
    let i = 0;
    i < 18;
    i++
  ) {

    let px =
      x + 20 +
      (
        millis() * 0.03 +
        i * 15
      ) % 130;

    let py =
      y - 70 +
      (
        i * 37
      ) % 140;

    fill(GREEN);

    circle(
      px,
      py,
      7
    );

  }

}


// ============================================================
// PELLETS
// ============================================================

function animatePellets(
  x,
  y
) {

  for (
    let i = 0;
    i < 30;
    i++
  ) {

    let angle =
      TWO_PI * i / 30;

    let radius =
      60 +
      sin(
        millis() * 0.002 +
        i
      ) * 10;

    let px =
      x +
      cos(angle) *
      radius;

    let py =
      y +
      sin(angle) *
      radius;

    fill(GREEN);

    circle(
      px,
      py,
      13
    );

  }

}


// ============================================================
// FINAL PRODUCT
// ============================================================

function animateFinalProduct(
  x,
  y,
  emoji
) {

  let pulse =
    sin(
      millis() * 0.004
    );


  // glow

  noFill();

  stroke(
    120,
    140,
    105,
    50
  );

  strokeWeight(8);

  circle(
    x,
    y,
    220 +
    pulse * 10
  );


  stroke(
    120,
    140,
    105,
    25
  );

  strokeWeight(4);

  circle(
    x,
    y,
    250 +
    pulse * 12
  );


  // highlighted background

  noStroke();

  fill(GREEN_LIGHT);

  circle(
    x,
    y,
    185
  );


  // product

  push();

  translate(
    x,
    y
  );

  scale(
    1 +
    pulse * 0.04
  );

  textSize(70);

  text(
    emoji,
    0,
    0
  );

  pop();


  // sparkles

  for (
    let i = 0;
    i < 10;
    i++
  ) {

    let angle =
      millis() * 0.001 +
      i * 0.65;

    let radius =
      110;

    let px =
      x +
      cos(angle) *
      radius;

    let py =
      y +
      sin(angle) *
      radius;

    fill(GREEN);

    circle(
      px,
      py,
      5
    );

  }


  fill(GREEN);

  textSize(15);

  text(
    "♻️  NEW LIFE",
    x,
    y + 125
  );

}


// ============================================================
// DECOMPOSITION
// ============================================================

function animateDecomposition(
  x,
  y
) {

  textSize(70);

  text(
    selected.emoji,
    x,
    y
  );


  for (
    let i = 0;
    i < 25;
    i++
  ) {

    let angle =
      millis() * 0.001 +
      i;

    let radius =
      30 +
      i * 2;

    let px =
      x +
      cos(angle) *
      radius;

    let py =
      y +
      sin(angle) *
      radius;

    noStroke();

    fill(BROWN);

    circle(
      px,
      py,
      5
    );

  }

}


// ============================================================
// COMPOST
// ============================================================

function animateCompost(
  x,
  y
) {

  noStroke();

  fill(BROWN_LIGHT);

  ellipse(
    x,
    y + 45,
    240,
    110
  );


  for (
    let i = 0;
    i < 20;
    i++
  ) {

    fill(BROWN);

    let px =
      x - 90 +
      (
        i * 23
      ) % 180;

    let py =
      y +
      (
        i * 17
      ) % 65;

    circle(
      px,
      py,
      7
    );

  }


  textSize(50);

  text(
    "🌱",
    x,
    y - 30
  );

}


// ============================================================
// FINAL PLANT
// ============================================================

function animateFinalPlant(
  x,
  y
) {

  let pulse =
    sin(
      millis() * 0.004
    );


  noFill();

  stroke(
    120,
    140,
    105,
    50
  );

  strokeWeight(8);

  circle(
    x,
    y,
    220 +
    pulse * 10
  );


  noStroke();

  fill(GREEN_LIGHT);

  circle(
    x,
    y,
    185
  );


  push();

  translate(
    x,
    y + 20
  );

  stroke(GREEN);

  strokeWeight(6);

  line(
    0,
    70,
    0,
    -50
  );

  noStroke();

  fill(GREEN);

  ellipse(
    -25,
    -10,
    50,
    25
  );

  ellipse(
    25,
    -35,
    50,
    25
  );

  fill("#A8B98C");

  circle(
    0,
    -65,
    40
  );

  pop();


  fill(GREEN);

  textSize(15);

  text(
    "♻️  BACK TO THE SOIL",
    x,
    y + 125
  );

}


// ============================================================
// REUSE
// ============================================================

function animateReuse(
  x,
  y
) {

  let floatY =
    sin(
      millis() * 0.003
    ) * 5;


  textSize(70);

  text(
    "👕",
    x - 60,
    y + floatY
  );


  textSize(40);

  text(
    "→",
    x,
    y
  );


  textSize(70);

  text(
    "👤",
    x + 70,
    y + floatY
  );

}


// ============================================================
// FIBRES
// ============================================================

function animateFibres(
  x,
  y
) {

  noStroke();


  for (
    let i = 0;
    i < 35;
    i++
  ) {

    let angle =
      i * 0.7;

    let radius =
      30 +
      (
        millis() * 0.03 +
        i * 4
      ) % 80;

    let px =
      x +
      cos(angle) *
      radius;

    let py =
      y +
      sin(angle) *
      radius;

    fill(
      i % 2 === 0
        ? GREEN
        : "#B6A58F"
    );

    circle(
      px,
      py,
      7
    );

  }

}


// ============================================================
// PHONE PARTS
// ============================================================

function animatePhoneParts(
  x,
  y
) {

  let parts = [

    ["▣", -70, -30],

    ["●", 70, -30],

    ["◆", -60, 70],

    ["■", 60, 70]

  ];


  textSize(35);


  for (
    let i = 0;
    i < parts.length;
    i++
  ) {

    fill(BLUE);

    text(
      parts[i][0],
      x + parts[i][1],
      y + parts[i][2]
    );

  }

}


// ============================================================
// MATERIALS
// ============================================================

function animateMaterials(
  x,
  y
) {

  let labels = [

    "metal",
    "glass",
    "copper",
    "plastic"

  ];


  for (
    let i = 0;
    i < 4;
    i++
  ) {

    let angle =
      TWO_PI * i / 4;

    let px =
      x +
      cos(angle) *
      100;

    let py =
      y +
      sin(angle) *
      70;


    noStroke();

    fill(BLUE_LIGHT);

    circle(
      px,
      py,
      70
    );


    fill(TEXT);

    textSize(11);

    text(
      labels[i],
      px,
      py
    );

  }

}


// ============================================================
// PULP
// ============================================================

function animatePulp(
  x,
  y
) {

  noStroke();

  fill("#D9C7A5");

  ellipse(
    x,
    y,
    220,
    150
  );


  for (
    let i = 0;
    i < 40;
    i++
  ) {

    fill("#BCA887");

    let px =
      x - 100 +
      (
        i * 29
      ) % 200;

    let py =
      y - 60 +
      (
        i * 31
      ) % 120;

    circle(
      px,
      py,
      7
    );

  }

}


// ============================================================
// PAPER
// ============================================================

function animatePaper(
  x,
  y
) {

  rectMode(CENTER);

  noStroke();

  fill("#E6DDCD");

  rect(
    x,
    y,
    180,
    120,
    8
  );


  fill(BROWN);

  textSize(13);

  text(
    "new paper",
    x,
    y
  );

}


// ============================================================
// LANDFILL - MESSY
// ============================================================

function animateLandfill(
  x,
  y
) {

  noStroke();


  // Ground

  fill("#D8C5AE");

  ellipse(
    x,
    y + 85,
    390,
    145
  );


  fill("#A98A6D");

  ellipse(
    x,
    y + 65,
    330,
    105
  );


  // Lots of garbage

  let garbage = [

    "🥤",
    "📦",
    "🍌",
    "🍕",
    "🥫",
    "🛍️",
    "🧃",
    "📄",
    "👟",
    "🥡",
    "🧴",
    "🗑️",
    "📦",
    "🍎",
    "🧃",
    "🥤",
    "📦",
    "🛍️"

  ];


  for (
    let i = 0;
    i < garbage.length;
    i++
  ) {

    let angle =
      i * 2.35;

    let radius =
      45 +
      (
        i * 23
      ) % 120;

    let gx =
      x +
      cos(angle) *
      radius;

    let gy =
      y +
      35 +
      sin(angle) *
      38;


    push();

    translate(
      gx,
      gy
    );

    rotate(
      sin(i * 4) * 0.15
    );

    textSize(
      20 +
      (i % 3) * 7
    );

    text(
      garbage[i],
      0,
      0
    );

    pop();

  }


  // Small rubbish pieces

  for (
    let i = 0;
    i < 30;
    i++
  ) {

    let gx =
      x -
      150 +
      (
        i * 37
      ) % 300;

    let gy =
      y +
      10 +
      (
        i * 19
      ) % 75;

    fill(
      i % 2 === 0
        ? "#92785E"
        : "#A98E73"
    );

    circle(
      gx,
      gy,
      5 +
      i % 5
    );

  }


  // Main object

  textSize(60);

  text(
    selected.emoji,
    x,
    y
  );


  // Little flies / atmosphere

  fill(
    90,
    75,
    60,
    80
  );

  for (
    let i = 0;
    i < 8;
    i++
  ) {

    let fx =
      x - 120 +
      (
        millis() * 0.02 +
        i * 55
      ) % 240;

    let fy =
      y - 30 +
      sin(
        millis() * 0.003 +
        i
      ) * 20;

    circle(
      fx,
      fy,
      3
    );

  }

}


// ============================================================
// PROGRESS BAR
// ============================================================

function drawProgress(
  current,
  total
) {

  let barWidth =
    min(
      width * 0.5,
      420
    );

  let x =
    width / 2 -
    barWidth / 2;

  let y =
    height * 0.82;


  noStroke();

  fill("#DED9D0");

  rect(
    x,
    y,
    barWidth,
    5,
    5
  );


  fill(
    choice === "recycle"
      ? GREEN
      : BROWN
  );


  rect(
    x,
    y,
    barWidth *
    (
      (current + 1) /
      total
    ),
    5,
    5
  );

}


// ============================================================
// NEXT BUTTON
// ============================================================

function drawNext(
  last
) {

  rectMode(CENTER);

  noStroke();

  fill(TEXT);

  rect(
    width / 2,
    height * 0.90,
    125,
    45,
    25
  );


  fill(BG);

  textSize(14);

  text(
    last
      ? "finish"
      : "next",
    width / 2,
    height * 0.90
  );

}


// ============================================================
// ENDING
// ============================================================

function endingScreen() {

  if (
    choice === "recycle"
  ) {

    fill(TEXT);

    textSize(
      min(
        width * 0.055,
        46
      )
    );

    text(
      "It became something new.",
      width / 2,
      height * 0.25
    );


    fill(MUTED);

    textSize(17);

    text(
      "The journey didn't end.",
      width / 2,
      height * 0.34
    );


    // Highlight

    let pulse =
      sin(
        millis() * 0.004
      );


    noFill();

    stroke(
      120,
      140,
      105,
      60
    );

    strokeWeight(10);

    circle(
      width / 2,
      height * 0.50,
      180 +
      pulse * 10
    );


    noStroke();

    fill(GREEN_LIGHT);

    circle(
      width / 2,
      height * 0.50,
      145
    );


    textSize(65);

    text(
      finalEmoji(),
      width / 2,
      height * 0.50
    );


    fill(GREEN);

    textSize(15);

    text(
      "♻️  SECOND LIFE",
      width / 2,
      height * 0.63
    );

  }

  else {

    fill(TEXT);

    textSize(
      min(
        width * 0.06,
        50
      )
    );

    text(
      "It didn't disappear.",
      width / 2,
      height * 0.34
    );


    fill(MUTED);

    textSize(18);

    text(
      "You just stopped seeing it.",
      width / 2,
      height * 0.43
    );


    fill(TEXT);

    textSize(20);

    text(
      "Every object has a journey.",
      width / 2,
      height * 0.56
    );

  }


  // Restart button

  rectMode(CENTER);

  noStroke();

  fill(TEXT);

  rect(
    width / 2,
    height * 0.78,
    150,
    48,
    25
  );


  fill(BG);

  textSize(14);

  text(
    "try another",
    width / 2,
    height * 0.78
  );

}


// ============================================================
// FINAL EMOJI
// ============================================================

function finalEmoji() {

  if (
    selected.type === "pizza" ||
    selected.type === "banana"
  ) {

    return "🌱";

  }

  if (
    selected.type === "bottle"
  ) {

    return "🥤";

  }

  if (
    selected.type === "shirt"
  ) {

    return "👕";

  }

  if (
    selected.type === "phone"
  ) {

    return "📱";

  }

  if (
    selected.type === "cardboard"
  ) {

    return "📦";

  }

  return "♻️";

}


// ============================================================
// BACK BUTTON
// ============================================================

function drawBack() {

  fill(MUTED);

  textAlign(
    LEFT,
    CENTER
  );

  textSize(14);

  text(
    "← back",
    25,
    28
  );

  textAlign(
    CENTER,
    CENTER
  );

}


// ============================================================
// BIN
// ============================================================

function drawBin(
  x,
  y
) {

  push();

  rectMode(CENTER);

  noStroke();


  // body

  fill("#D5D0C7");

  rect(
    x,
    y,
    105,
    115,
    12
  );


  // lid

  fill("#BDB8AF");

  rect(
    x,
    y - 62,
    120,
    16,
    8
  );


  // handle

  fill("#908B83");

  rect(
    x,
    y - 62,
    45,
    5,
    3
  );


  textSize(32);

  text(
    "♻️",
    x,
    y + 5
  );


  pop();

}


// ============================================================
// EASING
// ============================================================

function easeInOut(t) {

  if (t < 0.5) {

    return 2 * t * t;

  }

  return 1 -
    pow(
      -2 * t + 2,
      2
    ) / 2;

}


// ============================================================
// MOUSE PRESSED
// ============================================================

function mousePressed() {

  startAudio();


  // ==========================================================
  // HOME
  // ==========================================================

  if (
    screen === "home"
  ) {

    let spacing =
      min(
        width * 0.135,
        110
      );

    let startX =
      width / 2 -
      spacing * 2.5;

    let y =
      height * 0.42;


    for (
      let i = 0;
      i < items.length;
      i++
    ) {

      let x =
        startX +
        i * spacing;


      if (
        dist(
          mouseX,
          mouseY,
          x,
          y
        ) < 60
      ) {

        selected =
          items[i];

        screen =
          "selected";

        return;

      }

    }

  }


  // ==========================================================
  // SELECTED
  // ==========================================================

  else if (
    screen === "selected"
  ) {

    if (
      mouseX < 100 &&
      mouseY < 60
    ) {

      screen =
        "home";

      selected =
        null;

      return;

    }


    if (
      dist(
        mouseX,
        mouseY,
        width / 2,
        height * 0.43
      ) < 80
    ) {

      dragging =
        true;

      dragX =
        mouseX;

      dragY =
        mouseY;

    }

  }


  // ==========================================================
  // CHOICE
  // ==========================================================

  else if (
    screen === "choice"
  ) {

    if (
      mouseX < 100 &&
      mouseY < 60
    ) {

      screen =
        "selected";

      return;

    }


    // recycle button

    if (
      mouseX >
      width / 2 - 292 &&

      mouseX <
      width / 2 - 18 &&

      mouseY >
      height * 0.61 - 40 &&

      mouseY <
      height * 0.61 + 40
    ) {

      choice =
        "recycle";

      journeyStep =
        0;

      recycleSound();

      screen =
        "journey";

      return;

    }


    // landfill button

    if (
      mouseX >
      width / 2 + 18 &&

      mouseX <
      width / 2 + 292 &&

      mouseY >
      height * 0.61 - 40 &&

      mouseY <
      height * 0.61 + 40
    ) {

      choice =
        "landfill";

      journeyStep =
        0;

      screen =
        "journey";

      return;

    }

  }


  // ==========================================================
  // JOURNEY
  // ==========================================================

  else if (
    screen === "journey"
  ) {

    if (
      mouseX < 100 &&
      mouseY < 60
    ) {

      screen =
        "choice";

      return;

    }


    if (
      mouseX >
      width / 2 - 75 &&

      mouseX <
      width / 2 + 75 &&

      mouseY >
      height * 0.90 - 30 &&

      mouseY <
      height * 0.90 + 30
    ) {

      let data =
        journeyData(
          selected.type,
          choice
        );


      if (
        journeyStep <
        data.length - 1
      ) {

        journeyStep++;


        if (
          choice === "recycle" &&
          journeyStep ===
          data.length - 1
        ) {

          setTimeout(
            successSound,
            100
          );

        }

      }

      else {

        screen =
          "ending";

      }

    }

  }


  // ==========================================================
  // ENDING
  // ==========================================================

  else if (
    screen === "ending"
  ) {

    if (
      mouseX >
      width / 2 - 80 &&

      mouseX <
      width / 2 + 80 &&

      mouseY >
      height * 0.78 - 30 &&

      mouseY <
      height * 0.78 + 30
    ) {

      screen =
        "home";

      selected =
        null;

      choice =
        "";

      journeyStep =
        0;

    }

  }

}


// ============================================================
// MOUSE DRAGGED
// ============================================================

function mouseDragged() {

  if (
    screen === "selected" &&
    dragging
  ) {

    dragX =
      mouseX;

    dragY =
      mouseY;

  }

}


// ============================================================
// MOUSE RELEASED
// ============================================================

function mouseReleased() {

  if (
    screen === "selected" &&
    dragging
  ) {

    dragging =
      false;


    let distance =
      dist(
        mouseX,
        mouseY,
        width / 2,
        height * 0.76
      );


    if (
      distance < 110
    ) {

      animationStart =
        millis();

      dropSound();

      screen =
        "dropping";

    }

  }

}

