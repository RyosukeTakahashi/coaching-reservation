import Head from "next/head";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "../lib/posts";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { BlogList } from "../components/BlogList";

export default function Home({
  allPostsData,
}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
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
