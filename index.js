const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const postRoute=require('./routes/post')

const app=express()
dotenv.config();

    
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, () => console.log("This is mongoose connected to Mongo"));

// Import routes
const authRoute=require('./routes/auth')

// routes middlewares
app.use(express.json())

app.use('/api/user',authRoute)
app.use ('/api/posts',postRoute)

app.get('/', (req,res) => {
    res.send("Welcome to my api")
})
app.listen(process.env.PORT|| 3500,()=>{
    console.log("The app running on port 3500");
})