/*global module*/
var Buffer = require('safe-buffer').Buffer;
var buffer = require('buffer').Buffer;
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

export function toString(obj) {
  if (typeof obj === 'string')
    return obj;
  if (typeof obj === 'number' || buffer.isBuffer(obj))
    return obj.toString();
  return JSON.stringify(obj);
};

export function isObject(thing) {
  return Object.prototype.toString.call(thing) === '[object Object]';
}

export function safeJsonParse(thing) {
  if (isObject(thing))
    return thing;
  try { return JSON.parse(thing); }
  catch (e) { return undefined; }
}

export function headerFromJWS(jwsSig) {
  var encodedHeader = jwsSig.split('.', 1)[0];
  return safeJsonParse(Buffer.from(encodedHeader, 'base64').toString('binary'));
}

export function securedInputFromJWS(jwsSig) {
  return jwsSig.split('.', 2).join('.');
}

export function signatureFromJWS(jwsSig) {
  return jwsSig.split('.')[2];
}

export function payloadFromJWS(jwsSig, encoding) {
  encoding = encoding || 'utf8';
  var payload = jwsSig.split('.')[1];
  return Buffer.from(payload, 'base64').toString(encoding);
}

export function isValidJws(string) {
  return JWS_REGEX.test(string) && !!headerFromJWS(string);
}

export function jwsDecode(jwsSig, opts) {
  opts = opts || {};
  jwsSig = toString(jwsSig);

  if (!isValidJws(jwsSig))
    return null;

  var header = headerFromJWS(jwsSig);

  if (!header)
    return null;

  var payload = payloadFromJWS(jwsSig);
  if (header.typ === 'JWT' || opts.json)
    payload = JSON.parse(payload, opts.encoding);

  return {
    header: header,
    payload: payload,
    signature: signatureFromJWS(jwsSig)
  };
}

