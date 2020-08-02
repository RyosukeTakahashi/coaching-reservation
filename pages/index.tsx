import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "../lib/posts";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import firebase from "../firebase/clientApp";
import { BlogList } from "../components/BlogList";
import { useUser } from "../src/atoms";

const AuthWithNoSSR = dynamic(() => import("../components/auth"), {
  ssr: false,
});

export default function Home({
  allPostsData,
}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  const [user] = useUser();
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h1>Next.js boiler-plates</h1>
      </section>
      {user === null && <AuthWithNoSSR />}
      {user && (
        <button onClick={() => firebase.auth().signOut()}>Log Out</button>
      )}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <BlogList allPosts={allPostsData} />
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
  };
};
