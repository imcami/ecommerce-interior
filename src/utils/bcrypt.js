import bcrypt from "bcrypt";

export const hashData = async (data) => {
  return bcrypt.hash(data, 10);
};
export const compareData = async (data, hashData) => {
  if (!data || !hashData) {
    throw new Error("Datos no proporcionados ");
  }
  return bcrypt.compare(data, hashData);
};
