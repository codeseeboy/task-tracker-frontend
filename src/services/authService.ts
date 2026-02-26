import api from "./api";
import type { UserSignupDto, UserLoginDto, AuthResponse } from "../types/auth";
import { decryptUserFields } from "../utils/crypto.util";

export const authService = {
  async register(userData: UserSignupDto): Promise<AuthResponse> {
    try {
      const response :any = await api.post("/auth/register", userData);
      console.log("Raw API response:", response);
      
      // The response itself is the data we need
      if (!response) {
        throw new Error("Empty response from server");
      }
      
      // Make sure we're returning the right structure
      if (!response.token || !response.user) {
        console.error("Missing token or user in response:", response);
        throw new Error("Invalid response structure from server");
      }
      
      // Decrypt sensitive user fields
      response.user = decryptUserFields(response.user);
      
      // Return the response directly as it already contains the right structure
      return response;
    } catch (error: any) {
      console.error("API error during registration:", error);
      
      // Get the detailed error message if available
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Registration failed";
      
      throw new Error(errorMessage);
    }
  },

  async login(credentials: UserLoginDto): Promise<AuthResponse> {
    try {
      const response : any = await api.post("/auth/login", credentials);
      
      // The response itself is the data we need
      if (!response) {
        throw new Error("Empty response from server");
      }
      
      // Make sure we're returning the right structure
      if (!response.token || !response.user) {
        console.error("Missing token or user in response:", response);
        throw new Error("Invalid response structure from server");
      }
      
      // Decrypt sensitive user fields
      response.user = decryptUserFields(response.user);
      
      // Return the response directly as it already contains the right structure
      return response;
    } catch (error: any) {
      console.error("API error during login:", error);
      
      // Get the detailed error message if available
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Login failed";
      
      throw new Error(errorMessage);
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    }
  },
};