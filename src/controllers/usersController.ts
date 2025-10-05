import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from "../middlewares/auth";
import { loginSchema, userSchema } from "../schemas/userSchema";
import { comparePassword, hashPassword } from "../services/bcrypt";
import { createUser, getUserByEmail } from "../services/mockApi";

class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = userSchema.parse(req.body)
      const findUser = await getUserByEmail(email)
      if (findUser.length) { throw { status: 409, message: 'Email already registered' } }
      const hashedPassword = hashPassword(password)
      await createUser({ name, email, password: hashedPassword })
    
      res.status(201).json({ message: "Registration successfully", user: { email, name } })
    } catch (err) {
      next(err)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body)
      const findUser = await getUserByEmail(email)
      if (!findUser.length) { throw { status: 404, message: 'Invalid Email or Password' } }
      if(!comparePassword(password, findUser[0].password)) { throw { status: 404, message: 'Invalid Email or Password' } }
      const payload = { id: findUser[0].id, email: findUser[0].email, name: findUser[0].name }
      const token = jwt.sign(payload, process.env.JWT_SECRET as string)

      // set cookie
      const isProd = process.env.NODE_ENV === 'production'
      res.cookie('token', token, {
        httpOnly: false,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        domain: isProd ? '.touchsimpledev.com' : undefined,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      })
    
      res.status(200).json({ message: "Logged in successfully", user: { id: findUser[0].id, email, name: payload.name }, token })
    } catch (err) {
      next(err)
    }
  }

  static async logout(req: Request, res: Response) {
    const isProd = process.env.NODE_ENV === 'production'
    res.clearCookie('token', {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: isProd ? '.touchsimpledev.com' : undefined,
      path: '/'
    })
    res.status(200).json({ message: 'Logged out successfully' })
  }

  static async getUserByToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.decoded
      res.status(200).json({ user})
    } catch (err) {
      next(err)
    }
  }
}

export default UserController