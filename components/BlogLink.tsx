import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Date from "./date";
import React from "react";

export function BlogLink(props: {
  id: string;
  title: string;
  dateString: string;
}) {
  return (
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
}
