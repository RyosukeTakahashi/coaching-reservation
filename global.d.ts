declare module "remark-html" {
  const html: any;
  export default html;
}

interface User {
  name: string;
}

interface CoachName {
  coachName: string;
}

type radioOption = {
  value: string;
  label: string;
  radioName: string;
};

type checkBoxOption = {
  value: string;
  label: string;
  radioName: string;
};
