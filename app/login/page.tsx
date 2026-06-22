import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

// Hidden sign-in route. The Login button is removed from the nav; visiting /login
// renders the shell and TopNav auto-opens the sign-in dialog (pathname === "/login").
// Closing the dialog navigates back to "/".
export const metadata = {
  title: "Sign In — Solace Lander",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <TopNav />
      <main className="flex-1 bg-section" />
      <Footer />
    </>
  );
}
