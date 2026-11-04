type ErrorLike = {
  message?: string;
  code?: string;
  response?: { status?: number };
  config?: { url?: unknown };
};

/**
 * An axios error carries `config.headers` (api_key, authtoken), the request body
 * (e.g. a login password) and a URL that may hold a query string. Log this summary
 * instead of the whole error: message, status, code and the URL without query.
 */
export const safeError = (error: unknown) => {
  const e = (error ?? {}) as ErrorLike;
  return {
    message: e.message,
    status: e.response?.status,
    code: e.code,
    url: typeof e.config?.url === "string" ? e.config.url.split("?")[0] : undefined,
  };
};
