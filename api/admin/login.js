import { handleLogin } from "../_lib/adminAuth.js";

export default async function handler(req, res) {
  await handleLogin(req, res);
}
