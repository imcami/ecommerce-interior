import { fileURLToPath } from "url";
import { dirname, join } from "path";

export const __filename = fileURLToPath(import.meta.url); // devuelve el nombre del archivo
export const __dirname = join(dirname(__filename), "/.."); // devuelve la carpeta donde se encuentra el directorio
