import app from "./app.js"; 



app.listen(process.env.port,()=>{
    console.log("hey listening on port no....", process.env.port); 
})