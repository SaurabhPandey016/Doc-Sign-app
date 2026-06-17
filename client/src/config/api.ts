const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export const API_BASE_URL = configuredApiUrl || '';

export const apiUrl = (path: string) => {
  if (!API_BASE_URL) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};


export const fetchWithTimeout = async (path: string, options: RequestInit = {}, timeoutMs = 20000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(apiUrl(path), {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};
