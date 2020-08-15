import React, { ReactNode } from "react";

export const FormSection = (props: { children: ReactNode }) => (
  <div className="mt-4 px-3 py-4 bg-white rounded-lg">{props.children}</div>
);
