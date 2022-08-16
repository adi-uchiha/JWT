const express = require("express")
const app = express();
app.use(express.json())
jwt = require("jsonwebtoken")

app.post("/api/user",(req,res)=>{
    res.send("Post")
})


app.listen("5000", ()=>{
    console.log("BAckend on 5000")
})