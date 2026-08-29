export type SeededRandom = {
  next(): number
  integer(minimum: number, maximum: number): number
  pick<T>(items: readonly T[]): T
  shuffle<T>(items: readonly T[]): T[]
}

function normalizeSeed(seed: number | string): number {
  if (typeof seed === "number") {
    return (Math.trunc(seed) >>> 0) || 1
  }

  let value = 2166136261
  for (const character of seed) {
    value ^= character.charCodeAt(0)
    value = Math.imul(value, 16777619)
  }
  return (value >>> 0) || 1
}

export function createSeededRandom(seed: number | string): SeededRandom {
  let state = normalizeSeed(seed)

  const next = () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }

  return {
    next,
    integer(minimum, maximum) {
      if (maximum < minimum) {
        throw new Error("Maximum must be greater than or equal to minimum.")
      }
      return Math.floor(next() * (maximum - minimum + 1)) + minimum
    },
    pick(items) {
      if (items.length === 0) {
        throw new Error("Cannot pick from an empty collection.")
      }
      return items[Math.floor(next() * items.length)]!
    },
    shuffle(items) {
      const result = [...items]
      for (let index = result.length - 1; index > 0; index -= 1) {
        const target = Math.floor(next() * (index + 1))
        ;[result[index], result[target]] = [result[target]!, result[index]!]
      }
      return result
    },
  }
}

export function stableHash(value: string | number): number {
  return normalizeSeed(value)
}
