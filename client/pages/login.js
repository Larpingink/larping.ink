import { useState } from 'react';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  async function handleLogin() {
    const res = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard';
  }
  return (
    <div className="p-4">
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} className="block mb-2" />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="block mb-2" />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2">Login</button>
    </div>
  );
}
