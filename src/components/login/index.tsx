import { useSession, signOut, signIn } from 'next-auth/react';
import { useMemo } from 'react';

export function AuthButton() {
  const { status } = useSession();

  const { text, handleOnClick } = useMemo(() => {
    if (status === 'loading') return { text: 'Loading...', handleOnClick: () => {} };
    if (status === 'unauthenticated')
      return { text: 'Sign In', handleOnClick: () => void signIn() };
    return { text: 'Sign Out', handleOnClick: () => void signOut() };
  }, [status]);

  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={handleOnClick}
    >
      {text}
    </button>
  );
}

export const LoginComponent = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        CMS <span className="border-slate-100 text-[hsl(0,0%,0%)] ">2.0</span>
        {/* flamingo #ff8d8d */}
      </h1>
      <div className="flex flex-col items-center gap-2">
        {/* <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : 'Loading tRPC query...'}
            </p> */}
        <div className="flex flex-col items-center justify-center gap-4">
          <AuthButton />
        </div>
      </div>
    </div>
  );
};
