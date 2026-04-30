import { handleSession } from "../_lib/adminAuth.js";

export default function handler(req, res) {
  handleSession(req, res);
}
