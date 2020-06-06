import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "../lib/posts";
import Layout, { siteTitle } from "../components/layout";
import ClientSide from "../components/clientSide";
import utilStyles from "../styles/utils.module.css";
import firebase from "../firebase/clientApp";
import { LocalStateExample } from "../components/localStateExample";
import { BlogList } from "../components/BlogList";
import { setCookie } from "nookies";

const AuthWithNoSSR = dynamic(() => import("../components/auth"), {
  ssr: false,
});
setCookie(null, "nextJsBlog", "value", { sameSite: "None", secure: true });

export default function Home({
  staticCollection,
  allPostsData,
}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  const [name, setName] = useState(staticCollection[2].name);
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
        <h1>Next.js boiler-plates</h1>
      </section>
      <AuthWithNoSSR />
      <LocalStateExample
        name={name}
        onClick={() => toggleText()}
        buttonText={buttonText}
      />
      <ClientSide setName={setName} />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <BlogList allPosts={allPostsData} />
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
