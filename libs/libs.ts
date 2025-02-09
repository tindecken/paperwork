
/**
 * Converts an ArrayBuffer to a Base64-encoded string.
 * 
 * This function takes an ArrayBuffer as input and returns a Base64-encoded string
 * representation of the buffer. It works by iterating over the bytes in the ArrayBuffer,
 * converting each byte to a character, and then encoding the resulting string using the
 * btoa function.
 * 
 * @param {ArrayBuffer} buffer - The ArrayBuffer to be converted to a Base64-encoded string.
 * @returns {string} - The Base64-encoded string representation of the input ArrayBuffer.
 * 
 * @example
 * const buffer = new ArrayBuffer(8);
 * const base64String = arrayBufferToBase64(buffer);
 * console.log(base64String); // Outputs the Base64-encoded string
 */

export const arrayBufferToBase64 = ( buffer: ArrayBuffer ): string => {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return btoa( binary );
}