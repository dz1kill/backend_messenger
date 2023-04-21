import { User } from "../models/user";
import {
  AuthorizationDTO,
  RegistrationDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
  DropUserDto,
} from "../types/user";
import * as express from "express";
import {
  authorizationUser,
  registrationUser,
  updatePasswordUser,
  updateUserData,
} from "./service";

export async function registration(
  req: RegistrationDTO,
  res: express.Response
) {
  try {
    const { userEmail, firstName, lastName, password } = req.body;
    const result = await registrationUser(
      userEmail,
      firstName,
      lastName,
      password
    );
    res.status(result.statusCode || 200).json(result.message);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message || "Server error");
  }
}

export async function authorization(
  req: AuthorizationDTO,
  res: express.Response
) {
  try {
    const { email, password } = req.body;
    const result = await authorizationUser(email, password);
    res
      .status(result.statusCode || 200)
      .json({ message: result.message, token: result.token });
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message || "Server error");
  }
}

export async function updateUser(req: UpdateUserDTO, res) {
  try {
    const { id } = req.user;
    const { email, firstName, lastName } = req.body;
    const result = await updateUserData(id, email, firstName, lastName);
    res.status(result.statusCode || 200).json(result.message);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message || "Server error");
  }
}

export async function updatePassword(req: UpdatePasswordDTO, res) {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword, repeatNewPassword } = req.body;
    const result = await updatePasswordUser(
      oldPassword,
      newPassword,
      repeatNewPassword,
      id
    );
    res.status(result.statusCode || 200).json(result.message);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message || "Server error");
  }
}

export async function findAllUser(req, res: express.Response) {
  try {
    const result = await User.findAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message || "Server error");
  }
}

export async function dropUser(req: DropUserDto, res) {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message || "Server error");
  }
}
