const KEY = "tj_access_token";

export const token = {
    get: (): string | null =>
        typeof window !== "undefined" ? localStorage.getItem(KEY) : null,

    set: (value: string): void =>
        localStorage.setItem(KEY, value),

    clear: (): void =>
        localStorage.removeItem(KEY),
};
