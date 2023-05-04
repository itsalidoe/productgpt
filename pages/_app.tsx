import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import { ModalProvider } from "../context/ModalContext";

import "../styles/globals.css";
import "github-markdown-css";

function MyApp({ Component, pageProps }: AppProps) {
  // const router = useRouter();
  // useEffect(() => {
  //   // Check if the URL contains a token
  //   if (window.location.hash.includes("token=")) {
  //     // Extract the token from the URL
  //     const token = window.location.hash.split("=")[1];

  //     // Set the token as a cookie
  //     Cookies.set("auth-token", token, {
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "strict",
  //     });

  //     // Remove the token from the URL and navigate to the same route without the hash
  //     const newPath = window.location.pathname + window.location.search;
  //     router.replace(newPath);
  //   }
  // }, [router]);

  return (
    <>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
      <Analytics />
    </>
  );
}

export default MyApp;
