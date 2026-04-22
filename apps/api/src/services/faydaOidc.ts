/**
 * Fayda eSignet OIDC Service
 *
 * When FAYDA_MOCK=true:  Returns simulated OIDC responses (no real eSignet required)
 * When FAYDA_MOCK=false: Makes real HTTP requests to the Fayda eSignet IdP
 *
 * To switch to production, update these in .env:
 *   FAYDA_MOCK=false
 *   FAYDA_ISSUER=https://esignet.camdgc.gov.et
 *   FAYDA_CLIENT_ID=<your_registered_client_id>
 *   FAYDA_PRIVATE_KEY_JWK=<base64_encoded_rsa_jwk>
 */

import { v4 as uuidv4 } from "uuid";
import { config } from "../config/env";
import { logger } from "../utils/logger";
import type { FaydaUserInfo } from "@donorlink/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OidcDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
}

interface TokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

// ─── State/Nonce Store (in-memory for dev, Redis for prod) ────────────────────

const stateStore = new Map<string, { nonce: string; role: string; createdAt: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of stateStore) {
    if (now - val.createdAt > 10 * 60 * 1000) stateStore.delete(key); // 10 min TTL
  }
}, 5 * 60 * 1000);

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, FaydaUserInfo> = {
  "mock-donor-001": {
    sub: "pairwise-sub-donor-001",
    name: "Abebe Kebede",
    gender: "male",
    birthdate: "1992-03-15",
    phone_number: "+251912345678",
    phone_number_verified: true,
    address: { region: "Addis Ababa", city: "Addis Ababa" },
  },
  "mock-donor-002": {
    sub: "pairwise-sub-donor-002",
    name: "Tigist Haile",
    gender: "female",
    birthdate: "1988-07-22",
    phone_number: "+251923456789",
    phone_number_verified: true,
    address: { region: "Oromia", city: "Adama" },
  },
  "mock-admin-001": {
    sub: "pairwise-sub-admin-001",
    name: "Dr. Sara Mulugeta",
    gender: "female",
    birthdate: "1985-01-10",
    phone_number: "+251934567890",
    phone_number_verified: true,
    address: { region: "Addis Ababa", city: "Addis Ababa" },
  },
};

let mockUserIndex = 0;
const mockUserKeys = Object.keys(MOCK_USERS);

// ─── Discovery ────────────────────────────────────────────────────────────────

let cachedDiscovery: OidcDiscovery | null = null;

export async function discoverOidcConfig(): Promise<OidcDiscovery> {
  if (cachedDiscovery) return cachedDiscovery;

  if (config.FAYDA_MOCK) {
    cachedDiscovery = {
      issuer: config.FAYDA_ISSUER,
      authorization_endpoint: `${config.FAYDA_ISSUER}/authorize`,
      token_endpoint: `${config.FAYDA_ISSUER}/oauth/token`,
      userinfo_endpoint: `${config.FAYDA_ISSUER}/oidc/userinfo`,
      jwks_uri: `${config.FAYDA_ISSUER}/oauth/jwks`,
    };
    return cachedDiscovery;
  }

  // Real discovery
  const url = `${config.FAYDA_ISSUER}/.well-known/openid-configuration`;
  logger.info("Fetching OIDC discovery", { url });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`OIDC discovery failed: ${response.status}`);
  cachedDiscovery = (await response.json()) as OidcDiscovery;
  return cachedDiscovery;
}

// ─── Authorization URL ────────────────────────────────────────────────────────

export function generateStateAndNonce(role: string): { state: string; nonce: string } {
  const state = uuidv4();
  const nonce = uuidv4();
  stateStore.set(state, { nonce, role, createdAt: Date.now() });
  return { state, nonce };
}

export function validateState(state: string): { nonce: string; role: string } | null {
  const entry = stateStore.get(state);
  if (!entry) return null;
  stateStore.delete(state); // one-time use
  return entry;
}

export async function buildAuthorizationUrl(role: string): Promise<{ url: string; state: string }> {
  const discovery = await discoverOidcConfig();
  const { state, nonce } = generateStateAndNonce(role);

  const acrValues = role === "donor" ? config.FAYDA_DONOR_ACR : config.FAYDA_RECIPIENT_ACR;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.FAYDA_CLIENT_ID,
    redirect_uri: config.FAYDA_REDIRECT_URI,
    scope: "openid profile",
    state,
    nonce,
    acr_values: acrValues,
    ui_locales: "en am",
    display: "page",
  });

  // Request specific claims per role
  const claims = {
    userinfo: {
      name: { essential: true },
      gender: { essential: true },
      birthdate: { essential: true },
      ...(role === "donor" ? { picture: null } : { phone_number: { essential: true } }),
    },
  };
  params.set("claims", JSON.stringify(claims));

  const url = `${discovery.authorization_endpoint}?${params.toString()}`;

  if (config.FAYDA_MOCK) {
    // In mock mode, return a URL that points back to our own callback with a mock code
    const mockCode = `mock-code-${uuidv4().slice(0, 8)}`;
    const mockUrl = `${config.FAYDA_REDIRECT_URI}?code=${mockCode}&state=${state}`;
    logger.info("Mock Fayda auth URL generated", { state, mockCode });
    return { url: mockUrl, state };
  }

  return { url, state };
}

