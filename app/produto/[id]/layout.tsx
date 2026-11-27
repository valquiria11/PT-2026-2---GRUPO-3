import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function ProdutoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={leagueSpartan.className}>
      {children}
    </div>
  );
}