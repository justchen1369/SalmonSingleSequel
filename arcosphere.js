const colors = require('colors/safe');

// Recipes:
//   


class Arcosphere {
  constructor(obj) {
    this.state = {}
    Object.assign(this.state, obj);
    ['l', 'x', 'z', 't', 'e', 'p', 'g', 'o'].forEach(letter => {
      this.state[letter] = this.state[letter] || 0
    })

  }
  
  recipes = [
    {l:-1, o:-1, x:1, t:1},
    {x:-1, t:-1, g:1, l:1},
    {x:-1, z:-1, t:1, p:1},
    {l:-1, t:-1, e:1, z:1},
    {t:-1, e:-1, p:1, o:1},
    {z:-1, p:-1, g:1, e:1},
    {p:-1, g:-1, o:1, x:1},
    {e:-1, o:-1, l:1, g:1},
    {l:-1, x:-1, e:-1, p:-1, z:1, t:1, g:1, o:1},
    {z:-1, t:-1, g:-1, o:-1, l:1, x:1, e:1, p:1}
  ]

  // log number of times each recipe is used
  stats = [0,0,0,0,0,0,0,0,0,0]
    
  tesseract = {
    enabled: true,
    recipes: [
      [
        {l:-1, x:-1, z:-1},
        {p:1, g:1, o:1}
      ],
      [
        {l:-1, x:-1, z:-1},
        {p:1, e:1, t:1}
      ]
    ],
    type: -1,
    timeLeft: 0,
    count: 0,
    delays: 0,
    duration: 12 // Tesseract = 120 seconds, each conversion = 10 seconds
  }
  
  simulate() {
    // Make a random tesseract if we can.
    // Start by subtracting ingredients
    // Later calls will decrement the timer
    // When timer expires, we give back the products
    if (this.tesseract.timeLeft > 0) {
      // Decrement the timer, and give products if done
      this.tesseract.timeLeft--
      if (this.tesseract.timeLeft === 0) {
        console.log(colors.green(`Finishing tesseract #${this.tesseract.count+1}`))
        this.applyRecipe(this.tesseract.recipes[this.tesseract.type][1])
        this.tesseract.type = -1
        this.tesseract.count++
      }
    }
    // Start the next tesseract, immediately if possible
    if (this.tesseract.timeLeft === 0 && this.tesseract.enabled === true) {
      // Check if we are able to start a new conversion
      if (this.minLXZ() > 1) {
        if (Math.random() > 0.5) {
          console.log(colors.green(`Started tesseract #${this.tesseract.count+1}`))
          this.applyRecipe(this.tesseract.recipes[0][0])
          this.tesseract.type = 0
        } else {
          console.log(colors.green(`Started tesseract #${this.tesseract.count+1}`))
          this.applyRecipe(this.tesseract.recipes[1][0])
          this.tesseract.type = 1
        }
        this.tesseract.timeLeft = this.tesseract.duration
      } else {
        // Delayed start of tesseract because not enough ingredients
        this.tesseract.delays++
      }
    }
  }

  // Compute the weight of each recipe
  // Computed as the square of deviation from mean, multiplied by production/consumption amount
  // More positive weight means this recipe is a better choice to use excess to fill shortages
  weight(recipe) {
    let w = 0
    //const total = this.sum()
    const mean = this.sum() / this.sumTypes()
    for (const prop in recipe) {
      const produced = recipe[prop]
      const inventory = this.state[prop]
      //const inverted = total - inventory
      const delta = inventory - mean

      //console.log(`${prop}: ${inventory}, ${produced}, ${delta}`)
      if (produced < 0 && inventory == 0) {
        // Error, we can't make this recipe at all! Make sure it doesn't get picked
        return -Infinity
      }
      else if (delta > 0) {
        // If we have too much and recipe consumes it, result in positive weight
        // If we have too much and recipe produces it, negative weight
        w += -1*produced*(delta**2)
      }
      else {
        // If we have too little and recipe produces it, result in positive weight
        // If we have too little and recipe consumes it, negative weight
        w += produced*(delta**2)
      }
      /*else if (produced < 0) {
        // If recipe consumes it, result in positive weight based on how much we have
        w += -1*produced*(inventory**2)
      }
      else {
        // If recipe produces it, result in positive weight based on how close to empty we are
        w += produced*(inverted**2)
      }*/
    }
    return w // / Object.keys(recipe).length
    
  }


  convert(recipeIndex) {
    this.applyRecipe(this.recipes[recipeIndex])
    this.stats[recipeIndex]++
  }

  // Take a list of properties and add it to the current state
  // {x: 1, z:-1, etc}
  applyRecipe(recipe) {
    console.log(recipe)
    for(const prop in recipe) {
      this.state[prop] += recipe[prop]
    }
  }

  range() {
    return this.max() - this.min()
  }

  sum() {
    return Object.values(this.state).reduce((a, b) => a + b)
  }

  min() {
    return Math.min(...Object.values(this.state))
  }

  max() {
    return Math.max(...Object.values(this.state))
  }

  sumLXEP() {
    return this.state.l + this.state.x + this.state.e + this.state.p
  }

  sumZTGO() {
    return this.state.z + this.state.t + this.state.g + this.state.o
  }

  minLXZ() {
    return Math.min(this.state.l, this.state.x, this.state.z)
  }

  minLXEP() {
    return Math.min(this.state.l, this.state.x, this.state.e, this.state.p)
  }

  minZTGO() {
    return Math.min(this.state.z, this.state.t, this.state.g, this.state.o)
  }

  maxLXEP() {
    return Math.max(this.state.l, this.state.x, this.state.e, this.state.p)
  }

  maxZTGO() {
    return Math.max(this.state.z, this.state.t, this.state.g, this.state.o)
  }

  sumTypes() {
    return Object.keys(this.state).length
  }
  /*
  validate(...args) {
    for(const prop of args) {
      if (this.state[prop] <= 0) {
        throw new Error(prop + ' is ' + this.state[prop])
      }
    }
  }

  convert(...inputs) {
    this.validate(...inputs)

    return {
      to: ((...outputs) => {
        console.log(`converting ${inputs} to ${outputs}`)
        for (const input of inputs) {
          this.state[input]--
        }
        for(const output of outputs) {
          this.state[output]++
        }
      }).bind(this)
    }
  }
  LOtoXT() {
    this.convert('l', 'o').to('x', 't')
  }

  XGtoZL() {
    this.convert('x', 'g').to('z', 'l')
  }

  XZtoTP() {
    this.convert('x', 'z').to('t', 'p')
  }

  LTtoEZ() {
    this.convert('l', 't').to('e', 'z')
  }

  TEtoPO() {
    this.convert('t', 'e').to('p', 'o')
  }

  ZPtoGE() {
    this.convert('z', 'p').to('g', 'e')
  }

  PGtoOX() {
    this.convert('p', 'g').to('o', 'x')
  }

  EOtoLG() {
    this.convert('e', 'o').to('l', 'g')
  }

  ZTGOtoLXEP() {
    this.convert('z', 't', 'g', 'o')
    .to('l', 'x', 'e', 'p')
  }

  LXEPtoZTGO() {
    this.convert('l', 'x', 'e', 'p')
    .to('z', 't', 'g', 'o')
  }*/
}

module.exports.Arcosphere = Arcosphere