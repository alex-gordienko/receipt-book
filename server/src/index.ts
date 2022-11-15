import { createApp } from './app';
import {Server as httpServer} from 'http';
import { Server } from 'socket.io';
import { categoriesSocketEvents } from './routes/categories/cetegories.socketEvents';
import { articlesSocketEvents } from './routes/articles/articles.socketEvents';
import { receiptsSocketEvents } from './routes/receipts/receipts.socketEvents';

(async () => {
  const port = process.env.PORT || 5001;
  const app = await createApp();

  if (process.env.NODE_ENV === 'dev') {
    const server = new httpServer(app);

    const io = new Server(server, {
      serveClient: false,
      allowEIO3: true,
      pingTimeout: 60000,
      cors: {
          origin: '*',
          credentials: true
      }
    });
  
    io.listen(server);
    categoriesSocketEvents.init(io);
    articlesSocketEvents.init(io);
    receiptsSocketEvents.init(io);

    server.listen(port, async () => {
      await console.log(`We are live on port ${port}`)
    });
  }
  else if (process.env.NODE_ENV === 'test') {
    app.listen(port);
  }
})()