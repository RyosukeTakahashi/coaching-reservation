import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { GetStaticProps } from "next";
import firebase from "../firebase/clientApp";
import React, { useState, Suspense } from "react";
import ClientSide from "../components/clientSide";
import { useDocument } from "@nandorojo/swr-firestore";

type User = {
  name: string;
};

export default function Home({
  staticCollection,
  allPostsData,
}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  const [name, setName] = useState(staticCollection[0].name);
  const [buttonText, setButtonText] = useState("add last name");
  const toggleText = () => {
    if (buttonText.includes("add")) {
      setButtonText("remove last name");
      setName(`${name} ${staticCollection[1].name}`);
    } else {
      setButtonText("add last name");
      setName(name.replace(staticCollection[1].name, ""));
    }
  };

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>{name}</p>
        <button onClick={() => toggleText()}>{buttonText}</button>
        <p>
          (This is a sample website - you’ll be building a site like this on{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <ClientSide />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={"/posts/[id]"} as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();

  const db = firebase.firestore();
  const snapShot = await db.collection("users").get();
  const staticCollection = snapShot.docs.map((doc) => {
    return doc.data();
  });
  return {
    props: {
      staticCollection,
      allPostsData,
    },
  };
};
