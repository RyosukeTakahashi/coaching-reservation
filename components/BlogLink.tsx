import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Date from "./date";
import React from "react";
import { FC } from "react";

type BlogLinkProps = {
  id: string;
  title: string;
  dateString: string;
};

export const BlogLink: FC<BlogLinkProps> = (props: {
  id;
  title;
  dateString;
}) => (
  <li className={utilStyles.listItem}>
    <Link href={"/posts/[id]"} as={`/posts/${props.id}`}>
      <a>{props.title}</a>
    </Link>
    <br />
    <small className={utilStyles.lightText}>
      <Date dateString={props.dateString} />
    </small>
  </li>
);
