//@ts-check
/**
 * @returns {{credentials: {email: import("../types").Email, password: string}} | null}
 */
export function getCredentials() {
  const credentials = localStorage.getItem('credentials');
  if(!credentials) {
    return null;
  }
  return JSON.parse(credentials);
}
export function setCredentials(credentials) {
  localStorage.setItem('credentials', JSON.stringify(credentials));
}