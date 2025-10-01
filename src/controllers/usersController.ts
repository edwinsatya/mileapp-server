import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { userSchema } from "../schemas/userSchema";
import { hashPassword } from "../services/bcrypt";
import { createUser } from "../services/mockApi";
import { checkUserCredentials } from "../services/users";

class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = userSchema.parse(req.body)
      const hashedPassword = hashPassword(password)
      const user = await createUser({ name, email, password: hashedPassword })
      const payload = { id: user.id, email: user.email, name: user.name }
      const token = jwt.sign(payload, process.env.jwt_SECRET as string)
    
      res.status(201).json({ message: "User registered successfully", user: { email, name }, token })
    } catch (err) {
      next(err)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
    const { email, password } = userSchema.parse(req.body)
    // Dummy authentication logic
    const isValid = checkUserCredentials(email, password)
    if (!isValid) { throw { status: 404, message: 'Invalid Email or Password' } }

    res.status(200).json({ message: "Login successful", user: { email, name: isValid.name, token: isValid.token } })
  } catch (err) {
    next(err)
  }
  }
}

export default UserController