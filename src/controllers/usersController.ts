import { NextFunction, Request, Response } from "express";
import { userSchema } from "../schemas/userSchema";
import { checkUserCredentials } from "../services/users";

class UserController {
  static register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = userSchema.parse(req.body)
    
      res.status(201).json({ message: "User registered successfully", user: { email } })
    } catch (err) {
      next(err)
    }
  }

  static login(req: Request, res: Response, next: NextFunction) {
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