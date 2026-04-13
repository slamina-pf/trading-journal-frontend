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

    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

    if (res.status === 401 && token) {
        localStorage.removeItem("tj_access_token");
        window.location.replace("/auth/login");
        throw new Error("Session expired. Please log in again.");
    }

    if (!res.ok) {
        if (typeof data === "string") throw new Error(data || "Request failed");
        const body = data as ApiError;
        throw new Error(
            body.error ?? body.errors?.[0]?.message ?? "Request failed",
        );
    }

    return data as T;
}
