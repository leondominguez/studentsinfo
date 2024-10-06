import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Claves requeridas en cada archivo JSON
// se indican las claves que deben estar presentes en cada archivo JSON
const requiredKeys = ["nombre", "edad", "carrera", "semestre", "gustos", "noGustos", "foto", "redSocial"];
// Directorio donde se encuentran los archivos JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, 'public', 'data');

/**
 *  Funcion que revisa y valida que un archivo JSON contenga todas las claves requeridas.
 * @param {string} filePath - La ruta del archivo JSON a validar.
 * @param {string} folderName - El nombre de la carpeta donde se encuentra el archivo JSON.
 * @returns {string[]} - Una lista de claves faltantes, si las hay.
 */
function validateJSON(filePath, folderName) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const missingKeys = requiredKeys.filter(key => !data.hasOwnProperty(key));
  if (missingKeys.length > 0) {
    return `El archivo ${filePath} en la carpeta ${folderName} está faltando las claves: ${missingKeys.join(', ')}`;
  }
  return null;
}

/**
 * Ejecuta las pruebas de validación en todos los archivos JSON dentro del directorio de datos.
 * Recorre cada subdirectorio en 'public/data' y valida cada archivo JSON encontrado.
 */
function runTests() {
  const errors = [];
  const studentDirs = fs.readdirSync(dataDir);
  // Recorre cada subdirectorio en 'public/data'
  studentDirs.forEach(studentDir => {
    const studentPath = path.join(dataDir, studentDir);
    // Valida cada archivo JSON encontrado en el subdirectorio y guarda los errores
    if (fs.lstatSync(studentPath).isDirectory()) {
      const jsonFiles = fs.readdirSync(studentPath).filter(file => file.endsWith('.json'));
      jsonFiles.forEach(jsonFile => {
        const jsonFilePath = path.join(studentPath, jsonFile);
        const error = validateJSON(jsonFilePath, studentDir);
        if (error) {
          errors.push(error);
        }
      });
    }
  });

  if (errors.length > 0) {
    console.error('Se encontraron errores en los siguientes archivos JSON:');
    errors.forEach(error => console.error(error));
    process.exit(1);
  } else {
    console.log('Todos los archivos JSON son válidos.');
  }
}

// Ejecuta las pruebas y maneja cualquier error que ocurra
try {
  runTests();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}