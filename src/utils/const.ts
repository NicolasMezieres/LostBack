export function isEndList(skip: number, take: number, total: number): boolean {
  if (skip + take >= total) {
    return true;
  }
  return false;
}
