import React from "react";
import { useUser } from "../src/atoms";

export function PreparationArticles() {
  const [user] = useUser();
  return (
    <>
      <h2 className={"text-2xl"}>読んでいただきたい参考記事</h2>
      <p>
        当日は、{user.displayName}
        さんのお話をより伺うため、村上の自己紹介と会社紹介は基本的に省きます。
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
            『DeNAの志望動機や社風や、就活当時の軸ついて』
          </a>
        </li>
        <li>
          <a href="http://bit.ly/3bNFmNP" target="_blank">
            『コーチャブルになる方法』
          </a>
          （コーチング受けるなら是非）
        </li>
      </ul>
      <p>
        これらを読んだ上で質問などあれば、お聞きください。
        <br />
        就活生の方に割と好評な記事なので、ぜひ。
      </p>
    </>
  );
}
