const { useSecureCookies } = require("../config/env");

const COOKIE_NAME = "cuore_order_access";
const COOKIE_MAX_AGE_SECONDS = 6 * 60 * 60;

function serializeOrderAccessCookie(tradeNo, accessToken) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(`${tradeNo}.${accessToken}`)}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (useSecureCookies) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function getCookieValue(cookieHeader, cookieName) {
  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!match) {
    return null;
  }

  return match.slice(cookieName.length + 1);
}

function parseOrderAccessCookie(cookieHeader) {
  const rawValue = getCookieValue(cookieHeader, COOKIE_NAME);

  if (!rawValue) {
    return null;
  }

  const decoded = decodeURIComponent(rawValue);
  const [tradeNo, accessToken] = decoded.split(".");

  if (!tradeNo || !accessToken) {
    return null;
  }

  return { tradeNo, accessToken };
}

function hasOrderAccess(req, order) {
  const access = parseOrderAccessCookie(req.headers.cookie);

  return Boolean(
    access &&
    access.tradeNo === order.tradeNo &&
    access.accessToken === order.accessToken,
  );
}

module.exports = {
  COOKIE_NAME,
  hasOrderAccess,
  parseOrderAccessCookie,
  serializeOrderAccessCookie,
};
