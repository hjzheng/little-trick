const http = require("http");

const requestListener = function (req, res) {
  res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
  
  let prefixMessage = '登录异常'
  let loginRedirectURL = "http://www.baidu.com"
  
  res.end(`
      <style>
      .loading:after {
        overflow: hidden;
        display: inline-block;
        vertical-align: bottom;
        -webkit-animation: ellipsis steps(4, end) 900ms infinite;
        animation: ellipsis steps(4, end) 900ms infinite;
        content: "...";
        /* ascii code for the ellipsis character */
        width: 0px;
      }
      
      @keyframes ellipsis {
        to {
          width: 40px;
        }
      }
      
      @-webkit-keyframes ellipsis {
        to {
          width: 40px;
        }
      }
      </style>
      <div style="display:none;">
      ${prefixMessage}，请<a id="btn" href="${loginRedirectURL}">重新登录</a>
      </div>
      <div 
      class="loading"
      style="
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
      ">
        登录异常，自动跳转中
      </div>
      <script>
        setTimeout(() => {
          // document.getElementById('btn').click()
        }, 0)
      </script>
  `)
};

const server = http.createServer(requestListener);

server.listen(9999, '127.0.0.1', () => {
});

