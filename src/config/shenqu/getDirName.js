const fs = require('fs')
const path=require('path')
var readDir = fs.readdirSync(path.resolve(__dirname,"../../assets/shenqu/male-warrior"));
fs.writeFileSync(path.resolve(__dirname,'./male-warrior.json'),JSON.stringify(readDir))