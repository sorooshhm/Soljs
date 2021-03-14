const fs = require("fs");
const HTMLParser = require('node-html-parser');
let root;
const colors = {
  blue : '#0d6efd!important',
  green : '#198754!important',
  red : '#dc3545!important',
  gray : '#6c757d!important',
  yellow : '#ffc107!important',
  light : '#f8f9fa!important'
}
function render(path, data = {}) {
  try {
    let code = fs.readFileSync((global.viewPath || "") + path, "utf-8");
    root = HTMLParser.parse(code);
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const regexp = new RegExp(`#${key}#`, "g");
        code = code.replace(regexp, data[key]);
      }
    }
    if(root.querySelector("store")){

      let states = root.querySelector("store").textContent;
      code = code.replace("<store>"+states+"</store>", "")
      states = JSON.parse(states);
      for (const key in states) {
        if (Object.hasOwnProperty.call(states, key)) {
          const regexp = new RegExp(`${key}`, "g");
          code = code.replace(regexp, states[key]);
        }
      }  
    }

    while (code.includes("{%")) {
      let start = code.indexOf("{%");
      let end = code.indexOf("%}", start);
      let jsCode = code.slice(start + 2, end);
      code = code.replace("{%" + jsCode + "%}", eval(jsCode) || "");
    }
    Object.keys(colors).map(c=>{
      while(code.includes(`<${c}>`)){
        code = code.replace(`<${c}>`, `<span style=" color : ${colors[c]}">`); 
        code = code.replace(`</${c}>`, `</span>`); 
      }
    })
    return code;
  } catch (error) {
    throw error;
  }
}

module.exports = render;
