export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  return classes
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object') {
        return item
          ? Object.entries(item)
              .filter(([_, value]) => Boolean(value))
              .map(([key]) => key)
              .join(' ')
          : '';
      }
      return '';
    })
    .join(' ')
    .trim();
}

export default cx;