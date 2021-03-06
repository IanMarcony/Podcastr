import "../styles/global.scss";
import Header from "../components/Header";
import Player from "../components/Player";
import styles from "../styles/app.module.scss";
import AppProvider from "../hooks";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AppProvider>
        <div className={styles.wrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </AppProvider>
    </>
  );
}

export default MyApp;
