import express from 'express';
import { Server } from 'http';
import { setBasicRoutes, setOrmRoutes, serverExit } from './server_helper';

export const PORT = 8888;

// create an app and a router for it
const app = express();
const router = express.Router();
app.use('/', router);

const exitHandler: serverExit = (_: express.Request, res: express.Response) => {
  // send a 200 response that we're going shut the server down.
  res.send('ts_http_db_sonar HTTP Server Shutdown.');

  // give the server a sec to process the response we just sent.
  setTimeout(() => {
    console.warn('Closing server.');
    httpServer.close();
  }, 1000);
};

// add the routes
setBasicRoutes(router, exitHandler);
setOrmRoutes(router);

// start the http server
const httpServer: Server = app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
