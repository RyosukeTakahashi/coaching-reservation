import React from "react";
import { FormSectionTitle } from "./FormSectionTitle";
import {useUser} from "../lib/hooks";

export function PreparationArticles() {
  const [user] = useUser();
  return (
    <>
      <FormSectionTitle title={"読んでいただきたい参考記事"} />
      <p>
        当日は、{user.displayName}さんのお話をより伺うため
        村上の自己紹介と会社紹介は基本は省きます。
        そのため、以下をお読みいただけると幸いです。
      </p>
      <ul className={`list-disc pl-5 leading-8 my-4`}>
        <li>
          <a href="https://matcher.jp/obogs/8e8c6318e9eb" target="_blank">
            『Matcherプロフィール』
          </a>
        </li>
        <li>
          <a href="https://bit.ly/31T0BYW" target="_blank">
            『自己分析と業界分析の方法』
          </a>
        </li>
        <li>
          <a href="https://bit.ly/2Om4GRH" target="_blank">
            『DeNAのの社風や、就活当時の軸ついて』
          </a>
        </li>
        <li>
          <a href="http://bit.ly/3bNFmNP" target="_blank">
            『コーチャブルになる方法』
          </a>
        </li>
      </ul>
      <p>
        読んだ上で質問があれば、当日にお聞きください。
        <br />
        就活生の方に割と好評な記事なので、ぜひ。
      </p>
    </>
  );
}
