import React from "react";

export function LocalStateExample(props: {
  name: string;
  onClick: () => void;
  buttonText: string;
}) {
  return (
    <>
      <h2>local state change</h2>
      <h3>state was initialized by static value derived from firestore</h3>
      <p>button for changing value :{props.name}</p>
      <button onClick={props.onClick}>{props.buttonText}</button>
    </>
  );
}
