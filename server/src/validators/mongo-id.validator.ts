export const isValidObjectID = (str: string): boolean => {
  str = str + '';
  var len = str.length, valid = false;
  if (len === 12 || len === 24) {
    valid = /^[0-9a-fA-F]+$/.test(str);
  }
  return valid;
}