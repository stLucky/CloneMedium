const NUMBER_SEC_IN_DAY = 86400000;

const declOfNum = (number, words) => {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
  ];
};

const getDays = (stringDate) => {
  const date = Date.parse(stringDate);
  const days = Math.round((Date.now() - date) / NUMBER_SEC_IN_DAY);

  return days;
};

const getRenderedDate = (stringDate) => {
  const days = getDays(stringDate);
  const textDays = declOfNum(days, ["день", "дня", "дней"]);
  if (days === 0) {
    return "сегодня";
  }
  return `${days} ${textDays} назад`;
};

export { getRenderedDate };
