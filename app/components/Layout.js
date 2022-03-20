import Link from "next/link";
import { useRouter } from "next/dist/client/router";

import styles from "../styles/Home.module.css";
import Header from "./Header";
import Footer from "./Footer";
import Bar from "./Navbar";

export default function Layout({ title, children }) {
  const pathname = useRouter().pathname;

  const activeLink = (route) => (pathname === route ? styles.activeLink : "");

  return (
    <>
      <div>
        <Header title={title} />
        <Bar />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </>
  );
}