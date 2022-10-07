import { createApp } from './app';

(async () => {
  const port = process.env.PORT || 5001;
  const app = await createApp();

  if (process.env.NODE_ENV === 'dev') {
    app.listen(port, async () => {
      await console.log(`We are live on port ${port}`)
    });
  }
  else if (process.env.NODE_ENV === 'test') {
    app.listen(port);
  }
})()