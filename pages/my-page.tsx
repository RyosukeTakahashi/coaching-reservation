import firebase from "../firebase/clientApp";
import React, { useEffect, useState } from "react";
import { CheckboxQuestion } from "../components/CheckboxQuestion";
import {
  aOrT,
  mbti,
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
import { useRecoilState, useRecoilValue } from "recoil/dist";
import { setReservation, setUserProfile } from "../src/fetchers";

//firebaseで取得してinputにして更新したら送信
export default function MyPage({}: {}) {
  const [user] = useUser();

  const [otherOBTalk, setOtherOBTalk] = useState("default state");
  const [talkThemeState, setTalkThemeState] = useRecoilState(
    checkboxAnswerWithName(talkThemeStr)
  );
  const [reservations, setReservations] = useState([{ id: 1 }]);
  const [otherTalkTheme, setOtherTalkTheme] = useState("default talk theme");
  const [howFoundMurakami, setHowFoundMurakami] = useState(
    "how found murakami"
  );
  const preparationAnswer = {
    otherOBTalk,
    talkThemeState,
    otherTalkTheme,
    howFoundMurakami,
  };

  const mbtiState = useRecoilValue(radioAnswerWithName(mbti));
  const aOrTState = useRecoilValue(radioAnswerWithName(aOrT));
  const [high5, setHigh5] = useState("");
  const assessment = {
    mbtiState,
    aOrTState,
    high5,
  };

  useEffect(() => {
    const db = firebase.firestore();
    console.log(user);
    if (user.uid === "") return;
    const unsubscribe = db
      .collection(`users/${user.uid}/reservations`)
      .onSnapshot(async (querySnapshot) => {
        const reservations = await querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
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
  }, [user]);

  if (!user) return <div>loading user</div>;
  return (
    <>
      <div className={"reservation"}>
        <h2>直近の予約</h2>
        {/*<div>予約日：{datetimeStr}</div>*/}
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
        <textarea
          name="otherQuestion"
          value={otherTalkTheme}
          onChange={(e) => setOtherTalkTheme(e.target.value)}
          onBlur={() =>
            setReservation(user.uid, reservations[0].id, preparationAnswer)
          }
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
          診断はこちら
        </a>
        <RadioQuestion {...radioSettings[mbti]} />
        <RadioQuestion {...radioSettings[aOrT]} />
        <h3>High5 Test</h3>
        <a href="https://high5test.com/test/" target={"_blank"}>
          診断はこちら
        </a>

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
