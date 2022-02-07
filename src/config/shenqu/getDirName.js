const fs = require('fs')
const path=require('path')
var readDir = fs.readdirSync(path.resolve(__dirname, "../../assets/shenqu/male-mage"));
let realJson = []
readDir.forEach((item, idx) => {
    if (item !=='.DS_Store') {
        realJson.push({id:idx,name:item})  
    }

})
fs.writeFileSync(path.resolve(__dirname,'./male-mage.json'),JSON.stringify(realJson))