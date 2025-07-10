import { User } from "../models/user";
import { checkPasswordUser, hashPassword } from "./helper";

export async function updateUserData(
  userId: number,
  firstName: string,
  lastName: string
) {
  const dataSave = {
    firstName,
    lastName,
  };
  await User.update(dataSave, { where: { id: userId } });
  return { message: "User updated.", statusCode: 201 };
}

export async function updatePasswordUser(
  oldPassword: string,
  newPassword: string,
  userId: number
) {
  const oneUser = await User.findOne({ where: { id: userId } });
  await checkPasswordUser(oldPassword, oneUser.password);
  const hashNewPassword = await hashPassword(newPassword);
  await User.update({ password: hashNewPassword }, { where: { id: userId } });
  return { message: "Password changed successfully.", statusCode: 201 };
}
