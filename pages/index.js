// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/create', {
      method: 'POST',
      body: JSON.stringify({ username, url }),
    });

    if (res.ok) {
      alert(`Link created: ${window.location.origin}/${username}`);
    } else {
      alert('Failed to create link.');
    }
  };

  return (
    <main style={{ padding: 40, textAlign: 'center' }}>
      <h1>guns.lol clone</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          placeholder="destination URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <br />
        <button type="submit">Create Link</button>
      </form>
    </main>
  );
}
