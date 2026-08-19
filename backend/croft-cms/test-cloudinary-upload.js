require('dotenv').config();
const crypto = require('crypto');

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET;

const timestamp = Math.round(Date.now() / 1000);
const paramsToSign = `timestamp=${timestamp}`;
const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex');

const tinyPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

const form = new URLSearchParams();
form.append('file', tinyPngBase64);
form.append('api_key', apiKey);
form.append('timestamp', String(timestamp));
form.append('signature', signature);

fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: form.toString(),
}).then(async (r) => {
  console.log('STATUS:', r.status);
  const text = await r.text();
  console.log(text);
});
