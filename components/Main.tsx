import React from "react";

export function Main(props) {
  return (
    <div className="px-3 bg-teal-200 min-h-screen text-gray-800 flex justify-center">
      <main className={"px-3 w-full max-w-screen-sm"}>{props.children}</main>
    </div>
  );
}
