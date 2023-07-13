import { PropsWithChildren } from 'react';

export default function PageLayout(props: PropsWithChildren) {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#3d3db9] to-[#922b2b] ">
        {props.children}
        {/* from-[#b89393] to-[#7f4930] " 
        from-[#5d5bd2] to-[#992005] */}
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
