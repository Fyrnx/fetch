let urlExist = require('./urlExist.js');
let http = require('http');
let https = require('https');
let url = require('url');

let server = http.createServer(async (req,res) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    var url_parts = url.parse(req.url, true);
    var {url: urlQuery,options: optionsQuery,search_query: searchQuerys,fetchOptions} = url_parts.query;
    if(!urlQuery) {res.end("url not found"); return}

    let uri = url.parse(urlQuery)
    let protocol = uri.protocol === 'https:' ? https : http;
    
    if(optionsQuery) optionsQuery = JsonPs(optionsQuery)
    else optionsQuery = {}

    let {passChecking} = JsonPs(fetchOptions)
    console.log(fetchOptions,passChecking);
    if(!passChecking && !(await urlExist(urlQuery))) { res.end("url don't exist"); return }

    let options = {...optionsQuery,...{
        hostname: uri.hostname,
        port: uri.port,
        path: `${uri.pathname}${uri.search}`,
        protocol: uri.protocol,
    }} 

    searchQuerys = JsonPs(searchQuerys)
    if(searchQuerys) searchQuerys = Object.entries(searchQuerys).map((entry) => { 
        let [key,value] = entry
        if(!key || !value) return
        return `${encodeURI(key)}=${encodeURI(value)}`
    })?.join("&")

    options.path = options.path.replace(/null/ig,"")
    options.path += `${options.path.search(/\?/) == -1 ? "?" : "&"}${searchQuerys != undefined ? searchQuerys : ""}`

    try {
        protocol.get(options,reso => {
            Object.entries(reso.headers).forEach(header => res.setHeader(...header));
            reso.pipe(res)
        }).on("error",_ => { 
            res.end("error")
        })
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