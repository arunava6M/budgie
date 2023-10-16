"use client";
import "../styles/global.css";
import { PageWrapper } from "../components/PageWrapper";

export default function App({ Component, pageProps }) {
  return (
    <PageWrapper>
      <Component {...pageProps} />
    </PageWrapper>
  );
}
