export default function isEqual(obj1: any, obj2: any) {
  const props1 = Object.getOwnPropertyNames(obj1);
  const props2 = Object.getOwnPropertyNames(obj2);
  if (props1.length !== props2.length) {
    return false;
  }
  for (let i = 0; i < props1.length; i++) {
    const val1 = obj1[props1[i]];
    const val2 = obj2[props1[i]];
    const isObjects = isObject(val1) && isObject(val2);
    if ((isObjects && !isEqual(val1, val2)) || (!isObjects && val1 !== val2)) {
      return false;
    }
  }
  return true;
}
function isObject(object: any) {
  return object != null && typeof object === 'object';
}
