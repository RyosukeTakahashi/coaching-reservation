type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
};

type Reservation = {
  id?: string;
  dateTime: Number;
  otherOBTalk: string;
  otherTalkTheme?: string;
  talkThemes: string[];
  howFoundMurakami: string;
};
interface CoachName {
  coachName: string;
}

type radioOption = {
  value: string;
  label: string;
  radioName: string;
};

type checkBoxOption = {
  value: string;
  label: string;
  radioName: string;
};

declare module "remark-html" {
  const html: any;
  export default html;
}
