export const getMinutesToHuman = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let result = '';
  if (hours > 0) {
    result += hours;
    if (hours === 1) {
      result += ' hour';
    } else {
      result += ' hours';
    }
  }
  if (minutes > 0) {
    result += ' ' + minutes;
    if (minutes === 1) {
      result += ' minute';
    } else {
      result += ' minutes';
    }
  }
  return result;
};
