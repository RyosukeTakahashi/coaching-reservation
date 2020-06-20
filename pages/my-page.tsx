import React, { useEffect, useState } from "react";
import { CheckboxQuestion } from "../components/CheckboxQuestion";
import { useDocument, useCollection } from "@nandorojo/swr-firestore";

import {
  radioSettings,
  talkTheme,
  mbti,
  aOrT,
} from "../src/settings/inputOption";
import { OtherTalkTheme } from "../components/OtherTalkTheme";
import { RadioQuestion } from "../components/RadioQuestion";
import {
  checkboxAnswerWithName,
  radioAnswerWithName,
  useUser,
} from "../src/atoms";
import { useRecoilState } from "recoil";
import { otherTalkThemeAtom } from "../src/atoms";
import { orderBy } from "@firebase/firestore/dist/packages/firestore/test/util/helpers";

//firebaseで取得
//firebaseで送信送信
export default function MyPage({}: {}) {
  const [otherOBTalk, setOtherOBTalk] = useState("");
  const [howFoundMurakami, setHowFoundMurakami] = useState("");
  const [talkThemeState] = useRecoilState(checkboxAnswerWithName(talkTheme));
  const [mbtiState] = useRecoilState(radioAnswerWithName(mbti));
  const [aOrTState] = useRecoilState(radioAnswerWithName(aOrT));
  const [otherTalkTheme] = useRecoilState(otherTalkThemeAtom);
  const [high5, setHigh5] = useState("");
  const preparationAnswer = {
    otherOBTalk,
    talkThemeState,
    otherTalkTheme,
    howFoundMurakami,
  };
  const assessment = {
    mbtiState,
    aOrTState,
    high5,
  };
  const [user, , loadingUser] = useUser();

  const uid = user === null ? "loading" : user.uid;
  const { data: reservations, loading, error } = useCollection(
    `users/${uid}/reservations`,
    {
      limit: 1,
      orderBy: ["datetime", "desc"],
      listen: true,
    }
  );

  const latestReservation =
    reservations !== undefined
      ? reservations[0]
      : { id: 1, datetime: { seconds: 2000000000 } };
  const {
    data: reservationDoc,
    update,
    loading: docLoading,
    error: docError,
  } = useDocument(`users/${uid}/reservations/${latestReservation.id}`);
  console.log(latestReservation);

  const datetime = new Date(latestReservation.datetime.seconds * 1000);
  const datetimeStr = datetime.toLocaleString();

  if (error) return <div>failed to load col</div>;
  if (!reservations) return <div>Loading col</div>;
  if (docError) return <div>failed to load doc</div>;
  if (!reservationDoc) return <div>Loading doc</div>;
  return (
    <>
      <div className={"reservation"}>
        <h2>直近の予約</h2>
        <div>予約日：{datetimeStr}</div>
        <h3>事前質問</h3>

        <div className="title">
          <p>Q1. 今まで、他のOB/OGとはどのようなことを話されましたか？</p>
          <textarea
            name="otherOBTalk"
            value={otherOBTalk}
            onChange={(e) => setOtherOBTalk(e.target.value)}
            onBlur={(e) => update({ otherOBTalk })}
          />
        </div>

        <div className="title">
          <p>Q2. どんな内容をお話になりたいですか？</p>
        </div>

        <CheckboxQuestion {...radioSettings[talkTheme]} />
        <div>その他</div>
        <OtherTalkTheme />
        <div className="title">
          <p>Q3. どう検索して村上を見つけられましたか？</p>
          <textarea
            name="howDidFindMurakami"
            value={howFoundMurakami}
            onChange={(e) => setHowFoundMurakami(e.target.value)}
            onBlur={(e) => update({ howFoundMurakami })}
          />
        </div>

        <div>
          <button onClick={() => update({ ...preparationAnswer })}>保存</button>
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
          <button>保存</button>
        </div>
      </div>
    </>
  );
}
