import { User } from "./user"

export interface UserSignupDto {
  name: string
  email: string
  password: string
  country: string
}

export interface UserLoginDto {
  email: string
  password: string
}

export interface UserUpdateDto {
  name?: string
  country?: string
}

export interface AuthResponse {
  user: User;
  token: string;
}