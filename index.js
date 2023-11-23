let urlExist = require('./urlExist.js');
let http = require('http');
let https = require('https');
let url = require('url');

let server = http.createServer(async (req,res) => {
    console.clear()
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    console.log(1)
    var url_parts = url.parse(req.url, true);
    console.log(2)
    var {url: urlQuery,options: optionsQuery,search_query: searchQuerys,fetchOptions} = url_parts.query;
    console.log(3)
    if(!urlQuery) {res.end("url not found"); return}
    console.log(4)
    
    let uri = url.parse(urlQuery)
    console.log(5)
    let protocol = uri.protocol === 'https:' ? https : http;
    console.log(6)
    
    if(optionsQuery) optionsQuery = JsonPs(optionsQuery)
    else optionsQuery = {}
    console.log(7)
    
    let {passChecking} = JsonPs(fetchOptions)
    console.log(8)
    if(!passChecking && !(await urlExist(urlQuery))) { res.end("url don't exist"); return }
    console.log(9)
    
    let options = {...optionsQuery,...{
        hostname: uri.hostname,
        port: uri.port,
        path: `${uri.pathname}${uri.search}`,
        protocol: uri.protocol,
    }} 
    console.log(10)
    
    searchQuerys = JsonPs(searchQuerys)
    console.log(11)
    if(searchQuerys) searchQuerys = Object.entries(searchQuerys).map((entry) => { 
        let [key,value] = entry
        if(!key || !value) return
        return `${encodeURI(key)}=${encodeURI(value)}`
    })?.join("&")
    console.log(12)
    
    options.path = options.path.replace(/null/ig,"")
    console.log(13)
    options.path += `${options.path.search(/\?/) == -1 ? "?" : "&"}${searchQuerys != undefined ? searchQuerys : ""}`
    console.log(14)
    
    try {
        console.log(14.1)
        protocol.get(options,reso => {
            console.log(14.21)
            Object.entries(reso.headers).forEach(header => res.setHeader(...header));
            console.log(14.22)
            reso.pipe(res)
            console.log(14.23)
        })
        console.log(14.2)
    } catch(_err) {}
    console.log(15)
    
})

function JsonPs(string) {
    try {
        return JSON.parse(string).catch(_ => Object())
    } catch(_err) {}
}

server.listen(process.env.PORT ?? 2400,undefined, _ => { 
    console.log(`it runed ${process.env.PORT ?? 2400}`);
})