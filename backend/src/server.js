process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection during backend startup/runtime:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception during backend startup/runtime:', error);
  process.exit(1);
});

let server;

try {
  const [{ env }, { createApp }] = await Promise.all([import('./config/env.js'), import('./app.js')]);
  const app = createApp();

  server = app.listen(env.port, env.host, () => {
    console.log(`M-Cube backend listening on http://${env.host}:${env.port}`);
  });

  server.on('error', (error) => {
    console.error(`Failed to start backend on ${env.host}:${env.port}`, error);
    process.exit(1);
  });
} catch (error) {
  console.error('Backend failed before server start:', error);
  process.exit(1);
}

export default server;
