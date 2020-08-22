import React from "react";
import { FormSectionTitle } from "./FormSectionTitle";

export function NextCoachingPrice() {
  return (
    <>
      <FormSectionTitle title={"2回目以降の相談について"} />
      <ul className={`list-disc pl-5 leading-8`}>
        <li>
          2回目以降のコーチングのご依頼は、
          責任ある対応をするため 1500円/1時間 でお受けします。
        </li>
        <li>
          支払い方法は、LinePay/PayPay/銀行振り込み/クレジットなど対応しております。
        </li>
        <li>学生の方の1回目の相談は、無償ボランティアで対応します。</li>
      </ul>
    </>
  );
}
