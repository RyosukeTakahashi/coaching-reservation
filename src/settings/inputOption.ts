import { radioQuestionProps } from "../../components/RadioQuestion";
import { generateOptions } from "../../lib/utils";

const yes = "yes";
const yesJP = "はい";
const no = "no";
const noJP = "いいえ";
const radioNameMeet = "meetOrNot";
export const meetOrVideo = "meetOrVideo";
export const talkTheme = "talkTheme";
export const mbti = "mbti";
export const aOrT = "aOrT";
//radio, checkbox混在で、name なども変わる予定もあるので、これ以上は一旦抽象化しない
export const radioSettings: { [s: string]: radioQuestionProps } = {
  [radioNameMeet]: {
    title: "ご覧いただきありがとうございます。村上と面談をご希望でしょうか？",
    options: generateOptions(
      [
        { value: yes, label: yesJP },
        { value: no, label: noJP },
      ],
      radioNameMeet
    ),
  },
  [meetOrVideo]: {
    title: "Step1. ご希望の方法をお選びください",
    options: generateOptions(
      [
        { value: "ビデオチャット", label: "ビデオチャット" },
        { value: "text", label: "テキスト" },
      ],
      meetOrVideo
    ),
  },
  [talkTheme]: {
    title: "お話になりたい内容はなんでしょうか？",
    options: generateOptions(
      [
        { value: "自己分析", label: "自己分析" },
        {
          value: "企業や働き方について知りたい",
          label: "企業や働き方について知りたい",
        },
        { value: "強み/弱みを知りたい", label: "強み/弱みを知りたい" },
        {
          value: "自分の軸について考えたい",
          label: "自分の軸について考えたい",
        },
        { value: "目的/目標を設定したい", label: "目的/目標を設定したい" },
        {
          value: "目標達成の仕方を考えたい",
          label: "目標達成の仕方を考えたい",
        },
        { value: "村上について聞きたい", label: "村上について聞きたい" },
      ],
      talkTheme
    ),
  },
  [mbti]: {
    title: "16タイプ診断の結果の最初の4文字をお選びください。",
    options: generateOptions(
      [
        { value: "INTJ", label: "INTJ - 建築家" },
        { value: "INTP", label: "INTP - 論理学者" },
        { value: "ENTJ", label: "ENTJ - 指導者" },
        { value: "ENTP", label: "ENTP - 討論化" },
        { value: "INFJ", label: "INFJ - 提唱者" },
        { value: "INFP", label: "INFP - 仲介者" },
        { value: "ENFJ", label: "ENFJ - 主人公" },
        { value: "ENFP", label: "ENFP - 広報運動家" },
        { value: "ISFJ", label: "ISFJ - 擁護者" },
        { value: "ISTJ", label: "ISTJ - 管理者" },
        { value: "ESFJ", label: "ESFJ - 領事館" },
        { value: "ESTJ", label: "ESTJ - 幹部" },
        { value: "ISFP", label: "ISFP - 冒険家" },
        { value: "ISTP", label: "ISTP - 巨匠" },
        { value: "ESTP", label: "ESTP - 起業家" },
        { value: "ESFP", label: "ESFP - エンターテイナー" },
      ],
      mbti
    ),
  },
  [aOrT]: {
    title: "16タイプ診断の結果の5文字目をお選びください。",
    options: generateOptions(
      [
        { value: "A", label: "A" },
        { value: "T", label: "T" },
      ],
      aOrT
    ),
  },
};
