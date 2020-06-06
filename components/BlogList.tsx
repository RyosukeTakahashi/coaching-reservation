import utilStyles from "../styles/utils.module.css";
import React from "react";
import { BlogLink } from "./BlogLink";

export function BlogList(props: {
  allPosts: { date: string; title: string; id: string }[];
}) {
  return (
    <>
      <h2 className={utilStyles.headingLg}>Blog</h2>
      <ul className={utilStyles.list}>
        {props.allPosts.map(({ id, date, title }) => (
          <BlogLink key={id} id={id} title={title} dateString={date} />
        ))}
      </ul>
    </>
  );
}
