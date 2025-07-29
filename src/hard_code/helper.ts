import * as bcrypt from "bcrypt";

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function hashPassword(passwordUser) {
  return await bcrypt.hash(passwordUser, 5);
}
