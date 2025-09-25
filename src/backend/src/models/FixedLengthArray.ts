export type FixedLengthArray<T, L extends number, Acc extends T[] = []> =
  Acc['length'] extends L ? Acc : FixedLengthArray<T, L, [...Acc, T]>;
