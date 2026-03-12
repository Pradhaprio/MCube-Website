import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`M-Cube backend listening on http://localhost:${env.port}`);
});

export default server;
