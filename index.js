import urlExist from 'url-exist';
import axios from 'axios';
import http from 'http';
import https from 'https';
import url from 'url';

let server = http.createServer(async (req,res) => {

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    var url_parts = url.parse(req.url, true);
    var {url: urlQuery,options: optionsQuery} = url_parts.query;

    if(!urlQuery) {res.end("url not found"); return}

    let uri = url.parse(urlQuery)
    let protocol = uri.protocol === 'https:' ? https : http;
    
    if(optionsQuery) optionsQuery = JSON.parse(optionsQuery)
    else optionsQuery = {}

    if(!(await urlExist(urlQuery))) { res.end("url don't exist");return }

    res.end(axios.get(urlQuery,optionsQuery))
    // let options = {...optionsQuery,...{
    //     hostname: uri.hostname,
    //     port: uri.port,
    //     path: `${uri.pathname}${uri.search}`,
    //     protocol: uri.protocol,
    // }}

    // try {
    //     protocol.get(urlQuery,reso => { 
    //         reso.pipe(res)
    //     })
    // } catch(err) {}
})



server.listen(process.env.PORT ?? 2600,undefined, _ => { 
    console.log(`it runed ${process.env.PORT ?? 2600}`);
})