import React, { Suspense } from "react";
import { useDocument, useCollection } from "@nandorojo/swr-firestore";

type User = {
  name: string;
};

export default function ClientSide() {
  const user = { id: "sample" };
  const { data } = useDocument<User>(`users/${user.id}`);
  const isServer = typeof window === "undefined";
  return (
    <>
      <h2>client side rendering</h2>
      {!isServer ? (
        <Suspense fallback={<div>loading</div>}>
          <div>{data.name}</div>
        </Suspense>
      ) : (
        <div>it is server</div>
      )}
    </>
  );
}
