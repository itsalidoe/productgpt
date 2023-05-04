import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import { ModalProvider } from "../context/ModalContext";

import "../styles/globals.css";
import "github-markdown-css";

function MyApp({ Component, pageProps }: AppProps) {
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