// ─── Token Exchange ───────────────────────────────────────────────────────────

export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  if (config.FAYDA_MOCK) {
    logger.info("Mock token exchange", { code });
    // Cycle through mock users
    const mockKey = mockUserKeys[mockUserIndex % mockUserKeys.length];
    mockUserIndex++;

    return {
      access_token: `mock-access-${uuidv4().slice(0, 12)}`,
      id_token: `mock-id-token.${Buffer.from(JSON.stringify({
        iss: config.FAYDA_ISSUER,
        sub: MOCK_USERS[mockKey].sub,
        aud: config.FAYDA_CLIENT_ID,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        nonce: "mock-nonce",
      })).toString("base64")}.mock-signature`,
      token_type: "Bearer",
      expires_in: 3600,
    };
  }

  // Real token exchange with private_key_jwt
  const discovery = await discoverOidcConfig();
  const clientAssertion = await buildClientAssertion(discovery.token_endpoint);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.FAYDA_REDIRECT_URI,
    client_id: config.FAYDA_CLIENT_ID,
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: clientAssertion,
  });

  const response = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const err = await response.text();
    logger.error("Token exchange failed", { status: response.status, body: err });
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  return response.json() as Promise<TokenResponse>;
}

// ─── Client Assertion (private_key_jwt) ───────────────────────────────────────

async function buildClientAssertion(tokenEndpoint: string): Promise<string> {
  // Dynamic import of jose for RSA signing
  const { SignJWT, importJWK } = await import("jose");

  if (!config.FAYDA_PRIVATE_KEY_JWK) {
    throw new Error("FAYDA_PRIVATE_KEY_JWK not configured — set in .env or use FAYDA_MOCK=true");
  }

  const jwk = JSON.parse(Buffer.from(config.FAYDA_PRIVATE_KEY_JWK, "base64").toString("utf-8"));
  const privateKey = await importJWK(jwk, config.FAYDA_ALGORITHM);

  const assertion = await new SignJWT({})
    .setProtectedHeader({ alg: config.FAYDA_ALGORITHM, kid: jwk.kid })
    .setIssuer(config.FAYDA_CLIENT_ID)
    .setSubject(config.FAYDA_CLIENT_ID)
    .setAudience(tokenEndpoint)
    .setExpirationTime("5m")
    .setIssuedAt()
    .setJti(uuidv4())
    .sign(privateKey);

  return assertion;
}

// ─── ID Token Validation ──────────────────────────────────────────────────────

export async function validateIdToken(idToken: string, expectedNonce: string): Promise<any> {
  if (config.FAYDA_MOCK) {
    logger.info("Mock ID token validation — skipping signature check");
    // Decode the mock payload
    const parts = idToken.split(".");
    if (parts.length >= 2) {
      try {
        return JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
      } catch {
        return { sub: "mock-sub", nonce: "mock-nonce" };
      }
    }
    return { sub: "mock-sub", nonce: "mock-nonce" };
  }

  // Real validation using JWKS
  const { jwtVerify, createRemoteJWKSet } = await import("jose");
  const discovery = await discoverOidcConfig();
  const JWKS = createRemoteJWKSet(new URL(discovery.jwks_uri));

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: config.FAYDA_ISSUER,
    audience: config.FAYDA_CLIENT_ID,
  });

  if (payload.nonce !== expectedNonce) {
    throw new Error("ID token nonce mismatch — possible replay attack");
  }

  return payload;
}

// ─── UserInfo ─────────────────────────────────────────────────────────────────

export async function fetchUserInfo(accessToken: string): Promise<FaydaUserInfo> {
  if (config.FAYDA_MOCK) {
    // Return the current mock user based on their access token
    const key = mockUserKeys[(mockUserIndex - 1) % mockUserKeys.length];
    const user = MOCK_USERS[key];
    logger.info("Mock userinfo returned", { sub: user.sub, name: user.name });
    return user;
  }

  const discovery = await discoverOidcConfig();
  const response = await fetch(discovery.userinfo_endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`UserInfo request failed: ${response.status}`);
  }

  return response.json() as Promise<FaydaUserInfo>;
}
