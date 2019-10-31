import { doSomeStuff } from '../src/index';

/**
 * This one uses function mocking, which will *not* let the
 * calls to the mock go through to object being mocked.
 *
 * Basically, this kind of mocking intercepts interactions,
 * but does not pass them on.
 *
 * The reason we don't use spying here (as we do in the other
 * test file) is that spying will just observe interactions,
 * and because we have so many test cases here, if we didn't
 * intercept them, we would generate a prohibitive amount of
 * noise in the test output.
 */
describe('Test doSomeStuff()', () => {
  const first = 'a';
  const second = 'b';
  const third = ['c', 'and', 'd'];

  // create strings that are actually null/undefined
  const nullStr = (null as unknown) as string;
  const undefinedStr = (undefined as unknown) as string;

  // create string arrays that are actually null/undefined
  // or something without a length property
  const nullStrArray = (null as unknown) as string[];
  const undefinedStrArray = (undefined as unknown) as string[];
  const noLength = (1 as unknown) as string[];

  // how many times we expect console.log() and console.dir() to be called.
  const expectedLog = 2;
  const expectedDir = 1;

  const assertConsole = (
    logTimes: number,
    dirTimes: number,
    first: string,
    second: string,
    third: string[]
  ) => {
    const logger = (console.log as unknown) as jest.Mock;
    expect(logger.mock.instances.length).toBe(logTimes);
    expect(logger).toBeCalledWith(first);
    expect(logger).lastCalledWith(second);

    const dirrer = (console.dir as unknown) as jest.Mock;
    expect(dirrer.mock.instances.length).toBe(dirTimes);
    expect(dirrer).toBeCalledWith(third);
  };

  const originalDotLog = console.log;
  const originalDotDir = console.dir;

  describe('postive cases', () => {
    beforeEach(() => {
      console.log = jest.fn();
      console.dir = jest.fn();
    });

    afterEach(() => {
      console.log = originalDotLog;
      console.dir = originalDotDir;
    });

    describe('base case of it working', () => {
      it('should log the actually-strings inputs we pass the function', () => {
        const returnVal: boolean = doSomeStuff(first, second, third);
        expect(returnVal).toBeTruthy();
        assertConsole(expectedLog, expectedDir, first, second, third);
      });
    });

    describe('it works edge cases with valid/not-so-valid inputs', () => {
      it('should still work -- first is null', () => {
        const returnVal: boolean = doSomeStuff(nullStr, second, third);
        expect(returnVal).toBeTruthy();
        assertConsole(expectedLog, expectedDir, nullStr, second, third);
      });

      it('should still work -- first is undefined', () => {
        const returnVal: boolean = doSomeStuff(undefinedStr, second, third);
        expect(returnVal).toBeTruthy();
        assertConsole(expectedLog, expectedDir, undefinedStr, second, third);
      });

      it('should still work -- second is null', () => {
        const returnVal: boolean = doSomeStuff(first, nullStr, third);
        expect(returnVal).toBeTruthy();
        assertConsole(expectedLog, expectedDir, first, nullStr, third);
      });

      it('should still work -- second is undefined', () => {
        const returnVal: boolean = doSomeStuff(first, undefinedStr, third);
        expect(returnVal).toBeTruthy();
        assertConsole(expectedLog, expectedDir, first, undefinedStr, third);
      });
    });
  });

  describe('negative cases', () => {
    let consoleLogSpy: jest.SpyInstance;
    let consoleDirSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(global.console, 'log');
      consoleDirSpy = jest.spyOn(global.console, 'dir');
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
      consoleDirSpy.mockRestore();
    });

    it('should return false when the array is passed as null', () => {
      const returnVal: boolean = doSomeStuff(first, second, nullStrArray);

      expect(returnVal).toBeFalsy();
      expect(console.log).toHaveBeenCalledTimes(0);
      expect(console.dir).toHaveBeenCalledTimes(0);
    });

    it('should return false when the array is passed as undefined', () => {
      const returnVal: boolean = doSomeStuff(first, second, undefinedStrArray);
      expect(returnVal).toBeFalsy();
      expect(console.log).toHaveBeenCalledTimes(0);
      expect(console.dir).toHaveBeenCalledTimes(0);
    });

    it('should return false when the array is passed something without length', () => {
      const returnVal: boolean = doSomeStuff(first, second, noLength);
      expect(returnVal).toBeFalsy();
      expect(console.log).toHaveBeenCalledTimes(0);
      expect(console.dir).toHaveBeenCalledTimes(0);
    });
  });
});
