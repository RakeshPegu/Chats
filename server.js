import express from 'express'
import authRoute from './routes/authUser.js'
const app  = express()
app.use(express.json())

const port = process.env.PORT || 5000;
app.use('/api/auth', authRoute)
app.listen(port, ()=>{
    console.log(`the server is listening on port ${port}`)
})