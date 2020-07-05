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
    codeUrl: "https://gist.github.com/discover"
  },
  {
    url: "/audio/02_HADue_AtomTM_remix.mp3",
    artistName: "Kyoka",
    trackName: "02 HADUE (AtomTM Remix)",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover"
  },
  {
    url: "/audio/03_YESACLOUDui.mp3",
    artistName: "Kyoka",
    trackName: "03 YESACLOUDui",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover"
  },
  {
    url: "/audio/04_23_iSH.mp3",
    artistName: "Kyoka",
    trackName: "04 23 iSH",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover"
  },
  {
    url: "/audio/05_ROMOOne.mp3",
    artistName: "Kyoka",
    trackName: "05 ROMOOne",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover"
  },
];

function playHydra() {
  a.show()
  a.setBins(8)
  a.hide()

  solid(1, 0, 1)
    .mult(shape(2)
      .scale(0.0125)
      .modulate(osc(() => a.fft[7] * 20 + 10, 0, 0.03).rotate(Math.PI / 2).modulate(noise(() => (((Math.sin(time / 5) + 1) / 2) * 10 + 0.5), 0.1))
      )
      .scrollY(-0.045)
    )
    .add(
      solid(() => (((Math.sin(time / 2) + 1) / 2) * 0.99 + 0.01), 0, 1)
        .mult(shape(2)
          .scale(() => a.fft[1] * 1 + 0.0125)
          .scrollY(-0.045)
          .modulate(osc(30, 0)
          )
          .modulateScale(
            osc(10, 0.3, 100).modulate(
              noise(() => a.fft[3] * 0.05 + 280)
            ))
          , () => (((Math.sin(time / 20) + 1) / 2) * 1 + 0.01)
        )
        .diff(o0, 0.1)
    )
    .mask(shape(40, 0.4, 0.125).scale(() => a.fft[3] * 2.5 + 1.5))
    .out()
}

function play() {
  initializeContext();

  // Start playing
  playing = true;
  updateTrack();
  const button = document.getElementById("playIcon");

  button.classList.add("fa-stop-circle");
  button.classList.remove("fa-play-circle");

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
function playPause() {
  if (playing) {
    pause()
  } else {
    play()
  }
}

function pause() {
  const audioEl = document.getElementById("audio");
  audioEl.pause();
  playing = false;

  var button = document.getElementById("playIcon");

  button.classList.add("fa-play-circle");
  button.classList.remove("fa-stop-circle");


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

    // Go to next track when current track finishes
    audioEl.addEventListener('ended', (event) => {
      next();
    });

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
