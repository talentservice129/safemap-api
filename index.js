const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api', require('./routes'));

app.get("/", (req, res) =>{
    res.send({
        msg: "hello"
    })
})

app.listen(3030, (req, res) => {
    console.log('App is running on port 3030');
});