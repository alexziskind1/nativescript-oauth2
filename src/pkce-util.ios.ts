import * as CryptoJS from 'crypto-js';

const SHA256_DIGEST_LENGTH = 32;

export function getCodeVerifier(): string {
  return encodeBase64urlNoPadding(CryptoJS.lib.WordArray.random(SHA256_DIGEST_LENGTH));
}

export function sha256base64encoded(inputString: string): string {
  return encodeBase64urlNoPadding(CryptoJS.SHA256(inputString));
}

function encodeBase64urlNoPadding(data: any): string {
  return data.toString(CryptoJS.enc.Base64)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
