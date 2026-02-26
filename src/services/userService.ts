// userService.ts
import api from "./api"
import type { UserUpdateDto } from "../types/auth"

import { decryptUserFields } from "../utils/crypto.util"

export const userService = {
  getProfile: async (): Promise<any> => {
    const response = await api.get("/users/profile")
    // Decrypt sensitive fields (email) returned from backend
    return decryptUserFields(response)
  },

  updateProfile: async (userData: UserUpdateDto): Promise<any> => {
    const response = await api.put("/users/profile", userData)
    // Decrypt sensitive fields (email) returned from backend
    return decryptUserFields(response)
  },
}