import { Request, Response, Router } from 'express';

export type serverExit = (req: Request, res: Response) => void;
export const setBasicRoutes = (router: Router, exitHandler: serverExit) => {
  // health check
  router.route('/health').get((req: Request, res: Response) => {
    res.send('OK');
  });

  // shut the server down
  router.route('/exit').get((req: Request, res: Response) => {
    exitHandler(req, res);
  });
};

export const setOrmRoutes = (router: Router) => {};
