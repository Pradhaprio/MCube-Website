import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection during backend startup/runtime:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception during backend startup/runtime:', error);
  process.exit(1);
});

const server = app.listen(env.port, env.host, () => {
  console.log(`M-Cube backend listening on http://${env.host}:${env.port}`);
});

server.on('error', (error) => {
  console.error(`Failed to start backend on ${env.host}:${env.port}`, error);
  process.exit(1);
});

export default server;
