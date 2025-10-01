import { NextFunction, Request, Response } from "express";
import { userSchema } from "../schemas/userSchema";
import { checkUserCredentials } from "../services/users";

export const loginController = (req: Request, res: Response, next: NextFunction) => {
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