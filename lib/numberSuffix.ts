export const numberSuffix = (number: number): string => {
  if (![11, 12, 13].includes(number % 100)) {
    switch (number % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
