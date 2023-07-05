import { AuthorizationDTO, RegistrationDTO } from "../types/auth";
import { authorizationUser, registrationUser } from "./service";
import * as express from "express";

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
