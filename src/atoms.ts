import { atom, useRecoilState } from "recoil";

export type SampleState = {
  count: number;
};

export const sampleAtom = atom<SampleState>({
  key: "sampleStore",
  default: { count: 0 },
});

export const useSampleCounter = (): [number, () => void] => {
  const [sample, setSample] = useRecoilState(sampleAtom);
  const { count } = sample;
  const increment = () => {
    console.log("will increment", count);
    setSample({
      // ...sample,
      count: count + 1,
    });
  };
  return [count, increment];
};
