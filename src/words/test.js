const r = require('ramda');

const stack = [2, 3, [4, 5]];
const names = ['a', 'b', ['c', 'd']];

const objFromKeys = r.curry((stack, keys) =>
  r.zipObj(keys, stack));

// // const deepZipObj= (n, s) =>
// //   r.mapObjIndexed(
// //     ((val, key, obj)) =>
// //       r.is(Array, key)
// //         ? deepZipObj(n, s) 
// //         : r.zipObj(n, s[key]),
// //     n
// //   );
const deepZipObj = (n, s) => {
  if (!n.length) {
    return {};
  }
  if (!s.length) {
    throw new Error(`'${n[n.length - 1]}' has no associated stack item.`);
    return null;
  }
  const name = n.pop();
  if (r.is(String, name)) {
    const value = s.pop();
    let def = {};
    def[name] = value;
    return { ...deepZipObj(n, s), ...def };
  }
  if (r.is(Array, name)) {
    const value = s.pop();
    return { ...deepZipObj(n, s), ...deepZipObj(name, value) };
  }
  return null;
}


console.clear();
// console.log(deepMap(mapFn, obj));
console.log(deepZipObj(names, stack));
console.log(deepZipObj(['arr', ['aIsZero', 'bIsOne']], [['8', 9, 10], [0, 1]]));
console.log(deepZipObj(['e', 'f', 'g'], [6, 7, ['8', 9, 10]]));
console.log(deepZipObj(['f', 'g'], [6, 7, ['8', 9, 10]]));
console.log(deepZipObj(['e', 'f', ['g']], [6, 7, ['8', 9, 10]]));
try {
  console.log(deepZipObj(['f', ['g']], [6, 7, ['8', 9, 10]]));
}
catch (e) {
  console.log(e.message);
}
try {
  console.log(deepZipObj(['e', 'f', 'g'], [6, ['8', 9, 10]]));
}
catch (e) {
  console.log(e.message);
}
