/**
 * This one uses spying, which will let the calls to the mock
 * actually go through to the original implementation.
 *
 * Basically, this kind of mocking just observes the object
 * being mocked. The reason we don't use spying in the other
 * test class is that the logging shows up in the test output
 * and generates a lot of noise.
 */
describe('Test the index.ts application', () => {
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

  it('should log the default inputs when we load all of index.ts', () => {
    const app = require('../src/index');

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, app.longString);
    expect(console.log).toHaveBeenNthCalledWith(2, app.trailing);

    expect(console.dir).toHaveBeenCalledTimes(1);
    expect(console.dir).toHaveBeenNthCalledWith(1, app.why);
  });
});
