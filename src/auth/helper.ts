import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as config from "config";
import { User } from "../models/user";

export async function checkUniqueEmail(email: string) {
  const findUser = await User.findOne({ where: { email } });
  if (findUser) {
    throw { message: "User with this email already exists!", statusCode: 400 };
  }
}

export async function hashPassword(passwordUser: string) {
  return await bcrypt.hash(passwordUser, 5);
}

export function checkUser(findUser: User) {
  if (!findUser) {
    throw { message: "No such user exists", statusCode: 404 };
  }
}

export async function checkPasswordUser(
  passwordReq: string,
  passwordSaveInDB: string
) {
  const resultParse = await bcrypt.compare(passwordReq, passwordSaveInDB);
  if (!resultParse) {
    throw { message: "Wrong password", statusCode: 400 };
  }
}

export function generateJwt(id: number, email: string) {
  return jwt.sign({ id, email }, config.get("JWT.key"), {
    expiresIn: "24h",
  });
}
