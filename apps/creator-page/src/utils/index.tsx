export function numberInput(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.charCode < 48 || e.charCode > 57) {
    e.preventDefault();
  }
}

export function sortPubKey(key: string, len = 4) {
  return key.slice(0, len) + '..'.repeat(len / 4) + key.slice(-len);
}
