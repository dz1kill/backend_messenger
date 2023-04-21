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

export async function updateUserData(
  userId: number,
  newEmail: string,
  firstName: string,
  lastName: string
) {
  let dataSave = {};
  if (newEmail) {
    await checkUniqueEmail(newEmail);
    dataSave = {
      email: newEmail,
      firstName,
      lastName,
    };
  } else {
    dataSave = {
      firstName,
      lastName,
    };
  }
  await User.update(dataSave, { where: { id: userId } });
  return { message: "User updated.", statusCode: 201 };
}

export async function updatePasswordUser(
  oldPassword: string,
  newPassword: string,
  repeatNewPassword: string,
  userId: number
) {
  if (!(newPassword === repeatNewPassword)) {
    throw { message: "New passwords do not match", statusCode: 400 };
  }
  const oneUser = await User.findOne({ where: { id: userId } });
  await checkPasswordUser(oldPassword, oneUser.password);
  const hashNewPassword = await hashPassword(newPassword);
  await User.update({ password: hashNewPassword }, { where: { id: userId } });
  return { message: "Password changed successfully.", statusCode: 201 };
}
