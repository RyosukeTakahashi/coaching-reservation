import { atom } from "recoil";
import { CalendlyState } from "../components/Calendly";

export const radioAnswerWithName = (questionName: string) => {
  return atom({
    key: `radioAnswer-${questionName}`,
    default: "",
  });
};

export const checkboxAnswerWithName = (questionName: string) => {
  return atom({
    key: `checkboxAnswer-${questionName}`,
    default: [],
  });
};

export const reservationsAtom = atom({
  key: "reservations",
  default: null as Reservation[],
});

export const otherTalkThemeAtom = atom({
  key: "talkTheme",
  default: "",
});

export const howFoundMurakamiAtom = atom({
  key: "howFoundMurakami",
  default: "",
});

export const seikakuNaviAtom = atom({
  key: "seikakuNavi",
  default: "",
});

export const calendlyStateAtom = atom({
  key: "calendlyState",
  default: CalendlyState.unshown,
});

export const otherOBTalkAtom = atom({
  key: "otherOBTalk",
  default: "",
});

export const reservationDateAtom = atom({
  key: "reservationDate",
  default: "YYYY-MM-DD",
});


type CalendlySetting = {
  url: string;
  prefill: {
    name: string;
    email: string;
    customAnswers: {
      a1: string;
    };
  };
  styles: {
    height: string;
  };
  text: string;
};

const defaultCalendlySetting: CalendlySetting = {
  url: "https://calendly.com/ryo-murakami/meeting",
  prefill: {
    name: "",
    email: "",
    customAnswers: {
      a1: "",
    },
  },
  styles: {
    height: "850px",
  },
  text: "予約はこちらから",
};

export const calendlySettingAtom = atom({
  key: "calendlyState",
  default: defaultCalendlySetting,
});

export const myPageSnackBarAtom = atom({
  key: "myPageSnackBar",
  default: false,
});

const defaultUser: User = {
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
};

export const userAtom = atom({
  key: "user",
  default: defaultUser,
});

export const userLoadingAtom = atom({
  key: "userLoading",
  default: true,
});
