import * as helper from '../src/app_helper';

describe('Test talking to the database', () => {
  /**
   * All that app.ts does is import the app runner function, and call it.
   *
   * Because app runner is an async function, and app.ts is a main entry point,
   * and thus not-async, app.ts uses that wierd node trick for blocking on the
   * return of an async function call, when called from inside a not-async function.
   *
   * So the idea with this test is that since no one else has loaded app.ts yet,
   * nor should they, we can mock the app runner function, import app.ts, which
   * will then run the mock, and then we can use the mock to assert it got called.
   */
  describe('test app.ts', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(helper, 'appRunner');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('should see that the app runner function got called by the app', async () => {
      const expected = 1234;
      spy.mockReturnValueOnce(expected);

      await import('../src/app');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveReturnedWith(expected);
    });
  });

  describe('test the app runner', () => {
    it('should run the app runner and get back the success code', async () => {
      // expect the success code
      const expected = 0;
      const code = await helper.appRunner();
      expect(code).toEqual(expected);
    });
  });
});
