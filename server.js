var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

const session ={} //创建空 session 

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/
  

  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)
  console.log('方方说：不含查询字符串的路径\n' + path)
  if (path === '/') {
      response.setHeader('Content-Type', 'text/html;charset=utf-8')
      let cookie = request.headers['cookie']
      let login = false
      if(cookie){
          let sessionId = cookie.split('=')[1]
    console.log(sessionId)
    console.log(cookie)
    console.log('session')
    console.log(session)

         if (session[sessionId] && session[sessionId].login === true){
             login = true  
             console.log(session[ sessionId])
    console.log('session[ sessionId]')
    console.log('session[ sessionId].login')
    console.log(session[ sessionId].login)
         }
      }
      let html = `
      <!DOCTYPE>
      <html>
      <head>
      <link rel="stylesheet" href="/style ">
      </head>
      <body>
      <h1>_ _hi_ _</h1>
      <form action="/login" method="get">
          <input type="password" name = "password"> 
          <input type="submit" >
      </form>
      <script src="/script"></script>
      </bady>
      </html>
      `
       
      if(login){
        html =html.replace('_ _hi_ _','你好 登录用户')
        }else{
        html =html.replace('_ _hi_ _','你好')
      }
      response.write(html)
      response.end() //写完了
  } else if (path === '/style') {
      let ifNoneMatch = request.headers['if-none-match']
      if(ifNoneMatch === 'wei'){
          response.statusCode = 304
          response.end()
      }else{
           response.setHeader('Content-Type', 'text/css;charset=utf-8')
      response.setHeader('Etag','wei')
      response.write(`
        h1{color:red;}
    `)
      response.end()
      }
     
  } else if (path === '/script') {
      response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
      response.setHeader('Cache-Control','max-age=10')
      response.write(`
        console.log('我是js')
    `)
      response.end()
  } else if(path === '/login'){
    response.setHeader('Content-Type', 'text/plain;charset=utf-8')
      if(query.password === 'weiwei'){
          let random = Math.random()
           response.setHeader( 'set-Cookie', `sessionid=${random}`)  
           session[random] = {login : true}
           response.end()
      }else{
        response.end('密码错了')
      }
  }else if(path === '/logout'){
        let d =new Date(0)
           response.setHeader( 'set-Cookie', `login = true,  Expires=${d.toGMTString()}` )  
           response.end()
      
  } else {
      response.setHeader('Content-Type', 'text/plain;charset=utf-8')
      response.end('你请求的资源不存在')
  }
//   if(path === '/'){
//     response.statusCode = 200
//     response.setHeader('Content-Type', 'text/html;charset=utf-8')
//     response.write('哈哈哈')
//     response.end()
//   }else{
//     response.statusCode = 404
//     response.setHeader('Content-Type', 'text/html;charset=utf-8')
//     response.write('呜呜呜')
//     response.end()
//   }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)