// This script must be run with elevated privileges (sudo)
require('colors')
const fs = require('fs')
const robot = require('robotjs')

// Run `ls /dev` to figure out which ACM it is
var stream = fs.createReadStream("/dev/ttyACM0")

var lastNum = null
var threshold = 2000

stream.on("open", () => {
  console.log("Connected".green)
})

stream.on("data", e => {
  if(e.length !== 1 && e[0] !== 0x0A) {
    var num = parseInt(e.toString().trim())

    if(Math.abs(lastNum - num) >= threshold && lastNum !== null) {
      console.log(`jump! ${lastNum} to ${num} (Δ: ${Math.abs(lastNum - num)})`.yellow)
      robot.keyTap("k")
    } else if(Math.abs(lastNum - num) !== 0) {
      console.log(`${lastNum} to ${num} (Δ: ${Math.abs(lastNum - num)})`)
    }

    lastNum = num
  }
})

stream.on("end", () => {
  console.log("Disconnected".red)
  process.exit(0)
})