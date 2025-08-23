export function hexToBase64(hex: string): string {
  if (!hex) return '';
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  return btoa(String.fromCharCode(...bytes));
}


