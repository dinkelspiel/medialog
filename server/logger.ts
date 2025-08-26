import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
});
export default pino(stream);
