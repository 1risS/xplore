let context, source;
let hydra;
let sound;
let currentTrackIdx = 0;
let playing = false;

const playlist = [
  {
    url: "/audio/01_HADue.mp3",
    artistName: "Kyoka",
    trackName: "01 HADue",
    profileUrl: "https://example.com/",
  },
  {
    url: "/audio/02_HADue_AtomTM_remix.mp3",
    artistName: "Kyoka",
    trackName: "02 HADUE (AtomTM Remix)",
    profileUrl: "https://example.com/",
  },
  {
    url: "/audio/03_YESACLOUDui.mp3",
    artistName: "Kyoka",
    trackName: "03 YESACLOUDui",
    profileUrl: "https://example.com/",
  },
  {
    url: "/audio/04_23_iSH.mp3",
    artistName: "Kyoka",
    trackName: "04 23 iSH",
    profileUrl: "https://example.com/",
  },
  {
    url: "/audio/05_ROMOOne.mp3",
    artistName: "Kyoka",
    trackName: "05 ROMOOne",
    profileUrl: "https://example.com/",
  },
];

function playHydra() {
  a.show()
  a.setBins(8)
  a.hide()
  osc([60, 30, 15, 7.5].fast(5))
    .color(1, 0, 0)
    .mult(osc()
      .rotate(Math.PI / 2)
      .thresh()
      .mult(noise([40, 20, 10, 5, 2.5]
        .fast(5)))
      .shift(0.001, (() => a.fft[0] * 0.04 + 0)
        , 0, 0.5))
    .modulate(
      noise(() => a.fft[2] * 10 + 0.01)
    )
    .mask(
      shape(40)
        .scale(() => a.fft[3] * 7.5 + 0.1)
        .modulateScale(shape(3)
          .scale([1, 2].fast(5)))
        .modulate(noise(() => (((Math.sin(time / 5) + 1) / 2) * 20 + 5))
          .mult(src(o0)
            , () => a.fft[6] * 1 + 0.001))
    )
    .add(
      shape(4)
        .scale([4, 0])
        .mult(
          solid(1, [0, 1].fast(5), 1)
        )
      , () => a.fft[1] * 1 + 0.001
    )
    .scrollX(0.47)
    .kaleid(2).rotate(Math.PI / 2)
    .out()
}

function play() {
  initializeContext();
  // Start playing
  playing = true;
  updateTrack();

  playHydra();
}

function updateTrack() {
  const track = playlist[currentTrackIdx];

  const title = `${track.artistName} - ${track.trackName}`;
  console.log("Current track:", title);

  const audioEl = document.getElementById("audio");
  audioEl.src = track.url;
  if (playing) {
    audioEl.play();
  }
}

function pause() {
  const audioEl = document.getElementById("audio");
  audioEl.pause();
  playing = false;
}

function next() {
  currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
  updateTrack();
}

function prev() {
  console.log("prev");
  currentTrackIdx = (currentTrackIdx - 1) % playlist.length;
  updateTrack();
}

function init() {
  window.addEventListener("resize", resizeCanvas, false);

  // Draw canvas border for the first time.
  resizeCanvas();

  // Create a new hydra-synth instance with audio disabled
  hydra = new window.Hydra({
    canvas: document.getElementById("canvas"),
    detectAudio: false
  });
}

function initializeContext() {
  // Initialize audio context and source, if it's the first time
  if (!context || !source) {
    context = new AudioContext();

    const audioEl = document.getElementById("audio");
    source = context.createMediaElementSource(audioEl);
    source.connect(context.destination);

    // Initialize custom audio
    hydra.synth.a = new CustomAudio({
      context: context,
      source: source
    });
    window.a = hydra.synth.a; // set global variable for audio
    hydra.detectAudio = true; // now force hydra to tick audio too
  }
}

function shuffle(array) {
  var i, j, x;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
}

function resizeCanvas() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("load", init, false);
