// TODO: use native set method after TS 5.5
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection
export function setIntersection<T extends string>(setA: Set<T>, setB: Set<T>): Set<T> {
  const _intersection = new Set<T>()
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

export function isEqualSets<T extends string>(firstSet: Set<T>, secondSet: Set<T>): boolean {
  const intersectedSet = setIntersection<T>(firstSet, secondSet)
  return firstSet.size === secondSet.size && intersectedSet.size === firstSet.size
}
