/**
 * Helper function for string.format.
 * @param str string to be replaced
 * @param val value to be replaced in string.
 */
export function FormatString(str: string, ...val: string[]) {
    for (let index = 0; index < val.length; index++) {
      str = str.replace(`{${index}}`, val[index]);
    }
    console.log(`Formated String ${str}`);
    return str;
}
