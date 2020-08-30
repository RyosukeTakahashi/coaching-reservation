import Head from "next/head";
import firebase from "../firebase/clientApp";
import { useRecoilState, useRecoilValue } from "recoil/dist";
import {
  myPageSnackBarAtom,
  reservationsAtom,
} from "../src/atoms";
import { Snackbar } from "@material-ui/core";
import { TealButton } from "../components/ColorButton";
import { FormSection } from "../components/FormSection";
import { useReservationListener, useUser } from "../lib/hooks";
import { PreparationArticles } from "../components/PreparationArticles";
import { TwitterFollow } from "../components/TwitterFollow";
import { NextCoachingPrice } from "../components/NextCoachingPrice";
import { PersonalityAssessment } from "../components/PersonalityAssessment";
import { Main } from "../components/Main";
import { Cancellation } from "../components/Cancellation";
import { MyPageLogin } from "../components/MyPageLogin";
import { PromptReservation } from "../components/PromptReservation";
import { LatestReservation } from "../components/LatestReservation";
import { LoadingUser } from "../components/LoadingUser";
import { LoadingReservations } from "../components/LoadingReservations";

export default function MyPage({}: {}) {
  const [user, , loadingUser] = useUser();
  const reservations = useRecoilValue(reservationsAtom);
  const [snackbarState, setSnackbarState] = useRecoilState(myPageSnackBarAtom);
  useReservationListener();

  if (loadingUser) return <LoadingUser />;
  if (!user) return <MyPageLogin />;
  if (!reservations) return <LoadingReservations />;
  if (reservations.length === 0) return <PromptReservation />;
  return (
    <>
      <Head>
        <title>{user.displayName}さんの予約ページ</title>
      </Head>

      <Main>
        <FormSection>
          <LatestReservation />
        </FormSection>

        <FormSection>
          <PersonalityAssessment />
        </FormSection>

        <FormSection>
          <PreparationArticles />
        </FormSection>

        <FormSection>
          <TwitterFollow />
        </FormSection>

        <FormSection>
          <NextCoachingPrice />
        </FormSection>

        <FormSection>
          <Cancellation />
        </FormSection>

        <div className={"my-5 flex justify-center"}>
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
      </Main>
    </>
  );
}
