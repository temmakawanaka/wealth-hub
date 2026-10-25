import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const dir=dirname(fileURLToPath(import.meta.url));
const allowed={"/":"index.html","/index.html":"index.html","/app.mjs":"app.mjs","/finance.mjs":"finance.mjs","/styles.css":"styles.css"};
const mime={".html":"text/html; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8"};
const port=Number(process.env.PORT||4173);
const host="127.0.0.1";
const server=createServer(async(req,res)=>{
  const path=(req.url||"").split("?")[0];
  if(req.method!=="GET"||!Object.hasOwn(allowed,path)){res.writeHead(404);res.end("Not found");return;}
  try{
    const filename=allowed[path];
    const body=await readFile(join(dir,filename));
    res.writeHead(200,{"Content-Type":mime[filename.slice(filename.lastIndexOf("."))],"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'","X-Frame-Options":"DENY"});
    res.end(body);
  }catch{res.writeHead(500);res.end("Internal server error");}
});
server.listen(port,host,()=>console.log(`Demo: http://${host}:${port}`));
