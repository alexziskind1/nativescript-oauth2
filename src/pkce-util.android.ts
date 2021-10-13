const DEFAULT_CODE_VERIFIER_ENTROPY = 64;
const PKCE_BASE64_ENCODE_SETTINGS = android.util.Base64.NO_WRAP | android.util.Base64.NO_PADDING | android.util.Base64.URL_SAFE;

declare const org;
export function getCodeVerifier(): string {
  const randomBytes = Array.create("byte", DEFAULT_CODE_VERIFIER_ENTROPY);
  new java.security.SecureRandom().nextBytes(randomBytes);
  return android.util.Base64.encodeToString(randomBytes, PKCE_BASE64_ENCODE_SETTINGS);
}

export function sha256base64encoded(codeVerifier: string): string {
  const sha256Digester = java.security.MessageDigest.getInstance("SHA-256");
  sha256Digester.update(
    new java.lang.String(codeVerifier).getBytes("ISO_8859_1")
  );
  let digestBytes;
  if (
    typeof sha256Digester.digest !== "function" &&
    sha256Digester.digest instanceof
      org.bouncycastle.crypto.digests.SHA256Digest
  ) {
    const digest = sha256Digester.digest;
    const size = digest.getDigestSize();
    digestBytes = Array.create("byte", size);
    digest.doFinal(digestBytes, 0);
  } else {
    digestBytes = sha256Digester.digest();
  }

  return android.util.Base64.encodeToString(
    digestBytes,
    PKCE_BASE64_ENCODE_SETTINGS
  );
}