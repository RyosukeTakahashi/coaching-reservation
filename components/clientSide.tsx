import React from "react";
import { useDocument, useCollection } from "@nandorojo/swr-firestore";

export default function ClientSide() {
  const { data, error } = useDocument<User>(`users/sample`, {
    listen: true,
  });

  const { data: collection, error: collectionError } = useCollection<User>(
    "users"
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading</div>;
  if (collectionError) return <div>failed to load collection</div>;
  if (!collection) return <div>Loading</div>;
  return (
    <>
      <h2>client side rendering</h2>
      <div>only shoing collection: {collection[0].name}</div>
      <div>showing and listening to firestore change: {data.name}</div>
    </>
  );
}
