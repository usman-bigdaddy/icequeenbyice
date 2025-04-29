import jwt from "jsonwebtoken";

export function signJwt(payload) {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET, { expiresIn: "30d" });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET);
  } catch (error) {
    return null;
  }
}
