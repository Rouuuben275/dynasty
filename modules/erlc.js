
const fetch=require('node-fetch');
const config=require('../config.json');

async function req(e){
  const r=await fetch(`https://api.policeroleplay.community/v1/${e}`,{
    headers:{"Server-Key":config.erlc.serverKey}
  });
  return r.json();
}

async function sync(client){
  setInterval(async()=>{
    const p=await req('server/players');
    client.user.setActivity(p.length+" citoyens");
  }, config.erlc.refresh*1000);
}

module.exports={sync};
