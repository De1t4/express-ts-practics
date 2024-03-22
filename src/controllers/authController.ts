import { Response, Request } from "express";
import { comparePassword, hashPassword } from "../services/passwordService";
import prisma from '../models/user'
import { generateToken } from "../services/authService"

export const register = async(req: Request, res: Response):Promise<void> =>{
  
  const { email, password } = req.body
  try{

    if(!email) {
      res.status(400).json({message: "el usuario no ingreso el email"})
      return
    }else if(!password){
      res.status(400).json({message: "el usuario no ingreso el password"})
      return
    }

    const hashedPassword = await hashPassword(password)

    console.log(hashedPassword)
  
    const user = await prisma.create(
      {
        data:{
          email,
          password: hashedPassword
        }
      }
    )

    const token = generateToken(user)

    res.status(201).json({ token })

  }catch(error: any){

    if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
      res.status(400).json({message: "el email ya existe"})
      return
    }
    res.status(500).json({error: "hubo un problema en el servidor"})
  }
}

export const login = async(req: Request, res: Response):Promise<void> =>{
  
  const { email, password } = req.body

  try{
    const user = await prisma.findUnique({where : {email}})

    if(!email) {
      res.status(400).json({message: "el usuario no ingreso el email"})
      return
    }
    if(!password){
      res.status(400).json({message: "el usuario no ingreso el password"})
      return
    }

    if(!user){
      res.status(404).json({errow:"usuario no encontrado"})
      return
    }

    const passwordMatch = await comparePassword(password, user.password)

    if(passwordMatch){
      res.status(401).json({error: "usuario y contraseña no coinciden"})
    }
    const token = generateToken(user)

    res.status(200).json(token)


  }catch(error){

  }
}