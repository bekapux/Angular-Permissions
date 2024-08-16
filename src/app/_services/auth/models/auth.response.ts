import { User } from "../../../_models/user.model";

export interface AuthResponse {
  permissions: string[];
  token: string;
  refreshToken: string;
  user: User;
}
