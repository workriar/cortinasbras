const http = require('http');
const querystring = require('querystring');

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve({ statusCode: res.statusCode, headers: res.headers, body: raw });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  try {
    const host = '127.0.0.1';
    const port = 3000;

    console.log('Fetching CSRF token...');
    const getOpts = { hostname: host, port, path: '/api/auth/csrf', method: 'GET' };
    const getRes = await httpRequest(getOpts);
    if (getRes.statusCode !== 200) {
      console.error('Failed to fetch CSRF', getRes.statusCode, getRes.body);
      process.exit(2);
    }
    const csrfJson = JSON.parse(getRes.body || '{}');
    const csrfToken = csrfJson.csrfToken;
    console.log('CSRF token:', csrfToken);

    // Build cookie header from set-cookie
    let cookies = [];
    const sc = getRes.headers['set-cookie'];
    if (sc && Array.isArray(sc)) {
      for (const c of sc) {
        const kv = c.split(';')[0];
        cookies.push(kv);
      }
    }
    const cookieHeader = cookies.join('; ');
    if (cookieHeader) console.log('Using cookies:', cookieHeader);

    const postBody = querystring.stringify({
      csrfToken,
      callbackUrl: 'http://localhost:3000/dashboard',
      json: 'true',
      email: 'admin@cortinasbras.com.br',
      password: 'admin123'
    });

    console.log('Posting credentials...');
    const postOpts = {
      hostname: host,
      port,
      path: '/api/auth/callback/credentials',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postBody),
      }
    };
    if (cookieHeader) postOpts.headers['Cookie'] = cookieHeader;

    const postRes = await httpRequest(postOpts, postBody);
    console.log('Response status:', postRes.statusCode);
    console.log('Response headers:', postRes.headers);
    console.log('Response body preview:', postRes.body ? postRes.body.substring(0, 2000) : '<empty>');

    // Prepare cookies from post response
    let respCookies = [];
    const postSet = postRes.headers['set-cookie'];
    if (postSet && Array.isArray(postSet)) {
      for (const c of postSet) respCookies.push(c.split(';')[0]);
    }
    const respCookieHeader = respCookies.join('; ');
    if (respCookieHeader) console.log('Session cookies to use:', respCookieHeader);

    // Call /api/auth/session with the session cookie
    console.log('Fetching /api/auth/session with session cookie...');
    const sessionOpts = { hostname: host, port, path: '/api/auth/session', method: 'GET', headers: {} };
    if (respCookieHeader) sessionOpts.headers['Cookie'] = respCookieHeader;
    const sessionRes = await httpRequest(sessionOpts);
    console.log('Session response status:', sessionRes.statusCode);
    console.log('Session response body:', sessionRes.body);

  } catch (e) {
    console.error('Error:', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
