function resizeCanvas() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function run() {
  osc([60, 30, 15, 7.5].fast(5))
    .color(1, 0, 0)
    .mult(
      osc()
        .rotate(Math.PI / 2)
        .thresh()
        .mult(noise([40, 20, 10, 5, 2.5].fast(5)))
        .shift(0.001, 0.004, 0, 0.5)
    )
    .modulate(noise(() => a.fft[1] * 10 + 0.01))
    .mask(
      shape(40)
        .scale(() => a.fft[1] * 3.5 + 0.1)
        .modulateScale(shape(3).scale([1, 2].fast(5)))
        .modulate(noise(() => ((Math.sin(time * 2) + 1) / 2) * 200 + 20))
    )
    .out();

  // Display FFT histogram
  a.show();
}

function init() {
  window.addEventListener("resize", resizeCanvas, false);

  // Draw canvas border for the first time.
  resizeCanvas();

  // Create a new hydra-synth instance
  var hydra = new window.Hydra({
    canvas: document.getElementById("canvas"),
    detectAudio: false
  });

  // Start playing audio tag, and get context and source for CustomAudio
  window.context = new AudioContext();
  var el = document.getElementById("audio");
  var source = context.createMediaElementSource(el);
  source.connect(context.destination);
  //el.play();

  // Initialize custom audio
  hydra.synth.a = new CustomAudio({
    context: context,
    source: source
  });
  window.a = hydra.synth.a; // set global variable for audio
  hydra.detectAudio = true; // now force hydra to tick audio too

  // Run Hydra sketch
  run();
}

window.addEventListener("load", init, false);
