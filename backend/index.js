"use strict";
const app = require('./app');

const port = process.env.PUERTO || 5000;
app.listen(port, () => {

  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

// Exporta la aplicación para que Vercel la maneje como una función.
module.exports = app;
