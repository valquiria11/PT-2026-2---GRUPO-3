import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

type IconName = "bag" | "store" | "user" | "logout";

const iconClass = "grid h-[38px] w-8 place-items-center text-white transition-colors duration-150 hover:text-[#C6E700] max-[700px]:w-6 [&_svg]:h-[30px] [&_svg]:w-[30px] max-[700px]:[&_svg]:h-[23px] max-[700px]:[&_svg]:w-[23px]";

function Icon({ name }: { name: IconName }) {
  if (name === "bag") {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 12h22v17H5z" fill="currentColor"/><path d="M11 13V9a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2.5"/></svg>;
  }
  if (name === "store") {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 13h22l-2-8H7zM7 15v13h18V15M12 28v-8h8v8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M5 13c0 3 5 3 5 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 5 3 5 0" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
  }
  if (name === "user") {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="6" fill="currentColor"/><path d="M4 29c0-7 5-11 12-11s12 4 12 11" fill="currentColor"/></svg>;
  }
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M17 5H6v22h11M14 16h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function Navbar({ logado = false }: { logado?: boolean }) {
  return (
    <header className="h-[92px] shrink-0 bg-black text-[#F6F3E4] max-[700px]:h-[72px]">
      <nav className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-6 px-[72px] max-[700px]:gap-2.5 max-[700px]:px-[18px]" aria-label="Navegação principal">
        <Link className="inline-flex shrink-0 items-center" href="/" aria-label="Stock.io — início">
          <Image className="block h-auto w-[221px] max-[700px]:w-[140px] max-[430px]:w-[115px]" src="/stockio-logo.svg" alt="" width={221} height={43} priority />
        </Link>

        <div className="flex items-center gap-[38px] max-[700px]:gap-[15px] max-[430px]:gap-2.5">
          <span className={iconClass} role="img" aria-label="Sacola"><Icon name="bag" /></span>
          <span className={iconClass} role="img" aria-label="Loja"><Icon name="store" /></span>
          {logado ? (
            <>
              <span className={iconClass} role="img" aria-label="Perfil"><Icon name="user" /></span>
              <LogoutButton className={`${iconClass} hover:text-[#C40955] focus-visible:text-[#C40955]`}><Icon name="logout" /></LogoutButton>
            </>
          ) : (
            <>
              <Link className="ml-2.5 text-[16px] font-semibold uppercase text-white transition-colors duration-150 hover:text-[#6A38F3] focus-visible:text-[#6A38F3] max-[700px]:ml-0 max-[700px]:text-xs" href="/login">Login</Link>
              <Link className="min-w-[168px] rounded-full bg-[#6A38F3] px-[19px] py-[7px] text-center text-[14px] leading-none text-white uppercase transition-colors duration-150 hover:bg-white hover:text-[#6A38F3] focus-visible:bg-white focus-visible:text-[#6A38F3] max-[700px]:min-w-0 max-[700px]:px-2.5 max-[700px]:py-2 max-[700px]:text-[11px] max-[430px]:max-w-[80px] max-[430px]:leading-[1.1]" href="/cadastro">Cadastre-se</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
