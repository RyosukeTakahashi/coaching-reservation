import firebase from "../firebase/clientApp";
import React, { useEffect, useState } from "react";
import { CheckboxQuestion } from "../components/CheckboxQuestion";
import {
  aOrT as aOrTStr,
  mbti as mbtiStr,
  radioSettings,
  talkTheme as talkThemeStr,
} from "../src/settings/inputOption";
import { RadioQuestion } from "../components/RadioQuestion";
import {
  checkboxAnswerWithName,
  otherTalkThemeAtom,
  radioAnswerWithName,
  useUser,
} from "../src/atoms";
import { useRecoilState } from "recoil/dist";
import { setReservation, setUserProfile } from "../src/fetchers";
import Link from "next/link";
import { TealButton } from "../components/ColorButton";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from "@material-ui/styles";
import { Snackbar } from "@material-ui/core";
import Head from "next/head";
import dynamic from "next/dist/next-server/lib/dynamic";
import { FormSection } from "../components/FormSection";
import { FormSectionTitle } from "../components/FormSectionTitle";
const AuthWithNoSSR = dynamic(() => import("../components/auth"), {
  ssr: false,
});

//todo: googleログイン名前変更,(vercelドメイン変更）
//todo: 事後アンケート form 作成。
//todo: リファクタ コンポーネント分割, useEffect 移動, atom.tsでUserとったときにもうリアルタイム？
//todo: 高速化 render 減らす

const monospaceTheme = createMuiTheme({
  typography: {
    fontFamily: 'Monaco, "monospace"',
  },
});

