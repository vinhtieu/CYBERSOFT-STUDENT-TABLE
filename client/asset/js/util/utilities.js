export function isArrayOfObject(array) {
  if (!Array.isArray(array)) {
    return false;
  }
  return array.every((e) => typeof e === "object");
}
