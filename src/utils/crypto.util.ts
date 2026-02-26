import CryptoJS from "crypto-js"

// Only use REACT_APP_ variables in frontend
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || "";

/**
 * Decrypt an AES-256-CBC encrypted string.
 *
 * The encrypted format is: iv:encryptedData (both hex-encoded)
 * This matches the backend's encryptField() output.
 *
 * @param encryptedText - The encrypted string in format iv:encryptedData
 * @returns The decrypted plaintext string
 */
export function decryptField(encryptedText: string): string {
  try {
    const [ivHex, encrypted] = encryptedText.split(":")
    const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY)
    const iv = CryptoJS.enc.Hex.parse(ivHex)
    const ciphertext = CryptoJS.enc.Hex.parse(encrypted)

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext } as CryptoJS.lib.CipherParams,
      key,
      { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
    )

    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch {
    // If decryption fails, return the original value (may not be encrypted)
    return encryptedText
  }
}

/**
 * Decrypt sensitive fields in a user object returned from the API.
 *
 * @param user - User object that may contain encrypted fields
 * @returns User object with decrypted fields
 */
export function decryptUserFields(user: any): any {
  if (!user) return user
  return {
    ...user,
    email: user.email ? decryptField(user.email) : user.email,
  }
}
