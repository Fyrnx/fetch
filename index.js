// import urlExist from 'url-exist';
// import axios from 'axios';
// import http from 'http';
// import https from 'https';
// import url from 'url';

let urlExist = require('./urlExist.js');
let http = require('http');
let https = require('https');
let url = require('url');

const CloudflareBypasser = require('cloudflare-bypasser');

let cf = new CloudflareBypasser();

let cookie = {
    cf_clearance: "ZREGCRxKlgZPiAJUuALC50KgPUu2x.PcdUd5Fwz9MNY-1699383438-0-1-811465e3.228c68ac.a0d2d8d-0.2.1699383438",
    _ga: "GA1.1.1614877768.1698154563",
    _ga_BZ17G5849Q: "_ga_BZ17G5849Q"
}


let server = http.createServer(async (req,res) => {

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    var url_parts = url.parse(req.url, true);
    var {url: urlQuery,options: optionsQuery} = url_parts.query;

    if(!urlQuery) {res.end("url not found"); return}

    let uri = url.parse(urlQuery)
    let protocol = uri.protocol === 'https:' ? https : http;
    
    if(optionsQuery) optionsQuery = JsonPs(optionsQuery)
    else optionsQuery = {}

    if(!(await urlExist(urlQuery))) { res.end("url don't exist"); return }

    let options = {...optionsQuery,...{
        hostname: uri.hostname,
        port: uri.port,
        path: `${uri.pathname}${uri.search}`,
        protocol: uri.protocol,
        header: { 
            'Cookie': cookie
        }
    }}
    // let options = {...optionsQuery,...{
    //     url: uri.href
    // }}

    try {
        protocol.get(options,reso => {
            console.log(res);
            reso.pipe(res)
        })
        // cf.request(options).then(reso => {
        //     res.end(reso.body)
            
        // });
    } catch(_err) {}

})

function JsonPs(string) {
    try {
        return JSON.parse(string)
    } catch(_err) {}
}

server.listen(process.env.PORT ?? 2400,undefined, _ => { 
    console.log(`it runed ${process.env.PORT ?? 2400}`);
})

/*
    let options = {...optionsQuery,...{
        hostname: uri.hostname,
        port: uri.port,
        path: `${uri.pathname}${uri.search}`,
        protocol: uri.protocol,
    }}

    try {
        protocol.get(urlQuery,reso => { 
            reso.pipe(res)
        })
    } catch(err) {}
*/