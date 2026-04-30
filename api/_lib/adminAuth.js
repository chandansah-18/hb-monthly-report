import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "hb_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getConfig() {
  return {
    adminPassword: process.env.ADMIN_PASSWORD ?? "",
    sessionSecret:
      process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "local-dev-session-secret",
    secureCookies: process.env.NODE_ENV === "production",
  };
}

export function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

export async function readJsonBody(req) {
  return await new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((cookies, cookie) => {
      const separatorIndex = cookie.indexOf("=");
      if (separatorIndex === -1) {
        return cookies;
      }

      const key = cookie.slice(0, separatorIndex);
      const value = cookie.slice(separatorIndex + 1);
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function timingSafeMatch(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function buildSessionToken(sessionSecret) {
  const expiresAt = `${Date.now() + SESSION_DURATION_SECONDS * 1000}`;
  const payload = `admin:${expiresAt}`;
  const signature = sign(payload, sessionSecret);
  return Buffer.from(`${payload}:${signature}`, "utf8").toString("base64url");
}

function verifySessionToken(token, sessionSecret) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [scope, expiresAt, signature] = decoded.split(":");

    if (scope !== "admin" || !expiresAt || !signature) {
      return false;
    }

    if (Number.isNaN(Number(expiresAt)) || Date.now() > Number(expiresAt)) {
      return false;
    }

    return timingSafeMatch(signature, sign(`${scope}:${expiresAt}`, sessionSecret));
  } catch {
    return false;
  }
}

function buildCookie(value, secureCookies, maxAgeSeconds) {
  const attributes = [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (secureCookies) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function isAuthenticatedRequest(req) {
  const { sessionSecret } = getConfig();
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[ADMIN_SESSION_COOKIE];

  return typeof token === "string" && verifySessionToken(token, sessionSecret);
}

function setSessionCookie(res) {
  const { sessionSecret, secureCookies } = getConfig();
  res.setHeader("Set-Cookie", buildCookie(buildSessionToken(sessionSecret), secureCookies, SESSION_DURATION_SECONDS));
}

function clearSessionCookie(res) {
  const { secureCookies } = getConfig();
  res.setHeader("Set-Cookie", buildCookie("", secureCookies, 0));
}

export async function handleLogin(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { message: "Method not allowed." });
    return;
  }

  const { adminPassword } = getConfig();
  if (!adminPassword) {
    json(res, 500, { message: "ADMIN_PASSWORD is not configured." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    json(res, 400, { message: "Invalid JSON body." });
    return;
  }

  const submittedPassword = typeof body.password === "string" ? body.password : "";

  if (!timingSafeMatch(submittedPassword, adminPassword)) {
    json(res, 401, { authenticated: false, message: "Incorrect password." });
    return;
  }

  setSessionCookie(res);
  json(res, 200, { authenticated: true });
}

export function handleLogout(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { message: "Method not allowed." });
    return;
  }

  clearSessionCookie(res);
  json(res, 200, { authenticated: false });
}

export function handleSession(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { message: "Method not allowed." });
    return;
  }

  json(res, 200, { authenticated: isAuthenticatedRequest(req) });
}
