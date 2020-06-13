import "../styles/global.css";
import { AppProps } from "next/app";
import { Fuego, FuegoProvider } from "@nandorojo/swr-firestore";
import firebaseConfig from "../firebase/clientApp";
import { RecoilRoot } from "recoil";

const fuego = new Fuego(firebaseConfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FuegoProvider fuego={fuego}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </FuegoProvider>
  );
}
