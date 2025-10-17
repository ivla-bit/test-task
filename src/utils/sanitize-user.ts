import { User } from "../user/entity/User.entity";

export function sanitizeUser(user: User) {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
}
