import { readFileSync } from "fs";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { join } from "path";

const options: SignOptions = {
  algorithm: "HS256",
  expiresIn: "10d",
};

const getPrivateKeySecret = (): Buffer => {
  const filePath = join(process.cwd(), "private-key.pem");
  const secretKey = readFileSync(filePath);
  return secretKey;
};

const getPublicKeySecret = (): Buffer => {
  const filePath = join(process.cwd(), "public-key.pem");
  const secretKey = readFileSync(filePath);
  return secretKey;
};

const getAccessToken = async (payload: any): Promise<string> => {
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, secret, options);
  return token;
};

const verifyToken = async <T>(token: string, option: VerifyOptions) => {
  const secret = process.env.JWT_SECRET as string;
  const isVerified = jwt.verify(token, secret, option) as T;
  return isVerified;
};

export {
  getPrivateKeySecret,
  getAccessToken,
  getPublicKeySecret,
  verifyToken,
  options,
};
