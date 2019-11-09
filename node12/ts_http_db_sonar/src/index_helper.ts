export const longString =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut aliquet diam.';

export const trailing = 'Semicolon';

export const why: string[] = ['am I tabbed?'];

export function doSomeStuff(
  withThis: string,
  andThat: string,
  andThose: string[]
): boolean {
  if (!andThose || !andThose.length) {
    return false;
  }
  console.log(withThis);
  console.log(andThat);
  console.dir(andThose);

  return true;
}
