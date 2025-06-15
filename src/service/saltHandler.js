import { base64ToBuffer, bufferToBase64 } from './convertidorBuffer';

export function generarSaltEnBruto() {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return salt;
}

// Convierte el salt en bruto (Uint8Array) en base64 para poder almacenarlo
export function crearSaltBase64(saltEnBruto){
    const saltBase64 = bufferToBase64(saltEnBruto);
    return saltBase64;
}


// Convierte el salt almacenado (base64) en un array (Uint8Array) 
// utilizado para realizar el hash de la contraseña.
export function convertirBufferArray(saltBase64) {
    const salt = base64ToBuffer(saltBase64);
    return salt;
}
