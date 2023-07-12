import { PropsWithChildren } from 'react';

export default function PageLayout(props: PropsWithChildren) {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#590202] to-[#15162c] ">
        {props.children}
      </main>
    </>
  );
}

export function TextLayout(props: PropsWithChildren) {
  return (
    <>
      <main className="font-extrabold tracking-tight text-white sm:text-[5rem]">
        {props.children}
      </main>
    </>
  );
}
