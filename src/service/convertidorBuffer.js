// Estas funciones se utilizan para cambiar el tipo de dato
// y poder almacenar dichos datos en la BD.

export function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...buffer));
}

export function base64ToBuffer(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}