
const neatCsv =require('neat-csv') ;

const fs = require('fs')
fs.readFile("./config/male.csv", async (err, data) => {
  if (err) {
    return
}
console.log(await neatCsv(data))
})