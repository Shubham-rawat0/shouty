import bcrypt from "bcrypt"
import type { boolean } from "zod"

export const hashPass=async (password:string)=>{
    const hashedPassword= await bcrypt.hash(password,10)
    return hashedPassword
}

export const comparePassword=async (hashedPass:string,password:string)=>{
    const verified= bcrypt.compare(hashedPass,password) 
    return verified
}