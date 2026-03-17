// src/services/authService.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refresh: {
    token: string;
    expiresAt: string;
  };
  user: {
    id: string;
    username: string;
    role: "ADMIN" | "CASHIER" | "BARISTA";
  };
}




// Refresh response is different - no user object
export interface RefreshResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refresh: {
    token: string;
    expiresAt: string;
  };
}





export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Invalid credentials");
    throw new Error(`Login failed: ${res.statusText}`);
  }

  const data: LoginResponse = await res.json();

  setAccessToken(data.accessToken);
  setRefreshToken(data.refresh.token, data.refresh.expiresAt);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}


let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      logout();
      throw new Error("No refresh token available");
    }

    if (isRefreshTokenExpired()) {
      logout();
      throw new Error("Refresh token expired");
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/token/get-access-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!res.ok) {
      logout();
      throw new Error("Failed to refresh access token");
    }

    const data: RefreshResponse = await res.json();

    setAccessToken(data.accessToken);
    setRefreshToken(data.refresh.token, data.refresh.expiresAt);

    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}




export async function authFetch(url: string, options: RequestInit = {}) {
  let token = getAccessToken();

  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    token = await refreshAccessToken();

    const retryHeaders: HeadersInit = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    return fetch(url, {
      ...options,
      headers: retryHeaders,
    });
  }

  return res;
}





export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}



export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}



export function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}



// NEW: Setter for refresh token with expiresAt
export function setRefreshToken(token: string, expiresAt: string) {
  localStorage.setItem("refreshToken", token);
  localStorage.setItem("refreshExpiresAt", expiresAt);
}



export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("refreshExpiresAt");
  localStorage.removeItem("user");
}



export function isRefreshTokenExpired(): boolean {
  const expiresAt = localStorage.getItem("refreshExpiresAt");
  if (!expiresAt) return true;
  
  const expiryTime = new Date(expiresAt).getTime();
  return expiryTime < (Date.now() + 5000); // 5s buffer
}



export function getUser(): LoginResponse["user"] | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}



export function logout() {
  clearAuth();
  window.location.href = "/login";
}



export function getUserRole(): string | null {
  const user = getUser();
  return user?.role || null;
}



export function hasRole(role: string): boolean {
  return getUserRole() === role;
}