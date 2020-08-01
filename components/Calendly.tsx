import React from "react";
import { calendlySettingAtom } from "../src/atoms";
import { CalendlyEventListener, InlineWidget } from "react-calendly";
import { useRecoilState } from "recoil";

export enum CalendlyState {
  datetimeSelected,
  scheduled,
}

export const Calendly = React.memo((props: { setCalendlyState }) => {
  const [calendlySetting] = useRecoilState(calendlySettingAtom);
  const onScheduled = React.useCallback(() => {
    props.setCalendlyState(CalendlyState.datetimeSelected);
    document
      .getElementsByClassName("calendly-inline-widget")[0]
      .setAttribute("style", "height: 700px;");
  }, [props.setCalendlyState]);
  return (
    <CalendlyEventListener
      onEventScheduled={onScheduled}
      onDateAndTimeSelected={onScheduled}
    >
      <InlineWidget {...calendlySetting} />
    </CalendlyEventListener>
  );
});
