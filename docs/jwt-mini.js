/*
 Minimal HS256 JWT helper (browser, no dependencies)
 --------------------------------------------------- */
async function signJwtHS256(payload, secret) {
  const enc = new TextEncoder();
  const toUrlBase64 = (u8) =>
    btoa(String.fromCharCode(...new Uint8Array(u8)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const header = { alg: 'HS256', typ: 'JWT' };
  const base   = `${toUrlBase64(enc.encode(JSON.stringify(header)))}.`
               + `${toUrlBase64(enc.encode(JSON.stringify(payload)))}`;

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(base));
  return `${base}.${toUrlBase64(sig)}`;
}
