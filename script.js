function resizeCanvas() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


}

function run() {
  a.show()
  a.setBins(8)
  a.hide()
  osc([60, 30, 15, 7.5].fast(5))
  .color(1,0,0)
  .mult(osc()
          .rotate(Math.PI/2)
          .thresh()
          .mult(noise([40, 20, 10, 5, 2.5]
                      .fast(5)))
          .shift(0.001,(()=> a.fft[0]*0.04+ 0)
          , 0,0.5))
  .modulate(
    noise(()=>a.fft[2]*10 +0.01)
  )
  .mask(
  shape(40)
    .scale(()=>a.fft[3]*7.5 +0.1)
    .modulateScale(shape(3)
                  .scale([1,2].fast(5)))
    .modulate(noise(()=> (((Math.sin(time/5)+1)/2)*20 + 5))
                          .mult(src(o0)
                          , ()=>a.fft[6]*1 +0.001))
  )
  .add(
  shape(4)
    .scale([4,0])
    .mult(
      solid(1,[0,1].fast(5),1)
      )
  ,()=>a.fft[1]*1 +0.001
  )
  .scrollX(0.47)
    .kaleid(2).rotate(Math.PI/2)
  .out()
}

function play() {
  console.log("> play");

  // Get context and source for CustomAudio
  window.context = new AudioContext();
  var el = document.getElementById("audio");
  var source = context.createMediaElementSource(el);
  source.connect(context.destination);
  el.play();

  // Initialize custom audio
  window.hydra.synth.a = new CustomAudio({
    context: context,
    source: source
  });
  window.a = window.hydra.synth.a; // set global variable for audio
  window.hydra.detectAudio = true; // now force hydra to tick audio too

  // Run Hydra sketch
  run();
}

function init() {
  window.addEventListener("resize", resizeCanvas, false);

  // Draw canvas border for the first time.
  resizeCanvas();

  // Create a new hydra-synth instance
  window.hydra = new window.Hydra({
    canvas: document.getElementById("canvas"),
    detectAudio: false
  });
}

function shuffle(array){
    var i, j, x;
    for (i = array.length - 1; i > 0; i--){
      j = Math.floor(Math.random() * (i+1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
}

window.addEventListener("load", init, false);