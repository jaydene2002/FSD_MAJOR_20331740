export function toUrlPath(path: string) {
  // replace all non alphanumerics characters with hyphen
  let result = path.replace(/[^a-zA-Z0-9]/g, '-');

  // then replace all sequential hyphens with single hyphen
  result = result.replace(/-+/g, '-');

  // then remove leading and trailing hyphens
  result = result.replace(/^-+|-+$/g, '');

  // convert to lowercase
  return result.toLowerCase();
}