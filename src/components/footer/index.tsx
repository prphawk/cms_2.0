import { sysVersion } from '@/package.json'

export const Footer = () => {
  return (
    <div className="mt-7 flex w-full items-center justify-center">
      <div className=" absolute bottom-0 flex h-[20px] w-full flex-row items-center bg-[--bottom-background] py-4 shadow-lg">
        <div className="container flex flex-row text-xs font-semibold tracking-wider text-white">
          <span>
            <span className="mr-[10px]">♥</span>
            Feedback? Contate{' '}
            <a
              target="_blank"
              href="mailto:mayra.cademartori@gmail.com"
              className="hover:underline"
            >
              Mayra Cademartori
            </a>
          </span>
          <span className="ml-auto">
            Committee Management System <span className="mx-1 py-[2px]">|</span> Versão {sysVersion}
          </span>
        </div>
      </div>
    </div>
  )
}
