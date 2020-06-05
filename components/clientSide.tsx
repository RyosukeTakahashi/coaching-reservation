import React, { Suspense } from "react";
import { useDocument, useCollection } from "@nandorojo/swr-firestore";

type User = {
  name: string;
};

export default function ClientSide() {
  const user = { id: "sample" };
  const { data, update, error } = useDocument<User>(`users/${user.id}`, {
    listen: true,
  });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading</div>;
  return (
    <>
      <h2>client side rendering</h2>
      <div>{data.name}</div>
    </>
  );
}
