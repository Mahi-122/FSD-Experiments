// Authentication Service

const users = [
  {
    id: "1",
    name: "Mahi",
    email: "mahi@gmail.com",
    password: "12345",
    role: "Viewer",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@gmail.com",
    password: "12345",
    role: "Admin",
  },
  {
    id: "3",
    name: "Editor User",
    email: "editor@gmail.com",
    password: "12345",
    role: "Editor",
  },
];

// Verify user credentials
export function verifyCredentials(email, password) {
  return users.find(
    (user) =>
      user.email === email && user.password === password
  );
}

// Generate a simulated JWT-style token
export function generateToken(user) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Date.now() + 60 * 60 * 1000,
  };

  const encode = (data) =>
    btoa(JSON.stringify(data));

  return `${encode(header)}.${encode(payload)}.simulated-signature`;
}

// Decode the simulated JWT token
export function decodeToken(token) {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

// Check whether token has expired
export function isTokenExpired(token) {
  if (!token) {
    return true;
  }

  const payload = decodeTokenWithoutExpiryCheck(token);

  if (!payload || !payload.exp) {
    return true;
  }

  return Date.now() > payload.exp;
}

// Decode token without checking expiry
function decodeTokenWithoutExpiryCheck(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

// Simulate refresh token
export function refreshAccessToken(token) {
  const payload = decodeTokenWithoutExpiryCheck(token);

  if (!payload) {
    return null;
  }

  return generateToken({
    id: payload.userId,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  });
}