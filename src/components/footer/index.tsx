export const Footer = () => {
  return (
    <div className="mt-7 flex w-full items-center justify-center">
      <div
        style={{ boxShadow: ' 0 4px 6px 1px rgb(0 0 0 / 0.3), 0 2px 4px 2px rgb(0 0 0 / 0.1)' }}
        className="absolute bottom-0 flex h-[20px] w-full flex-row items-center bg-[--bottom-background] py-4 shadow-lg"
      >
        <div className="container flex flex-row text-xs tracking-wider text-white">
          <span>
            <span className="mr-[10px]">♥</span>
            Feedback? Contate{' '}
            <a
              target="_blank"
              href={`mailto:${process.env.EMAIL_DEVELOPER}`}
              className="font-semibold hover:underline"
            >
              Mayra Cademartori
            </a>
          </span>
          <span className="ml-auto ">
            <span className="font-semibold">Committee Management System</span>{' '}
            <span className="mx-1 py-[2px]">|</span> Versão 2.8.0
          </span>
        </div>
      </div>
    </div>
  )
}
