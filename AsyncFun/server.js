const http = require("http");

const requestListener = function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
  res.end('{"result":"\\\\.dat$","model":"\\\\.(jou|cas)$","log":"\\\\.(sta|dat|msg|out|log)$","middle":"\\\\.(com|prt)$"}'
  )
};

const server = http.createServer(requestListener);

server.listen(9527, '127.0.0.1', () => {
  console.log('http://127.0.0.1:9527')
});

