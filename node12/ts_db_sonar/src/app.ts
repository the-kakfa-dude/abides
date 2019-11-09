import { appRunner } from './app_helper';

export const theApp = appRunner;

(async () => {
  await theApp();
})();
