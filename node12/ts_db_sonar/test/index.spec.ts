import { longString, trailing, why } from '../src/index_helper';

/**
 * This one uses spying, which will let the calls to the mock
 * actually go through to the original implementation.
 *
 * Basically, this kind of mocking just observes the object
 * being mocked. The reason we don't use spying in the other
 * test class is that the logging shows up in the test output
 * and generates a lot of noise.
 */
describe('Test the index.ts main entry point', () => {
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

  it('should log the default inputs when we load all of index.ts', async () => {
    const index = await import('../src/index');

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, longString);
    expect(console.log).toHaveBeenNthCalledWith(2, trailing);

    expect(console.dir).toHaveBeenCalledTimes(1);
    expect(console.dir).toHaveBeenNthCalledWith(1, why);
  });
});
