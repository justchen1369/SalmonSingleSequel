const { Arcosphere } = require('./arcosphere.js');

const arc = new Arcosphere({
  l: 15,
  x: 3,
  z: 16,
  t: 1,
  e: 23,
  p: 1,
  g: 1,
  o: 2
});
const arcospheres = arc.sum();
const types = arc.sumTypes();
const average = arcospheres / types;
const minPerType = Math.max(arcospheres / 16, 2)
console.log('\n\n============================================================');
console.log(`average number per type: ${average}`);
console.log(`target min per type: ${minPerType}`)
console.log(arc);
console.log('==============================');
console.warn(0)

let cycleCounter = 0
for (let i = 0; i < 100000; i++) {
  const minval = arc.min();
  cycleCounter++
  const setDelta = arc.sumLXEP() - arc.sumZTGO()
  if (setDelta > 4 && Math.min(arc.l, arc.x, arc.e, arc.p) > 1) {
    arc.LXEPtoZTGO()
  } else if (setDelta < -4 && Math.min(arc.z, arc.t, arc.g, arc.o) > 1) {
    arc.ZTGOtoLXEP()
  } else if (Math.min(arc.l, arc.x, arc.z) < 2) {
    if (arc.l === minval) {
      if (Math.min(arc.e, arc.o) > Math.min(arc.x, arc.g)) {
        arc.EOtoLG();
      } else {
        arc.XGtoZL();
      }
    } else if (arc.x === minval) {
      if (Math.min(arc.l, arc.o) > Math.min(arc.p, arc.g)) {
        arc.LOtoXT();
      } else {
        arc.PGtoOX();
      }
    } else if (arc.z === minval) {
      if (Math.min(arc.x, arc.g) > Math.min(arc.l, arc.t)) {
        arc.XGtoZL();
      } else {
        arc.LTtoEZ();
      }
    } else if (arc.t === minval) {
      if (Math.min(arc.l, arc.o) > Math.min(arc.x, arc.z)) {
        arc.LOtoXT();
      } else {
        arc.XZtoTP();
      }
    } else if (arc.e === minval) {
      if (Math.min(arc.l, arc.t) > Math.min(arc.z, arc.p)) {
        arc.LTtoEZ();
      } else {
        arc.ZPtoGE();
      }
    } else if (arc.p === minval) {
      if (Math.min(arc.t, arc.e) > Math.min(arc.x, arc.z)) {
        arc.TEtoPO();
      } else {
        arc.XZtoTP();
      }
    } else if (arc.g === minval) {
      if (Math.min(arc.z, arc.p) > Math.min(arc.e, arc.o)) {
        arc.ZPtoGE();
      } else {
        arc.EOtoLG();
      }
    } else if (arc.o === minval) {
      if (Math.min(arc.t, arc.e) > Math.min(arc.p, arc.g)) {
        arc.TEtoPO();
      } else {
        arc.PGtoOX();
      }
    }
  } else {
    if (cycleCounter > 1) {
      console.log(`stable after ${cycleCounter-1} conversions`)
      console.log(arc)
    }
    cycleCounter = 0
  }

  if (i % 16 === 15) {
    console.log('==============================');
    console.log(i)
    if (cycleCounter > 0) {
      console.warn("DID NOT STABILIZE(EVERBODY PANIC BOLINA IS FULL ON STONE)")
      console.log(arc)
      //break
    }
    // make as many tesseracts as possible
    while(Math.min(arc.l, arc.x, arc.z) >= 2) {
      if (Math.random() > 0.5) {
        console.log(`making tesseract A`)
        arc.l--
        arc.x--
        arc.z--
        arc.p++
        arc.g++
        arc.o++
      } else {
        console.log(`making tesseract B`)
        arc.l--
        arc.x--
        arc.z--
        arc.p++
        arc.e++
        arc.t++
      }
    }
    console.log(arc)  
  } 
  
  //console.log('==============================');
}

console.log(arc);