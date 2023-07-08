import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { api } from '~/utils/api';
import '~/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  //TODO https://next-auth.js.org/getting-started/client
  return (
    <SessionProvider
      session={session}
      // // In case you use a custom path and your app lives at "/cool-app" rather than at the root "/"
      // basePath="cool-app"
      // // Re-fetch session every 5 minutes
      // refetchInterval={5 * 60}
      // // Re-fetches session when window is focused
      // refetchOnWindowFocus={true}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
