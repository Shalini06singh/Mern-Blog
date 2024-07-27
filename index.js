//create server
//import
const express = require('express');
const path = require('path')
const bodyParser = require("body-parser");
const session = require('express-session')
const hbs = require('hbs')
const mongoose = require('mongoose')




const frontRoutes = require('./routes/front.route')
const backendRoutes = require('./routes/backend.route')


//app instance
const app = express();

//middleware
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    secret: 'blog',
    resave: false,
    saveUninitialized: true,
    
  }))

//connect database
mongoose.connect('mongodb://127.0.0.1:27017/blog')
//returns promise
.then(()=>{
    console.log("database connection established");
})
.catch(err  =>{
    console.log(err);
})


//static file server
app.use(express.static(path.join(__dirname,'public')))

app.set('view engine','hbs');
hbs.registerPartials(path.join(__dirname,'./views/partials'))


//routes
app.use('/admin',backendRoutes);

app.use(frontRoutes)

//port
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`server listening to ${PORT}`);
})