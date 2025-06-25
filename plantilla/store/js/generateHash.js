// Crea un archivo generateHash.js
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = '3l3ctrogalind3z*';  // Cambia por tu contraseña
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash generado:', hash);
}

generateHash();