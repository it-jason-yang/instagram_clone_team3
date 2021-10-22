const { createLogger, transports, format } = require("winston");
const { label, combine, timestamp, printf, simple, colorize } = format;

//출력 포맷
const printFormat = printf(({ timestamp, label, level, message }) => {
  return `${timestamp} [${label}] ${level} : ${message}`;
});

//입력 타입(파일 저장, console 찍어주기)
const printLogFormat = {
  file: combine(
    label({
      label: "인스타그램 클론 코딩",
    }),
    timestamp({
      format: "YYYY-MM-DD HH:MM:DD",
    }),
    printFormat
  ),
  console: combine(colorize(), simple()),
};

//입력 타입에 옵션 주기
const opts = {
  file: new transports.File({
    filename: "access.log",
    dirname: "./logs",
    level: "info",
    format: printLogFormat.file,
  }),
  console: new transports.Console({
    level: "info",
    format: printLogFormat.console,
  }),
};

//로거 생성!!
const logger = createLogger({
  transports: [opts.file],
});

//개발할 때만 console로 보면 되니 완성되면 파일로만 저장 후 관리 하자
if (process.env.NODE_ENV !== "dev") {
  logger.add(opts.console);
}

module.exports = logger;
