import { useState } from 'react';
export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  async function handleSignup() {
    await fetch('http://localhost:4000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    window.location.href = '/login';
  }
  return (
    <div className="p-4">
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} className="block mb-2" />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="block mb-2" />
      <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2">Sign Up</button>
    </div>
  );
}
