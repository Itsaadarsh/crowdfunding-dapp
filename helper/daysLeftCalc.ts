export function daysLeftCalc(deadline: string): string {
  const dl = new Date(deadline).getTime() / 1000;
  const now = Math.round(Date.now() / 1000);
  const inHours = (dl - now) / 60 / 60;
  const inDays = inHours / 24;
  if (parseInt(inDays.toString()) == 0) {
    if (parseInt(inHours.toString()) == 0) {
      return `Less than 1 hour left`;
    } else if (parseInt(inHours.toString()) == 1) {
      return `${parseInt(inHours.toString())} hour left`;
    }
    return `${parseInt(inHours.toString())} hours left`;
  } else if (parseInt(inDays.toString()) == 1) {
    return `${parseInt(inDays.toString())} day left`;
  } else {
    return `${parseInt(inDays.toString())} days left`;
  }
}
