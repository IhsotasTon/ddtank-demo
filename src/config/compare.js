const maleClothOldJson = require('./female_head_old.json') 
const maleClothJson =require('./female_head.json') 


for (let index = 0; index < maleClothOldJson.length; index++) {
    let has = false;
    let old=maleClothOldJson[index]
    for (let index = 0; index < maleClothJson.length; index++) {
        const newItem = maleClothJson[index];
        if (old.id === newItem.id) {
            has=true
        }
    }
    if (!has) {
        console.log(old.id,old.name)
    }
}