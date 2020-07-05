function hydraIrisS() {
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

function hydraA() {
  osc(10).out();
}

function hydraB() {
  noise().out();
}