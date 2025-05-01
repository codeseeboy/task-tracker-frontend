// userService.ts
import api from "./api"
import type { UserUpdateDto } from "../types/auth"
import type { AxiosResponse } from "axios"
import type { User } from "../types/user"

export const userService = {
  getProfile: async (): Promise<AxiosResponse<User>> => {
    return api.get("/users/profile")
  },

  updateProfile: async (userData: UserUpdateDto): Promise<AxiosResponse<User>> => {
    return api.put("/users/profile", userData)
  },
}