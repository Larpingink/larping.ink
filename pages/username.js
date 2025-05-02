// pages/[username].js
import { linkStore } from './api/create';

export async function getServerSideProps(context) {
  const { username } = context.params;
  const destination = linkStore[username];

  if (destination) {
    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  }

  return {
    notFound: true,
  };
}

export default function RedirectPage() {
  return null;
}
