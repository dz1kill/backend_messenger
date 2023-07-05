import * as bcrypt from "bcrypt";
import { User } from "../models/user";

export async function checkPasswordUser(
  passwordReq: string,
  passwordSaveInDB: string
) {
  const resultParse = await bcrypt.compare(passwordReq, passwordSaveInDB);
  if (!resultParse) {
    throw { message: "Wrong password", statusCode: 400 };
  }
}

export async function checkUniqueEmail(email: string) {
  const findUser = await User.findOne({ where: { email } });
  if (findUser) {
    throw { message: "User with this email already exists!", statusCode: 400 };
  }
}

export async function hashPassword(passwordUser: string) {
  return await bcrypt.hash(passwordUser, 5);
}
