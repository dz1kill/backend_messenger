import { User } from "../models/user";
import {
  checkPasswordUser,
  checkUniqueEmail,
  checkUser,
  generateJwt,
  hashPassword,
} from "./helper";

export async function registrationUser(
  userEmail: string,
  firstName: string,
  lastName: string,
  passwordUser: string
) {
  await checkUniqueEmail(userEmail);
  const resultHash = await hashPassword(passwordUser);
  await User.create({
    email: userEmail,
    firstName,
    lastName,
    password: resultHash,
  });
  return {
    message: `User registered!`,
    statusCode: 201,
  };
}

export async function authorizationUser(emailUser: string, password: string) {
  const findUser = await User.findOne({ where: { email: emailUser } });
  checkUser(findUser);
  await checkPasswordUser(password, findUser.password);
  const token = generateJwt(findUser.id, findUser.email);
  return { message: "User is authorized", token, statusCode: 201 };
}
