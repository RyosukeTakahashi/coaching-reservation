import Head from "next/head";
import { Main } from "./Main";
import { FormSection } from "./FormSection";
import { FormSectionTitle } from "./FormSectionTitle";
import React from "react";
import dynamic from "next/dynamic";

const AuthWithNoSSR = dynamic(() => import("../components/auth"), {
  ssr: false,
});

export function MyPageLogin() {
  return (
    <>
      <Head>
        <title>ログイン</title>
      </Head>
      <Main>
        <FormSection>
          <FormSectionTitle title={"Googleでログインしてください"} />
          <div>
            予約情報の確認 / 事前質問の回答 / 性格診断結果の更新 ができます。
          </div>
          <AuthWithNoSSR />
        </FormSection>
      </Main>
    </>
  );
}
