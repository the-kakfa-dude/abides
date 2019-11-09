import express from 'express';
import { Server } from 'http';

const server = express();
const port = 8888;

const exit = () => {
    httpServer.close();
}

// define a route	 handler for the default home page
server.get( '/health', (req: express.Request, res: express.Response) => {
    res.send('OK');
} );

server.get('/exit', (req: express.Request, res: express.Response) => closeServer(req, res));

const closeServer = (req: express.Request, res: express.Response) => {

    console.warn('Closing server in 1 second');
    res.send('Exiting Server...');

    setTimeout(function () {
        console.warn('Closing server.');
        httpServer.close();
    }, 1000)
}

// start the Express server
const httpServer: Server = server.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );


