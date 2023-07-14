import { PropsWithChildren } from 'react';

export function MyButton(props: { onClick?: () => void } & PropsWithChildren) {
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function DecorativeButton(props: PropsWithChildren) {
  return (
    <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
      {props.children}
    </button>
  );
}
