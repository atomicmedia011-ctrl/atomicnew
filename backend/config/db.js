const mongoose = require('mongoose');
const dns = require('dns').promises;
const https = require('https');

// Helper to fetch JSON from a DNS-over-HTTPS provider
const fetchDoh = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/dns-json' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Manually resolve SRV records via DoH (DNS-over-HTTPS)
const resolveSrvDoh = async (srvHost) => {
  const providers = [
    `https://dns.google/resolve?name=_mongodb._tcp.${srvHost}&type=SRV`,
    `https://cloudflare-dns.com/dns-query?name=_mongodb._tcp.${srvHost}&type=SRV`
  ];
  
  for (const url of providers) {
    try {
      console.log(`Trying DoH resolution via ${url}...`);
      const response = await fetchDoh(url);
      if (response && response.Answer && response.Answer.length > 0) {
        const records = response.Answer.map(ans => {
          const parts = ans.data.split(' ');
          if (parts.length >= 4) {
            const port = parts[2];
            let target = parts[3];
            if (target.endsWith('.')) {
              target = target.slice(0, -1);
            }
            return { name: target, port: parseInt(port, 10) };
          }
          return null;
        }).filter(Boolean);
        
        if (records.length > 0) {
          return records;
        }
      }
    } catch (err) {
      console.warn(`⚠️ DoH provider ${url} failed: ${err.message}`);
    }
  }
  throw new Error('All DoH providers failed to resolve SRV record');
};

// Manually resolve TXT records via DoH (DNS-over-HTTPS)
const resolveTxtDoh = async (srvHost) => {
  const providers = [
    `https://dns.google/resolve?name=${srvHost}&type=TXT`,
    `https://cloudflare-dns.com/dns-query?name=${srvHost}&type=TXT`
  ];
  
  for (const url of providers) {
    try {
      const response = await fetchDoh(url);
      if (response && response.Answer && response.Answer.length > 0) {
        const records = response.Answer.map(ans => {
          let data = ans.data;
          if (data.startsWith('"') && data.endsWith('"')) {
            data = data.slice(1, -1);
          }
          return [data];
        });
        return records;
      }
    } catch (err) {
      console.warn(`⚠️ DoH provider ${url} failed: ${err.message}`);
    }
  }
  throw new Error('All DoH providers failed to resolve TXT record');
};

const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();

  if (!mongoUri) {
    console.error('✗ MongoDB Connection Error: MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  // Bypass Windows DNS SRV bug by manually resolving the shards
  if (mongoUri.startsWith('mongodb+srv://')) {
    console.log('🔍 MongoDB SRV detected. Attempting manual DNS lookup to bypass Windows DNS issues...');
    let resolvedHosts = null;
    let srvHost = '';
    let username = '';
    let password = '';
    let dbName = '';
    let extraOptions = '';

    const match = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/?([^?]*)/);
    if (match) {
      username = match[1];
      password = match[2];
      srvHost = match[3];
      const dbNameAndQuery = match[4];
      dbName = dbNameAndQuery.split('?')[0] || 'atomic-media';

      // 1. Try standard dns.resolveSrv
      try {
        console.log(`Resolving SRV records for _mongodb._tcp.${srvHost} via node dns...`);
        const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${srvHost}`);
        if (srvRecords && srvRecords.length > 0) {
          resolvedHosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',');
          console.log(`✓ Resolved ${srvRecords.length} MongoDB shard hosts via standard DNS.`);
        }
      } catch (dnsErr) {
        console.warn(`⚠️ Standard DNS resolution failed: ${dnsErr.message}`);
      }

      // 2. If standard DNS fails, try DNS-over-HTTPS (DoH)
      if (!resolvedHosts) {
        try {
          console.log('Attempting DNS-over-HTTPS (DoH) fallback for SRV records...');
          const srvRecords = await resolveSrvDoh(srvHost);
          resolvedHosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',');
          console.log(`✓ Resolved ${srvRecords.length} MongoDB shard hosts via DoH.`);
        } catch (dohErr) {
          console.warn(`⚠️ DoH DNS resolution failed: ${dohErr.message}`);
        }
      }

      // 3. Resolve TXT records if we succeeded in finding hosts
      if (resolvedHosts) {
        let txtRecords = null;
        try {
          txtRecords = await dns.resolveTxt(srvHost);
        } catch (txtErr) {
          try {
            txtRecords = await resolveTxtDoh(srvHost);
          } catch (txtDohErr) {
            console.warn('⚠️ Could not resolve TXT record via standard or DoH DNS.');
          }
        }

        if (txtRecords && txtRecords.length > 0) {
          const flatTxt = txtRecords.flat().join('&');
          if (flatTxt) {
            extraOptions = '&' + flatTxt;
          }
        }

        // Rebuild standard mongodb:// URI
        mongoUri = `mongodb://${username}:${password}@${resolvedHosts}/${dbName}?ssl=true&authSource=admin${extraOptions}`;
        console.log('✓ Successfully converted connection string to standard format.');
      }
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Please verify:');
    console.error('1. Your current IP is white-listed in MongoDB Atlas Network Access (try setting it to 0.0.0.0/0 for testing).');
    console.error('2. Your database credentials (username/password) are correct in backend/.env.');
    console.error('3. Your local internet connection is active.');
    throw error;
  }
};

module.exports = connectDB;
