import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export default function PublicPage() {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (username) {
      fetch('http://localhost:4000/api/user/' + username)
        .then(res => res.json())
        .then(setProfile);
    }
  }, [username]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-6 text-center">
      <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full mx-auto mb-2" />
      <h1 className="text-2xl font-bold">{profile.displayName}</h1>
      <p className="mb-4">{profile.bio}</p>
      <div>
        {profile.links.map((link, i) => (
          <a key={i} href={link.url} className="block mb-2 text-blue-600 underline">{link.title}</a>
        ))}
      </div>
    </div>
  );
}
