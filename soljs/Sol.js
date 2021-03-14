const http = require("http");
const render = require("./templateEngine");
const fs = require("fs");
const mongoose = require('mongoose');
const urlPraser = require('url')
class Sol {
  constructor() {
    this.requests = [];
    this.middlewares = []
    process.on("uncaughtException", (err) => {
      throw err;
    });
    process.on("unhandledRejection", (err) => {
      throw err;
    });
    this.server = http.createServer((request, response) => {
      try {
        let file = fs.readFileSync(
          __dirname + request.url.replace(/\//g, "\\")
        );
        response.end(file);
      } catch (error) {
        response.setHeader("Access-Control-Allow-Headers", "*");
        const res = {
          send: (data) => {
            if (typeof data == "object") {
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify(data));
              return;
            }
            response.write(data);
            response.end();
          },
          header: (key, value) => {
            response.setHeader(key, value);
            return res;
          },
          status: (code) => {
            response.statusCode = code;
            return res;
          },
          render: (path, data) => {
            let code = render(path, data);
            response.setHeader("Content-Type", "text/html");
            response.end(code);
          },
          redirect: (path) => {
            response.setHeader("Location", path);
            response.statusCode = 302;
            response.end();
          },
        };
        const req = { ...request };
        const parsedUrl = urlPraser.parse(request.url, true);
        req.query = parsedUrl.query;
        const body = [];
        request.on("data", (chunk) => {
          body.push(chunk);
        });
        request.on("end", () => {
          try {
            let parsedData = Buffer.concat(body).toString();
            parsedData = JSON.parse(parsedData);
            req.body = parsedData;
          } catch (error) {
            let parsedData = Buffer.concat(body).toString();
            parsedData = parsedData.split("&");
            const reqData = {};
            parsedData.map((i) => {
              reqData[i.split("=")[0]] = i.split("=")[1];
            });
            req.body = reqData;
          }

          const { url, method } = request;
          const middlewares = this.middlewares.filter(i=> i.path == url);
          const route = this.requests.find((i) => {
            if ((parsedUrl.pathname == i.url || parsedUrl.pathname == i.url + "/") && i.method == method) return true;
            return false;
          });
         
          for (let i = 0; i <= middlewares.length; i++) {
            try {
              if(!middlewares[i]){
                if (route) return route.handler(req, res);
                response.write("not found");
                response.statusCode = 404
                response.end();
                return;
              }
              let next = middlewares[i].handler(req, res) ;
              if(!next) break;
            } catch (error) {
              console.log(error);
              response.statusCode = 500;
              response.end("An error occured from server");
            }
            
          }
        });
      }
    });
  }
  listen(port, cb) {
    this.server.listen(port, cb);
  }
  get(url,middlewares, cb) {
    if(!Array.isArray(middlewares)) cb = middlewares
    if(Array.isArray(middlewares)){
      middlewares.map(m=>{
        this.use(url , m)
      })
    }
    if (typeof cb != "function") {
      throw new Error("A route handler must be a function");
    }
    this.requests.push({ method: "GET", url, handler: cb });
  }
  post(url,middlewares, cb) {
    if(!Array.isArray(middlewares)) cb = middlewares
    if(Array.isArray(middlewares)){
      middlewares.map(m=>{
        this.use(url , m)
      })
    }
    if (typeof cb != "function") {
      throw new Error("A route handler must be a function");
    }
    this.requests.push({ method: "POST", url, handler: cb });
  }
  put(url,middlewares, cb) {
    if(!Array.isArray(middlewares)) cb = middlewares
    if(Array.isArray(middlewares)){
      middlewares.map(m=>{
        this.use(url , m)
      })
    }
    if (typeof cb != "function") {
      throw new Error("A route handler must be a function");
    }
    this.requests.push({ method: "PUT", url, handler: cb });
  }
  del(url,middlewares, cb) {
    if(!Array.isArray(middlewares)) cb = middlewares
    if(Array.isArray(middlewares)){
      middlewares.map(m=>{
        this.use(url , m)
      })
    }
    if (typeof cb != "function") {
      throw new Error("A route handler must be a function");
    }
    this.requests.push({ method: "DELETE", url, handler: cb });
  }
  setView(path) {
    global.viewPath = path;
  }
  use(path, handler){
    this.middlewares.push({path, handler})
  }
  connectMongoDb(port, collection){
    mongoose.connect(`mongodb://localhost:${port}/${collection}`, { useNewUrlParser: true,useUnifiedTopology: true })
    .then(_=> console.log('DB Connected !'))
    .catch((err)=> {throw err})
  }
}

module.exports = Sol;
