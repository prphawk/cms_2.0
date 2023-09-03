export const Footer = () => {
  return (
    <div className="mt-6 flex w-full items-center justify-center">
      <div
        //        //  text-shadow: 1px 1px 1px #03030350;

        style={{ boxShadow: ' 0 4px 6px 1px rgb(0 0 0 / 0.3), 0 2px 4px 2px rgb(0 0 0 / 0.1)' }}
        className="absolute bottom-0 flex h-[20px] w-full flex-row items-center bg-[--bottom-background] py-[14px] shadow-lg"
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
            <span className="mx-1 py-[2px]">|</span> Versão 2.8.2
          </span>
        </div>
      </div>
    </div>
  )
}
