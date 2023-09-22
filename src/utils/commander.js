import { program } from "commander";

program
  .option("-m, --mode <mode>", "Modo de desarrollo", "development")
  .option("-f, --file <file>", "Archivo para leer")
  .option("-t, --timeout <timeout>", "Tiempo de espera");

program.parse(process.argv);

export const options = program.opts();
