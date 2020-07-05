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
  a.show()
  a.setBins(8)
  a.hide()

  shape(60)
    .modulate(noise(() => a.fft[0] * 10 + 5, 2).rotate(Math.PI / 2))
    .scrollX(0.5)
    .mult(solid(() => (((Math.sin(time) + 1) / 2) * 1 + 0.01), () => (((Math.sin(time) + 1) / 2) * 1 + 0.01), 1))
    //.scale(()=> a.fft[0]*3+1)
    //.scrollY(()=> a.fft[5]*0.1+0)
    .add(shape(60)
      .mult(solid(1, 0, 1))
      .modulate(noise(20))
      .scrollX(() => a.fft[1] * 4 + 1)
      .scrollY(() => a.fft[0] * 0.5 + 0.00001)
      .scale(0.25)
      .repeat([1, 2, 1, 4].smooth().fast(6), 1)
      .blend(
        shape(2)
          .scale(0.05)
          .scrollY(0.03)
          .modulate(src(o0)
            .scale(0.4).scrollY(() => a.ff[2] * 0.04 + 0.015))
      )
    )
    .blend(shape(4)
      //.scale(()=>a.fft[3]*1.5+0.5)
      .mult(osc().thresh())
      .mult(solid(() => (((Math.sin(time) + 1) / 2) * 1 + 0.01), () => (((Math.sin(time) + 1) / 2) * 1 + 0.01), 1))
      .modulate(osc().rotate(45).modulate(osc(50, 0.03).rotate(Math.PI / 2).thresh()).colorama((() => a.fft[3] * 1 + 0.1)))
      .rotate(0.45)
      .scrollX(0.6)
      //.rotate(()=>(((Math.sin(time)+1)/2)*0.05+0.001),0.5)
    )
    .kaleid(2)
    .out()
}

function hydraB() {
  noise().out();
}