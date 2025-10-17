import { User } from "../user/entity/User.entity";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
