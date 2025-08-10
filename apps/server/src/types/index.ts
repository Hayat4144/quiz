import { Role } from "@workspace/db";
import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}
