export const generateOptions = (
  options: { value: string; label: string }[],
  radioName: string
): radioOption[] => {
  return options.map((option) => Object.assign(option, { radioName }));
};

export const formatTime = (datetimeStr) => {
  const date = new Date(datetimeStr);
  const YYYY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  const hh = date.getHours();
  const mm = date.getMinutes();
  return `${YYYY}-${(MM > 9 ? "" : "0") + MM}-${(DD > 9 ? "" : "0") + DD} ${
    (hh > 9 ? "" : "0") + hh
  }:${(mm > 9 ? "" : "0") + mm}`;
};
