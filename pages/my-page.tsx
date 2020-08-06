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

//todo: atom.tsでUserとったときにもうリアルタイムする？
//todo: async とrecoilを組み合わせる？
//

const monospaceTheme = createMuiTheme({
  typography: {
    fontFamily: 'Monaco, "monospace"',
  },
});

export default function MyPage({}: {}) {
  const [user] = useUser();

  const [otherOBTalk, setOtherOBTalk] = useState("default state");
  const [talkThemeState, setTalkThemeState] = useRecoilState(
    checkboxAnswerWithName(talkThemeStr)
  );
  const [reservations, setReservations] = useState([{}] as Reservation[]);
  const [otherTalkTheme, setOtherTalkTheme] = useRecoilState(
    otherTalkThemeAtom
  );
  const [howFoundMurakami, setHowFoundMurakami] = useState(
    "how found murakami"
  );
  const preparationAnswer = {
    otherOBTalk,
    talkThemeState,
    otherTalkTheme,
    howFoundMurakami,
  };

  const [mbti, setMbti] = useRecoilState(radioAnswerWithName(mbtiStr));
  const [aOrT, setAOrT] = useRecoilState(radioAnswerWithName(aOrTStr));
  const [high5, setHigh5] = useState("");
  const assessment = {
    mbti,
    aOrT,
    high5,
  };

  //listener for reservation collection。後で異動。
  useEffect(() => {
    const db = firebase.firestore();
    console.log(user);
    if (user.uid === "") return;
    const unsubscribe = db
      .collection(`users/${user.uid}/reservations`)
      .onSnapshot(async (querySnapshot) => {
        const reservations = await querySnapshot.docs.map((doc) => {
          const data = doc.data() as Reservation;
          return { ...data, id: doc.id };
        });
        const latestReservation = reservations[0];
        setReservations(reservations);
        setOtherOBTalk(latestReservation.otherOBTalk);
        setOtherTalkTheme(latestReservation.otherTalkTheme);
        setTalkThemeState(latestReservation.talkThemeState);
        setHowFoundMurakami(latestReservation.howFoundMurakami);
      });
    return () => {
      unsubscribe();
    };
  }, [user]); //mount後と、userが読み込まれた(or変更された)後、再実行される

  //listener for user document。後で異動。
  useEffect(() => {
    const db = firebase.firestore();
    if (user.uid === "") return;
    const unsubscribe = db.doc(`users/${user.uid}`).onSnapshot(async (doc) => {
      setAOrT(doc.data().aOrT);
      setMbti(doc.data().mbti);
      setHigh5(doc.data().high5);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  if (!user) return <div>loading user</div>;
  return (
    <>
      <div className="px-3 bg-teal-200 min-h-screen text-gray-800 flex justify-center">
        <main className={"px-3 w-full max-w-screen-sm"}>
          <div className="mt-4 px-3 py-4 bg-white rounded-lg">
            <h1 className={"text-2xl"}>直近の予約について</h1>
            <h2 className={"text-xl mt-4"}>日時</h2>
            <ul className={`list-disc pl-5 leading-8`}>
              <li>
                予約日時は、Calendly.comからの予約確認メールをご覧ください。
              </li>
              <li>
                届いてない場合、
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

            <h2 className={"text-xl mt-6"}>事前質問</h2>
            <h3 className={"text-lg mt-5 mb-3"}>
              Q1. 今まで、他のOB/OGとはどのようなことを話されましたか？
            </h3>
            <textarea
              name="otherOBTalk"
              value={otherOBTalk}
              onChange={(e) => setOtherOBTalk(e.target.value)}
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
              Q3. どう検索して村上を見つけられましたか？
            </h3>
            <textarea
              name="howDidFindMurakami"
              value={howFoundMurakami}
              onChange={(e) => setHowFoundMurakami(e.target.value)}
              onBlur={() =>
                setReservation(user.uid, reservations[0].id, preparationAnswer)
              }
              className={"p-2 border-2 border-teal-300 rounded-lg"}
            />
            <div className={"mt-5"}>
              <TealButton
                onClickHandler={() =>
                  setReservation(
                    user.uid,
                    reservations[0].id,
                    preparationAnswer
                  )
                }
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
                name="high5"
                value={high5}
                onChange={(e) => setHigh5(e.target.value)}
                className={"p-2 border-2 border-teal-300 rounded-lg"}
              />
            </div>
            <div className={"mt-5"}>
              <TealButton
                onClickHandler={() => setUserProfile(user.uid, assessment)}
              >
                保存
              </TealButton>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
