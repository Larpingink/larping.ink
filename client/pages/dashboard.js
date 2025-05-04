import { useState, useEffect } from 'react';
export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  async function loadLinks() {
    const res = await fetch('http://localhost:4000/api/links', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    setLinks(await res.json());
  }

  async function addLink() {
    await fetch('http://localhost:4000/api/links', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, url })
    });
    loadLinks();
  }

  useEffect(() => { loadLinks(); }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Your Links</h1>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} className="block mb-2" />
      <input placeholder="URL" onChange={e => setUrl(e.target.value)} className="block mb-2" />
      <button onClick={addLink} className="bg-green-500 text-white px-4 py-2">Add Link</button>
      <ul className="mt-4">
        {links.map((link, idx) => (
          <li key={idx}>{link.title} - <a href={link.url} target="_blank">{link.url}</a></li>
        ))}
      </ul>
    </div>
  );
}
