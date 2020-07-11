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
let playlist = [
  {
    url: "audio/Adriano_Duarte_-_Pajaritos.mp3",
    artistName: "Adriano Duarte",
    trackName: "Pajaritos",
    codeUrl: "codeScripts/Adriano_Duarte_-_Pajaritos.html",
    hydraFunction: hydraIrisS,
  },
  {
    url: "audio/Ale_Zacha_-_Atras_del_tunel_la_luz.mp3",
    artistName: "Ale Zacha",
    trackName: "Atrás del tunel la luz",
    hydraFunction: hydraA,
  },
  {
    url: "audio/Ale_Zacha_-_olfato_tacto_y_todo_lo_que_no_se_puede.mp3",
    artistName: "Ale Zacha",
    trackName: "olfato tacto y todo lo que no se puede",
    codeUrl: "codeScripts/Ale_Zacha_-_Olfato_Tacto.html",
    hydraFunction: hydraB,
  },
  {
    url: "audio/Ale_Zacha_-_todo_lo_que_si_se_puede.mp3",
    artistName: "Ale Zacha",
    trackName: "todo lo que si se puede",
    hydraFunction: hydraAngelJara12,
  },
  {
    url: "audio/Angel_Jara_-_Gesto_Tecnico_en_lo_Cotidiano.mp3",
    artistName: "Ángel Jara",
    trackName: "Gesto Técnico en lo Cotidiano",
    codeUrl: "codeScripts/Angel_Jara_-_Gesto_Tecnico.html",
    hydraFunction: hydraAngelJara13,
  },
  {
    url: "audio/Angel_Jara_-_Objeto_Tecnico_0001.mp3",
    artistName: "Ángel Jara",
    trackName: "Objecto Técnico 0001",
    codeUrl: "codeScripts/Angel_Jara_-_Objeto_Tecnico.html",
    hydraFunction: hydraAngelJara04,
  },
  {
    url: "audio/Angel_Jara_-_ruidismoRetroFuturista02.mp3",
    artistName: "Ángel Jara",
    trackName: "ruidismoRetroFuturista02",
    codeUrl: "codeScripts/Angel_Jara_-_Ruidismo_RetroFuturista_02.html",
    hydraFunction: hydraAngelJara16,
  },
  {
    url: "audio/cataHache_-_tink.mp3",
    artistName: "cataHache",
    trackName: "tink",
    codeUrl: "codeScripts/cataHache_-_tink.html",
    hydraFunction: hydraAngelJara15,
  },
  {
    url: "audio/Gabriela_Baldoni_-_Kaos.mp3",
    artistName: "Gabriela Baldoni",
    trackName: "Kaos",
    codeUrl: "codeScripts/Gabriela_Baldoni_-_Kaos.html",
    hydraFunction: hydraAngelJara06,
  },
  {
    url: "audio/Gabriela_Baldoni_-_Primer_intento.mp3",
    artistName: "Gabriela Baldoni",
    trackName: "Primer Intento",
    codeUrl: "codeScripts/Gabriela_Baldoni_-_Primer_intento.html",
    hydraFunction: hydraAngelJara07,
  },
  {
    url: "audio/Ignacio_Franco_-_Dientes.mp3",
    artistName: "Ignacio Franco",
    trackName: "Dientes",
    codeUrl: "codeScripts/Ignacio_Franco_-_Dientes.html",
    hydraFunction: hydraAngelJara08,
  },
  {
    url: "audio/Karen_Chalco_-_7il42.mp3",
    artistName: "Karen Chalco",
    trackName: "7il42",
    hydraFunction: hydraAngelJara09,
  },
  {
    url: "audio/Malien_-_algx.mp3",
    artistName: "Malien",
    trackName: "algx",
    codeUrl: "codeScripts/Malien_-_algx.html",
    hydraFunction: hydraAngelJara10,
  },
  {
    url: "audio/Malien_-_crouwu.mp3",
    artistName: "Malien",
    trackName: "crouwu",
    codeUrl: "codeScripts/Malien_-_crouwu.html",
    hydraFunction: hydraAngelJara11,
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
  const icon = document.getElementById("playIcon");
  icon.classList.add("fa-stop-circle");
  icon.classList.remove("fa-play-circle");

  // Show next/prev buttons now
  document.getElementById("prev").classList.remove("hidden");
  document.getElementById("next").classList.remove("hidden");
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

  // Update artist name
  const artistNameEl = document.getElementById("artistName");
  artistNameEl.innerText = track.artistName;

  // Update track name and href
  const trackNameEl = document.getElementById("trackName");
  trackNameEl.innerText = track.trackName;
  trackNameEl.setAttribute("href", track.codeUrl || "#");
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
  // Set canvas size to full screen
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;

  // Create a new hydra-synth instance with audio disabled
  hydra = new window.Hydra({
    canvas: document.getElementById("canvas"),
    detectAudio: false
  });

  // Shuffle playlist!
  playlist = shuffle(playlist);

  // Make container visible
  const container = document.getElementById("interactionContainer");
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

// Cuando se cargue la página, ejecuta la función `init`
window.addEventListener("load", init, false);
