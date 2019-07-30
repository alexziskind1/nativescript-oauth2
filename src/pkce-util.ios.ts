const SHA256_DIGEST_LENGTH = 32;

export function getCodeVerifier(): string {
  const randomData = NSMutableData.dataWithLength(SHA256_DIGEST_LENGTH);
  const result: number = SecRandomCopyBytes(kSecRandomDefault, randomData.length, randomData.mutableBytes);
  if (result !== 0) {
    return null;
  } else {
    return encodeBase64urlNoPadding(randomData);
  }
}

export function sha256base64encoded(inputString: string): string {
  const verifierData: NSData = NSString.stringWithString(inputString).dataUsingEncoding(NSUTF8StringEncoding);
  const sha256Verifier: NSMutableData = NSMutableData.dataWithLength(SHA256_DIGEST_LENGTH);
  CC_SHA256(verifierData.bytes, verifierData.length, <string><unknown>sha256Verifier.mutableBytes);
  return encodeBase64urlNoPadding(sha256Verifier);
}

function encodeBase64urlNoPadding(data: NSData): string {
  let base64string = data.base64EncodedStringWithOptions(0);
  // converts base64 to base64url
  base64string = base64string.replace(/\+/g, "-");
  base64string = base64string.replace(/\//g, "_");
  // strips padding
  base64string = base64string.replace(/=/g, "");
  return base64string;
}