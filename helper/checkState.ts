export function checkState(state: number): string {
  if (state == 0) {
    return "Successful";
  } else if (state == 1) {
    return "Fund Raising";
  } else {
    return "Expired";
  }
}
