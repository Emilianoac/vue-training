export default function getCookie(name: string) {
  const cookies = document.cookie.split("; ").map(cookie => cookie.split("="));
  const found = cookies.find(([key]) => key === name);
  return found ? decodeURIComponent(found[1]) : null;
}