import firebase from "../firebase/clientApp";
import React, { useEffect, useState } from "react";
import { CheckboxQuestion } from "../components/CheckboxQuestion";
import {
  aOrT as aOrTStr,
  mbti as mbtiStr,
  radioSettings,
  talkTheme as talkThemeStr,
} from "../src/settings/inputOption";
import { OtherTalkTheme } from "../components/OtherTalkTheme";
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

//todo: atom.tsでUserとったときにもうリアルタイムする？
//todo: async とrecoilを組み合わせる？
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

  //listener for reservation collection
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

  //listener for user document
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
      <div className="p-4 shadow rounded bg-white">
        <h1 className="text-purple-500 leading-normal">Next.js</h1>
        <p className="text-gray-500">with Tailwind CSS</p>
      </div>
      <p><Link href="/flows/coaching_preparation"><a>予約の取り直しはこちらから</a></Link></p>
      <div className={"reservation"}>
        <h2>直近の予約</h2>
        <h3>日時</h3>
        <p>大変お手数ですが、<br/>日時は、Calendly.comから届いたメールをご確認ください。</p>
        <h3>事前質問</h3>
        <div className="title">
          <p>Q1. 今まで、他のOB/OGとはどのようなことを話されましたか？</p>
          <textarea
            name="otherOBTalk"
            value={otherOBTalk}
            onChange={(e) => setOtherOBTalk(e.target.value)}
            onBlur={() =>
              setReservation(user.uid, reservations[0].id, preparationAnswer)
            }
          />
        </div>

        <div className="title">
          <p>Q2. どんな内容をお話になりたいですか？</p>
        </div>
        <CheckboxQuestion {...radioSettings[talkThemeStr]} />
        <div>その他</div>
        <OtherTalkTheme
          resId={reservations[0].id}
          preparationAnswer={preparationAnswer}
        />

        <div className="title">
          <p>Q3. どう検索して村上を見つけられましたか？</p>
          <textarea
            name="howDidFindMurakami"
            value={howFoundMurakami}
            onChange={(e) => setHowFoundMurakami(e.target.value)}
            onBlur={() =>
              setReservation(user.uid, reservations[0].id, preparationAnswer)
            }
          />
        </div>

        <div>
          <button
            onClick={() =>
              setReservation(user.uid, reservations[0].id, preparationAnswer)
            }
          >
            保存
          </button>
        </div>
      </div>
      <div>
        <h2>性格診断</h2>
        <h3>16タイプ診断</h3>
        <a
          href="https://www.16personalities.com/ja/%E6%80%A7%E6%A0%BC%E8%A8%BA%E6%96%AD%E3%83%86%E3%82%B9%E3%83%88"
          target={"_blank"}
        >
          性格診断をこちらからお受けください。
        </a>受け、
        <RadioQuestion {...radioSettings[mbtiStr]} />
        <RadioQuestion {...radioSettings[aOrTStr]} />
        <h3>High5 Test</h3>
        <a href="https://high5test.com/test/" target={"_blank"}>
          診断をこちらから
        </a>受け、
        <div className="title">結果のリンクをお貼りください。</div>
        <input
          name="high5"
          value={high5}
          onChange={(e) => setHigh5(e.target.value)}
        />
        <div>
          <button onClick={() => setUserProfile(user.uid, assessment)}>
            保存
          </button>
        </div>
      </div>
    </>
  );
}
