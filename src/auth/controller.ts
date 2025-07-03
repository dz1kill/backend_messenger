import { AuthorizationDTO, RegistrationDTO } from "./types";
import { authorizationUser, registrationUser } from "./service";
import * as express from "express";

export async function registration(
  req: RegistrationDTO,
  res: express.Response
) {
  try {
    const { email, firstName, lastName, password } = req.body;
    const result = await registrationUser(email, firstName, lastName, password);
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function authorization(
  req: AuthorizationDTO,
  res: express.Response
) {
  try {
    const { email, password } = req.body;
    const result = await authorizationUser(email, password);
    res.status(result.statusCode || 200).json({
      id: result.id,
      email: result.email,
      message: result.message,
      token: result.token,
      firstName: result.firstName,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}
