/**
 * Custom re-implementation of https://github.com/mrdoob/three.js/blob/dev/examples/js/math/Lut.js
 */

;(function () {
  class Lut {
    constructor(colormap, count = 32) {
      this.lut = []
      this.map = []
      this.n = 0
      this.minV = 0
      this.maxV = 1
      this.setColorMap(colormap, count)
    }

    setMin(min) {
      this.minV = min
      return this
    }

    setMax(max) {
      this.maxV = max
      return this
    }

    setColorMap(colormap, count = 32) {
      this.map = ColorMapKeywords[colormap] || ColorMapKeywords.rainbow
      this.n = count
      const step = 1.0 / this.n
      this.lut.length = 0

      for (let i = 0; i <= 1; i += step) {
        for (let j = 0; j < this.map.length - 1; j++) {
          if (i >= this.map[j][0] && i < this.map[j + 1][0]) {
            const min = this.map[j][0]
            const max = this.map[j + 1][0]
            const minColor = new threeToGlbGlobal.THREE.Color(this.map[j][1])
            const maxColor = new threeToGlbGlobal.THREE.Color(
              this.map[j + 1][1]
            )
            const color = minColor.lerp(maxColor, (i - min) / (max - min))
            this.lut.push(color)
          }
        }
      }

      return this
    }

    getColor(alpha) {
      if (alpha <= this.minV) {
        alpha = this.minV
      } else if (alpha >= this.maxV) {
        alpha = this.maxV
      }

      alpha = (alpha - this.minV) / (this.maxV - this.minV)
      let colorPosition = Math.round(alpha * this.n)
      colorPosition == this.n ? (colorPosition -= 1) : colorPosition
      return this.lut[colorPosition]
    }

    addColorMap(name, arrayOfColors) {
      ColorMapKeywords[name] = arrayOfColors
      return this
    }
  }

  Lut.prototype.isLut = true
  const ColorMapKeywords = {
    rainbow: [
      [0.0, 0x0000ff],
      [0.2, 0x00ffff],
      [0.5, 0x00ff00],
      [0.8, 0xffff00],
      [1.0, 0xff0000]
    ],
    cooltowarm: [
      [0.0, 0x3c4ec2],
      [0.2, 0x9bbcff],
      [0.5, 0xdcdcdc],
      [0.8, 0xf6a385],
      [1.0, 0xb40426]
    ],
    blackbody: [
      [0.0, 0x000000],
      [0.2, 0x780000],
      [0.5, 0xe63200],
      [0.8, 0xffff00],
      [1.0, 0xffffff]
    ],
    grayscale: [
      [0.0, 0x000000],
      [0.2, 0x404040],
      [0.5, 0x7f7f80],
      [0.8, 0xbfbfbf],
      [1.0, 0xffffff]
    ]
  }

  threeToGlbGlobal.THREE.ColorMapKeywords = ColorMapKeywords
  threeToGlbGlobal.THREE.Lut = Lut
})()
