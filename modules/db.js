
const fs = require('fs');

function load(){
  return JSON.parse(fs.readFileSync('./database/data.json'));
}

function save(d){
  fs.writeFileSync('./database/data.json', JSON.stringify(d,null,2));
}

module.exports={load,save};
