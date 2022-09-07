export default function numberInput(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.charCode < 48 || e.charCode > 57) {
    e.preventDefault();
  }
}
