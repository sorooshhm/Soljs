# Soljs
Hello I'm Soroosh Hamedifar , I made a simple Node js web application framework with a customized template engine

# installation
To install this framework , first you have to make the folder : 

``` 
mkdir sol-js
cd sol-js
```
Then you have to install the framwork . For installation , use this command ; 

```
npm i soljs_sh
```

# Example 
To start using this framework , first you have to make the main file in the folder for example server.js

```javascript
server.js

const SolJS = require("soljs_sh");
const app = new SolJS()

app.get("/", (req, res)=>{
  res.send("Hello World")
})

app.listen(3000, (err)=>{
  if(err) throw err;
  console.log("App is listening to port 3000");
})
```
Now open your browser and search ``` localhost:3000 ``` 

![alt photo](https://s16.picofile.com/file/8427976142/highlight_README_md_at_master_simplabs_highlight_Google_Chrome_3_14_2021_8_41_48_PM.png)

# Docs
You can also send html files to the client

for example you can make a folder named views , the in the server.js file put this code

```javascript
app.setView("./view/")
```

Then make a index.html file in view directory

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sol js</title>
</head>
<body>
  Hello World
</body>
</html>
```

Then put this code in server.js file :

```javascript
app.get("/htmlTest", (req, res)=>{
  res.render("./index.html")
})
```

Also you can send data to the html file :

```html
index.html

<h1>hello #name#</h1>
```
```javascript
server.js

res.render("./index.html", {name : "soroosh"})
```
You can write javascript code in the html file too :

```html
<h1>{% "#name#".length > 3 ? "#name# is valid name" : '#name# is not valid' %}</h1>
```
You can use res.header to set header
  res.status to set a status code 
  res.redirect to redirect to special path
  
This framework has error handler 

To set middleware you have to use this code :

```javascript
app.use("/", (req, res)=>{
  // return true to go to the next middle ware or route handler and return false to stop the process
  return true
})
```

Or you can use middlewares in routes : 
```javascript
app.get("/middlewares",[mw1, mw2, ....], (req, res)=>{
  res.send("Test Middle wares")
}) 
```
You can access search queries with req.query

# Special Tags
 You can use ``` <store></store> ``` tag to have global variables in your html file :
 
 ```html
<store>
{
  "name" : "soroosh"
}
</store>
<h1> Hello I'm name </h1>
```

Also there are some tags that changes the text color : 

```html
    <h1><red>Hello</red></h1> 
    <h1><yellow>yellow</yellow></h1>
    <h1 style="background-color: black;"><light>light</light></h1>
    <h1><blue>blue</blue></h1>
    <h1><gray>gray</gray></h1>
    <h1><green>green</green></h1>

```

![alt text](https://s16.picofile.com/file/8427977784/highlight_README_md_at_master_simplabs_highlight_Google_Chrome_3_14_2021_9_02_48_PM_2_.png)

Thank you for using this framework :)))

Please Star 😊
