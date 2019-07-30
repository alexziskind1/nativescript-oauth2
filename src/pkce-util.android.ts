const DEFAULT_CODE_VERIFIER_ENTROPY = 64;
const PKCE_BASE64_ENCODE_SETTINGS = android.util.Base64.NO_WRAP | android.util.Base64.NO_PADDING | android.util.Base64.URL_SAFE;

export function getCodeVerifier(): string {
  const randomBytes = Array.create("byte", DEFAULT_CODE_VERIFIER_ENTROPY);
  new java.security.SecureRandom().nextBytes(randomBytes);
  return android.util.Base64.encodeToString(randomBytes, PKCE_BASE64_ENCODE_SETTINGS);
}

export function sha256base64encoded(codeVerifier: string): string {
  const sha256Digester = java.security.MessageDigest.getInstance("SHA-256");
  sha256Digester.update(new java.lang.String(codeVerifier).getBytes("ISO_8859_1"));
  const digestBytes = sha256Digester.digest();
  return android.util.Base64.encodeToString(digestBytes, PKCE_BASE64_ENCODE_SETTINGS);
}