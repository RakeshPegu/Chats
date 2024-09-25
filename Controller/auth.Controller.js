import prisma from "../lib/prisma.js";
import bcrypt, { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser =   async(req, res)=>{
    const {username,email, password} = req.body;
       
    try {  
        
        if(!email || !username || !password){
            return res.status(400).json({message:"registered user successfully"})
    
        }  
        const user = await prisma.user.findUnique({
            where:{email}
            
        })
        if(user){
            return res.status(400).json({message:"the email address already exist ! try an another one"})
        }
        
        const hashedPassword =  await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password:hashedPassword
            }
               
            
           
        })
        res.status(200).json(newUser)

        
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
        
    }
}
export const loginUser = async(req, res)=>{
    const {email, password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message:'All the fields are mandatory'})
        };
        const user = await prisma.user.findUnique({
            where:{email}
        })
        // check for user existence
        if(!user) return res.status(404).json({message:"User not found"})
        // check for credential
        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword) return res.status(401).json({message:"You're not authorized"});
        // generate jwt token
        const age = 1000*60*60*24*7
        const jwtToken = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_TOKEN, {expiresIn:age});
        // destructuring our user info
        const {password:userPassword, ...info } = user
        // create cookie  to store the jwttoken 
        res.cookie('token', jwtToken,{
            httpOnly:true,
            //secure:true
            maxAge : age
        })
       
       
        res.status(200).json(info)


       
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Something went wrong"})
        
    }
}
export const logoutUser = async(req, res)=>{
    try {
        // clear the cookie
        res.clearCookie('token').status(200).json({message:"Logged out successfully"})
        
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
        
    }
}