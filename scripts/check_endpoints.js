const http = require('http');

function check(path) {
  const hosts = ['127.0.0.1', 'localhost', '192.168.101.2'];
  return new Promise((resolve) => {
    (async () => {
      for (const host of hosts) {
        try {
          const result = await new Promise((res) => {
            const opts = { hostname: host, port: 3000, path, method: 'GET' };
            const req = http.request(opts, (r) => {
              let data = '';
              r.setEncoding('utf8');
              r.on('data', (chunk) => (data += chunk));
              r.on('end', () => res({ ok: true, status: r.statusCode, body: data, host }));
            });
            req.on('error', (err) => res({ ok: false, error: err.message, host }));
            req.end();
          });
          if (result.ok) return resolve({ path, status: result.status, body: result.body, host: result.host });
        } catch (e) {
          // ignore and try next host
        }
      }
      resolve({ path, error: 'all hosts failed' });
    })();
  });
}

(async () => {
  const endpoints = ['/api/test-auth', '/api/auth/session', '/dashboard'];
  for (const p of endpoints) {
    const r = await check(p);
    console.log('---', p, '---');
    if (r.error) console.log('ERROR:', r.error);
    else {
      console.log('Status:', r.status);
      console.log('Body preview:', r.body ? r.body.substring(0, 800) : '<empty>');
    }
  }
})();
