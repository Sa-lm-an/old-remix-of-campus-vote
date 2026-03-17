const https = require('https');

const url = 'https://cuegetzhfqruawhvnrcq.supabase.co/rest/v1/election_config';
const key = 'sb_publishable_6jwB86bgnRuU2CUT1DJ9pQ_peke0E9C';

const clearKeys = (pattern) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ value: '0' });
    const options = {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(`${url}?key=like.${encodeURIComponent(pattern)}`, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`Pattern ${pattern}: Status ${res.statusCode}`);
        if (body) console.log(`Response: ${body}`);
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error(`Error for ${pattern}:`, err);
      reject(err);
    });
    req.write(data);
    req.end();
  });
};

async function run() {
  try {
    await clearKeys('nota_%');
    await clearKeys('online_nota_%');
    await clearKeys('offline_nota_%');
    console.log('\n✅ NOTA counts reset execution finished.');
  } catch (err) {
    console.error('\n❌ Execution failed:', err);
  }
}

run();
