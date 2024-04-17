export function getRandomEnumValue<T>(enumeration: T): T[keyof T] {
  const values: T[keyof T][] = Object.values(enumeration);
  const randomIndex: number = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}
