const express = require("express")
const app = express();
app.use(express.json())
jwt = require("jsonwebtoken")

const users = [
    {
        id: "1",
        username: "adi",
        password: "adi123",
        isAdmin: true
    },
    {   
        id: "2",
        username: "dadi",
        password: "dadi123",
        isAdmin: false
    }
];

app.post("/api/login",(req,res)=>{
    const {username, password} = req.body;
    const user = users.find((u)=>{
        if(u.username===username && u.password===password){
            return u
        }
    });
    if(user){
        const token = jwt.sign({id:user.id, isAdmin:user.isAdmin}, "mysupersecretkey")
        res.status(200).json({
            username : user.username,
            isAdmin: user.isAdmin,
            token
        })
    }else{
        res.status(400).json("User not found")
    }
})

const verify = (req,res,next) =>{
    console.log("verifing")
    //this function have access to the req and res of the delete request
    const authHeader = req.headers.author;
    console.log(authHeader)
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, "mysupersecretkey", (err, user)=>{ //user is the returned payload(id, isAdmin)
            //user is the name of the object containing the id and isAdmin
            if(err){
                res.status(402).json("Token not verified")
            }

            req.user = user //assigining the found payload to req body so to use in the further request
            next(); //continue to the delete request body
        })
    }else{
        res.status(401).json("send auth header bro")
    }
}



app.delete("/api/user/:userId", verify, (req,res)=>{  
    //verify is called before the delete body executes
    //delete the post only if user is admin
    if(req.params.userId===req.user.id && req.user.isAdmin){
        res.status(200).json("User Deleted")
    }else{
        res.status(401).json("You cannot delete")
    }

})


app.listen("5000", ()=>{
    console.log("Backend on 5000")
})