import { User } from "../models/user";
import { DropUserDto, UpdatePasswordDTO, UpdateUserDTO } from "./types";
import { updatePasswordUser, updateUserData } from "./service";

export async function updateUser(req: UpdateUserDTO, res) {
  try {
    const { id } = req.user;
    const { email, firstName, lastName } = req.body;
    const result = await updateUserData(id, email, firstName, lastName);
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function updatePassword(req: UpdatePasswordDTO, res) {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    const result = await updatePasswordUser(
      oldPassword,
      newPassword,

      id
    );
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function dropUser(req: DropUserDto, res) {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}
