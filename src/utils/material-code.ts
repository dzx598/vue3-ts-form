/*
 * @Description: In User Settings Edit
 * @Author:wangyang
 * @Date: 2019-04-03 14:11:02
 * @LastEditTime: 2019-09-29 10:04:31
 */

function getCode(number: number) {
  switch (number) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
    case 4:
      return "E";
    case 5:
      return "F";
    case 6:
      return "G";
    case 7:
      return "H";
    case 8:
      return "I";
    case 9:
      return "J";
    case 10:
      return "K";
    case 11:
      return "L";
    case 12:
      return "M";
    case 13:
      return "N";
    case 14:
      return "O";
    case 15:
      return "P";
    case 16:
      return "Q";
    case 17:
      return "R";
    case 18:
      return "S";
    case 19:
      return "T";
    case 20:
      return "U";
    case 21:
      return "V";
    case 22:
      return "W";
    case 23:
      return "X";
    case 24:
      return "Y";
    case 25:
      return "Z";
  }
}

export function getMaterialCode(index: number) {
  const array = [];
  do {
    array.push(index % 26);
    index = Math.floor(index / 26);
  } while (index > 0);

  array.reverse();
  let materialCode = "";
  for (const i in array) {
    materialCode += getCode(array[i]);
  }
  return materialCode;
}
