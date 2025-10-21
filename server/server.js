const exp = require("express");
const app = exp();
require('dotenv').config();//process.env
const mongoose = require("mongoose");
const cors=require('cors');

// Import APIs
const userApi = require("./APIs/userApi");
const subjectApi = require("./APIs/subjectApi");
const quizApi = require("./APIs/quizApi");
const quizResultApi = require("./APIs/quizResultApi");
const dashboardApi = require("./APIs/dashboardApi");
const geminiApi = require("./APIs/geminiApi"); // Add this line

app.use(cors())

const port = process.env.PORT || 3000;

//db connection
mongoose.connect(process.env.DBURL)
    .then(() => {
        app.listen(port, () => console.log(`server listening on port ${port}..`))
        console.log("DB connection success")
    })
    .catch(err => console.log("Error in DB connection ", err))

//body parser middleware
app.use(exp.json())

// API Routes
app.use('/user-api', userApi);
app.use('/subject-api', subjectApi);
app.use('/quiz-api', quizApi);
app.use('/quiz-result-api', quizResultApi);
app.use('/dashboard-api', dashboardApi);
app.use('/gemini-api', geminiApi); // Add this line

//error handler
app.use((err,req,res,next)=>{
    console.log("err object in express error handler :",err)
    res.send({message:err.message})
})