export default function MyPage({}: {}) {
  const [user] = useUser();

  const [otherOBTalk, setOtherOBTalk] = useState("");
  const [talkThemes, setTalkThemes] = useRecoilState(
    checkboxAnswerWithName(talkThemeStr)
  );
  const [reservations, setReservations] = useState([{}] as Reservation[]);
  const [howFoundMurakami, setHowFoundMurakami] = useState("");
  const preparationAnswer = {
    otherOBTalk,
    talkThemes,
    howFoundMurakami,
  };

  const [mbti, setMbti] = useRecoilState(radioAnswerWithName(mbtiStr));
  const [aOrT, setAOrT] = useRecoilState(radioAnswerWithName(aOrTStr));
  const [seikakuNavi, setSeikakuNavi] = useState("");
  const assessment = {
    mbti,
    aOrT,
    seikakuNavi,
  };
  const [snackbarState, setSnackbarState] = useState(false);
  //listener for reservation collection。後で異動。
  useEffect(() => {
    if (!user || user.uid === "") return;
    const db = firebase.firestore();
    const unsubscribe = db
      .collection(`users/${user.uid}/reservations`)
      .orderBy("dateTime", "desc") //datetimeがなければ取得できない
      .onSnapshot(async (querySnapshot) => {
        const reservations = await querySnapshot.docs.map((doc) => {
          const data = doc.data() as Reservation;
          return { ...data, id: doc.id };
        });
        const latestReservation = reservations[0];
        setReservations(reservations);
        setOtherOBTalk(latestReservation.otherOBTalk);
        setTalkThemes(latestReservation.talkThemes);
        setHowFoundMurakami(latestReservation.howFoundMurakami);
      });
    return () => {
      unsubscribe();
    };
  }, [user]);

  //listener for user document。後で異動。
  useEffect(() => {
    if (!user || user.uid === "") return;
    const db = firebase.firestore();
    const unsubscribe = db.doc(`users/${user.uid}`).onSnapshot(async (doc) => {
      setAOrT(doc.data().aOrT);
      setMbti(doc.data().mbti);
      setSeikakuNavi(doc.data().seikakuNavi);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  if (!user)
    return (
      <div className="px-3 bg-teal-200 min-h-screen text-gray-800 flex justify-center">
        <main className={"px-3 w-full max-w-screen-sm"}>
          <div className="mt-4 px-3 py-4 bg-white rounded-lg">
            <FormSection>
              <FormSectionTitle title={"Googleでログインしてください"} />
              <div>
                予約情報の確認, 事前質問の回答, 性格診断結果の更新ができます。
              </div>
              <AuthWithNoSSR />
            </FormSection>
          </div>
        </main>
      </div>
    );
  return (
    <>
      <Head>
        <title>{user.displayName}さんの予約ページ</title>
      </Head>
      <div className="px-3 bg-teal-200 min-h-screen text-gray-800 flex justify-center">
        <main className={"px-3 w-full max-w-screen-sm"}>
          <div className="mt-4 px-3 py-4 bg-white rounded-lg">
            <h1 className={"text-2xl"}>直近の予約について</h1>
            <h2 className={"text-xl mt-4"}>日時</h2>
            <ul className={`list-disc pl-5 leading-8`}>
              <li>
                予約日時は、Calendly.comからの予約確認メール /{" "}
                <a
                  href="https://calendar.google.com/calendar/r"
                  target="_blank"
                >
                  Googleカレンダー
                </a>
                をご覧ください。
              </li>
              <li>
                メールが届いてない場合、
                <a href="https://twitter.com/ryo_mura_brains" target="_blank">
                  Twitter
                </a>
                {" / "}
                <a
                  href="https://www.facebook.com/ryo.murakami.3998"
                  target="_blank"
                >
                  Facebook
                </a>
                でお問い合わせください。
              </li>
            </ul>
            <h2 className={"text-xl mt-6"}>場所</h2>
            <a href="https://calendar.google.com/calendar/r" target="_blank">
              Googleカレンダー
            </a>
            に追加された予定（以下の画像を参考）から、Google
            Meetを時刻になったらお開きください。
            <div className={"flex justify-center"}>
              <img
                src="/images/gcal_reservation.png"
                alt="Google Calendar"
                className={"mt-4 border-2 rounded-lg"}
              />
            </div>
            <br />
            設定が不安な方は予めGoogle
            Meetでマイクテストなどをして頂けますと幸いです。
            <h2 className={"text-xl mt-12"}>事前質問</h2>
            <h3 className={"text-lg mt-5 mb-3"}>
              Q1. 他のOB/OGとはどのようなことを話し、学ばれましたか？
            </h3>
            <p>（なければ、「なし」とご記入ください。）</p>
            <textarea
              name="otherOBTalk"
              value={otherOBTalk}
              onChange={(e) => setOtherOBTalk(e.target.value)}
              rows={3}
              cols={30}
              onBlur={() =>
                setReservation(user.uid, reservations[0].id, preparationAnswer)
              }
              className={"p-2 border-2 border-teal-300 rounded-lg"}
            />
            <h3 className={"text-lg mt-5 mb-3"}>
              Q2. どんな内容をお話になりたいですか？
            </h3>
            <CheckboxQuestion {...radioSettings[talkThemeStr]} />
            <h3 className={"text-lg mt-5 mb-3"}>
              Q3. なぜ村上に申請いただけたでしょうか？
            </h3>
            <textarea
              name="howDidFindMurakami"
              value={howFoundMurakami}
              onChange={(e) => setHowFoundMurakami(e.target.value)}
              onBlur={() =>
                setReservation(user.uid, reservations[0].id, preparationAnswer)
              }
              className={"p-2 border-2 border-teal-300 rounded-lg"}
              rows={3}
              cols={30}
            />
            <div className={"mt-5"}>
              <TealButton
                onClickHandler={async () => {
                  await setReservation(
                    user.uid,
                    reservations[0].id,
                    preparationAnswer
                  );
                  setSnackbarState(true);
                }}
              >
                事前回答を保存
              </TealButton>
            </div>
            <div className={"mt-4"}>
              <Link href="/flows/coaching_preparation">
                <a>予約の取り直しはこちらから</a>
              </Link>
            </div>
          </div>

          <div className="mt-4 px-3 py-4 bg-white rounded-lg">
            <h1 className={"text-2xl"}>性格診断</h1>
            <h2 className={"text-xl mt-4"}>16タイプ診断</h2>
            <p>
              <a
                href="https://www.16personalities.com/ja/%E6%80%A7%E6%A0%BC%E8%A8%BA%E6%96%AD%E3%83%86%E3%82%B9%E3%83%88"
                target={"_blank"}
              >
                16タイプ診断をこちらからお受けください。
              </a>
            </p>
            <h3 className={"text-lg mt-5 mb-3"}>
              結果の4文字をお選びください。
            </h3>
            <ThemeProvider theme={monospaceTheme}>
              <RadioQuestion {...radioSettings[mbtiStr]} />
            </ThemeProvider>
            <h3 className={"text-lg mt-5 mb-3"}>
              結果の5文字目をお選びください。
            </h3>
            <div className={"monospace-font"}>
              <RadioQuestion {...radioSettings[aOrTStr]} />
            </div>
            <h2 className={"text-xl mt-4"}>性格ナビ診断</h2>
            <a href="https://seikakunabi.jp/question/" target={"_blank"}>
              性格ナビ診断をこちら
            </a>
            から受け、結果のURLをお貼りください。
            <div>
              <input
                name="seikakuNavi"
                value={seikakuNavi}
                onChange={(e) => setSeikakuNavi(e.target.value)}
                className={"p-2 border-2 border-teal-300 rounded-lg"}
              />
            </div>
            <div className={"mt-5"}>
              <TealButton
                onClickHandler={async () => {
                  await setUserProfile(user.uid, assessment);
                  setSnackbarState(true);
                }}
              >
                診断結果を保存
              </TealButton>
            </div>
          </div>

          <FormSection>
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
          </FormSection>

          <FormSection>
            <h2 className={"text-2xl"}>Twitterのフォローお願いします(任意)</h2>
            フォロー頂けるとお話した後、DMでやりとりしやすくなるので、お願いします。
            <a href="https://twitter.com/ryo_mura_brains" target="_blank">
              https://twitter.com/ryo_mura_brains
            </a>
          </FormSection>

          <FormSection>
            <h2 className={"text-2xl"}>2回目以降の相談について</h2>
            <p>
              2回目以降の相談/コーチングをお望みの場合、
              責任を持って対応しますため、そのようなご依頼はコーチングのプロとしてお受けします（1時間
              1500円）。
            </p>
            <p>
              支払い方法は、LinePay/PayPay/銀行振り込み/クレジットカードなど対応しております。
            </p>
            <p>学生の方の1回目の相談は、無償ボランティアで対応しております。</p>
          </FormSection>

          <div className={"mt-5 flex justify-center"}>
            <TealButton onClickHandler={() => firebase.auth().signOut()}>
              Log Out
            </TealButton>
          </div>

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={snackbarState}
            autoHideDuration={2500}
            onClose={() => setSnackbarState(false)}
            message="保存しました"
          />
        </main>
      </div>
    </>
  );
}
