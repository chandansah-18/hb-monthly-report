import { handleLogout } from "../_lib/adminAuth.js";

export default function handler(req, res) {
  handleLogout(req, res);
}
