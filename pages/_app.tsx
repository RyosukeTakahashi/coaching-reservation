import "../styles/global.css";
import { AppProps } from "next/app";
import UserProvider from "../context/userContext";
import { Fuego, FuegoProvider } from "@nandorojo/swr-firestore";
import firebaseConfig from "../firebase/clientApp";

const fuego = new Fuego(firebaseConfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FuegoProvider fuego={fuego}>
      {/*<UserProvider>*/}
      <Component {...pageProps} />
      {/*</UserProvider>*/}
    </FuegoProvider>
  );
}
