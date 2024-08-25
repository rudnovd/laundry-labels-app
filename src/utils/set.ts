import { toRaw } from 'vue'

export function isEqualSets<T extends string>(firstSet: Set<T>, secondSet: Set<T>): boolean {
  // https://github.com/vuejs/core/issues/11398
  const localSet = toRaw(new Set(firstSet))
  const intersectedSet = localSet.intersection(secondSet)
  return localSet.size === secondSet.size && intersectedSet.size === localSet.size
}
