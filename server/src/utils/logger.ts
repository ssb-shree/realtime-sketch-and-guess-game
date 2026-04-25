import pino from "pino";
import pretty from "pino-pretty";

// config for the console
const consoleStream = pretty({
  colorize: true,
  translateTime: "HH:MM:ss",
  ignore: "pid,hostname",
});

const logger = pino(
  { level: "info" },
  pino.multistream([
    { stream: consoleStream }, // console logs
  ])
);

export default logger;
