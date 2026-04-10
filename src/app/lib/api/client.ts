type ApiError = { error?: string; errors?: { message: string }[] };

export async function request<T>(
    path: string,
    options: RequestInit = {},
    token?: string,
): Promise<T> {
    const headers: Record<string, string> = {
        ...(options.body && !(options.body instanceof FormData)
            ? { "Content-Type": "application/json" }
            : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> | undefined),
    };

    const res = await fetch(`/api${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        const body = data as ApiError;
        throw new Error(
            body.error ?? body.errors?.[0]?.message ?? "Request failed",
        );
    }

    return data as T;
}
