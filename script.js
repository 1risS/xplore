// Contexto de audio (context) y nodo fuente (source)
let context, source;

// Instancia de Hydra
let hydra;

// Indice de la pista actual
let currentTrackIdx = 0;

// Estado del reproductor. Tiene que empezar detenido porque Chrome no ermite
// que una página autoreproduzca audio sin interacción del usuario.
let playing = false;

// Función módulo utilizada para implementar la playlist circular
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
};

/*
 * La variable `playlist` es una lista con objetos que tienen la información de
 * cada pista:
 *
 * - url: la URL del .mp3 que usa el reproductor, debería ser /audio/[archivo].mp3
 * - artistName: Nombre del artista, como se va a mostrar en el reproductor
 * - trackName: Nombre de la pista, como se va a mostrar en el reproductor
 * - profileUrl: URL del artista, opcional
 * - codeUrl: URL del código de la pista, opcional. Debería ser /codeScripts/[archivo].html
 * - hydraFunction: debería ser el nombre de la función con el código de hydra para esta pista
 */
const playlist = [
  {
    url: "/audio/01_HADue.mp3",
    artistName: "Kyoka",
    trackName: "01 HADue",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover",
    hydraFunction: hydraIrisS,
  },
  {
    url: "/audio/02_HADue_AtomTM_remix.mp3",
    artistName: "Kyoka",
    trackName: "02 HADUE (AtomTM Remix)",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover",
    hydraFunction: hydraA,
  },
  {
    url: "/audio/03_YESACLOUDui.mp3",
    artistName: "Kyoka",
    trackName: "03 YESACLOUDui",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover",
    hydraFunction: hydraB,
  },
  {
    url: "/audio/04_23_iSH.mp3",
    artistName: "Kyoka",
    trackName: "04 23 iSH",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover",
    hydraFunction: hydraIrisS,
  },
  {
    url: "/audio/05_ROMOOne.mp3",
    artistName: "Kyoka",
    trackName: "05 ROMOOne",
    profileUrl: "https://example.com/",
    codeUrl: "https://gist.github.com/discover",
    hydraFunction: hydraIrisS,
  },
];

/*
 * Reproduce pista actual, indicada por currentTrackIdx
 *
 * También inicializa el contexto de audio por primera vez.
 */
function play() {
  initializeContext();

  // Start playing
  playing = true;
  updateTrack();

  // Update icons
  const button = document.getElementById("playIcon");
  button.classList.add("fa-stop-circle");
  button.classList.remove("fa-play-circle");
}

/*
 * Ejecuta la función de Hydra de la pista
 */
function runHydra() {
  // Clear hydra first
  hush();
  // Run hydra code from current track
  const track = playlist[currentTrackIdx];
  track.hydraFunction();
}

/*
 * Actualiza los datos de la pista en el reproductor, y se asegura de ejecutar
 * el reproductor y actualizar el código de Hydra
 */
function updateTrack() {
  const track = playlist[currentTrackIdx];

  const title = `${track.artistName} - ${track.trackName}`;
  console.log("Current track:", title);

  const audioEl = document.getElementById("audio");

  audioEl.src = track.url;

  if (playing) {
    audioEl.play();
    runHydra();
  }
}

/*
 * Reproduce o pausa dependiendo del estado
 */
function playPause() {
  if (playing) {
    pause()
  } else {
    play()
  }
}

/*
 * Pausa la reproducción
 */
function pause() {
  const audioEl = document.getElementById("audio");
  audioEl.pause();
  playing = false;

  // Update icons
  var button = document.getElementById("playIcon");
  button.classList.add("fa-play-circle");
  button.classList.remove("fa-stop-circle");
}

/*
 * Avanza a la siguiente pista
 *
 * Usa la función mod (módulo) para hacer una lista circular. Es decir, si
 * está en la última pista, vuelve a la primera.
 */
function next() {
  currentTrackIdx = (currentTrackIdx + 1).mod(playlist.length);
  updateTrack();
}

/*
 * Vuelve a la anterior pista
 *
 * Usa la función mod (módulo) para hacer una lista circular. Es decir, si
 * está en la primer pista, va a la última.
 */
function previous() {
  currentTrackIdx = (currentTrackIdx - 1).mod(playlist.length);
  updateTrack();
}

/*
 * Inicializa Hydra y ajusta el canvas.
 *
 * Se ejecuta al cargar la página (evento onload)
 */
function init() {
  window.addEventListener("resize", resizeCanvas, false);

  // Draw canvas border for the first time.
  resizeCanvas();

  // Create a new hydra-synth instance with audio disabled
  hydra = new window.Hydra({
    canvas: document.getElementById("canvas"),
    detectAudio: false
  });

  // Make container visible
  const container = document.getElementById("interactionContainer");;
  container.classList.remove("hidden");
}

/*
 * Inicializa el contexto de audio y fuente para Hydra
 *
 * También setea eventos generales del <audio>.
 */
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

    audioEl.addEventListener('waiting', () => {
      const icon = document.getElementById("playIcon");
      icon.classList.remove("fa-play-circle", "fa-stop-circle");
      icon.classList.add("fa-spinner", "fa-spin");
    });

    audioEl.addEventListener('playing', () => {
      const icon = document.getElementById("playIcon");
      icon.classList.remove("fa-spinner", "fa-spin");
      if (playing) {
        icon.classList.add("fa-stop-circle");
      } else {
        icon.classList.add("fa-play-circle");
      }
    });

    // Initialize custom audio. This CustomAudio is similar to Audio from hydra,
    // but receives an audio context and source, for audio analysis, instead of
    // the microphone.
    hydra.synth.a = new CustomAudio({
      context: context,
      source: source
    });
    window.a = hydra.synth.a; // set global variable for audio
    hydra.detectAudio = true; // now force hydra to tick audio too
  }
}

/*
 * Devuelve una copia de array mezclada.
 */
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

/*
 * Ajusta el ancho y alto del canvas para que sea full screen
 */
function resizeCanvas() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Cuando se cargue la página, ejecuta la función `init`
window.addEventListener("load", init, false);
