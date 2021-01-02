class Arcosphere {
  constructor(obj) {
    this.l = obj.l || 0;
    this.x = obj.x || 0;
    this.e = obj.e || 0;
    this.p = obj.p || 0;
    this.z = obj.z || 0;
    this.t = obj.t || 0;
    this.g = obj.g || 0;
    this.o = obj.o || 0;
  }

  sum() {
    return Object.values(this).reduce((a, b) => a + b)
  }

  min() {
    return Math.min(...Object.values(this))
  }

  max() {
    return Math.max(...Object.values(this))
  }

  sumLXEP() {
    return this.l + this.x + this.e + this.p
  }

  sumZTGO() {
    return this.z + this.t + this.g + this.o
  }

  minLXEP() {
    return Math.min(this.l, this.x, this.e, this.p)
  }

  minZTGO() {
    return Math.min(this.z, this.t, this.g, this.o)
  }

  maxLXEP() {
    return Math.max(this.l, this.x, this.e, this.p)
  }

  maxZTGO() {
    return Math.max(this.z, this.t, this.g, this.o)
  }

  sumTypes() {
    return Object.keys(this).length
  }
  
  validate(...args) {
    for(const prop of args) {
      if (this[prop] <= 0) {
        throw new Error(prop + " is " + this[prop])
      }
    }
  }

  convert(...inputs) {
    this.validate(...inputs)

    return {
      to: ((...outputs) => {
        console.log(`converting ${inputs} to ${outputs}`)
        for (const input of inputs) {
          this[input]--
        }
        for(const output of outputs) {
          this[output]++
        }
      }).bind(this)
    }
  }
  LOtoXT() {
    this.convert("l", "o").to("x", "t")
  }

  XGtoZL() {
    this.convert("x", "g").to("z", "l")
  }

  XZtoTP() {
    this.convert("x", "z").to("t", "p")
  }

  LTtoEZ() {
    this.convert("l", "t").to("e", "z")
  }

  TEtoPO() {
    this.convert("t", "e").to("p", "o")
  }

  ZPtoGE() {
    this.convert("z", "p").to("g", "e")
  }

  PGtoOX() {
    this.convert("p", "g").to("o", "x")
  }

  EOtoLG() {
    this.convert("e", "o").to("l", "g")
  }

  ZTGOtoLXEP() {
    this.convert("z", "t", "g", "o")
    .to("l", "x", "e", "p")
  }

  LXEPtoZTGO() {
    this.convert("l", "x", "e", "p")
    .to("z", "t", "g", "o")
  }
}

module.exports.Arcosphere = Arcosphere