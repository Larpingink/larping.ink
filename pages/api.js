// pages/api/create.js
let links = {}; // TEMPORARY, resets on server restart

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, url } = JSON.parse(req.body);

  if (!username || !url) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  links[username] = url;
  console.log('Saved link:', links);
  res.status(200).json({ message: 'OK' });
}

export const linkStore = links; // used in next step
