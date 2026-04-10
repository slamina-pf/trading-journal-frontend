import { request } from "./client";

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    access_token: string;
    user: AuthUser;
}

export const authApi = {
    register(payload: {
        username: string;
        email: string;
        password: string;
        bio?: string;
    }): Promise<AuthResponse> {
        return request("/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    login(payload: { email: string; password: string }): Promise<AuthResponse> {
        return request("/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    uploadAvatar(file: File, token: string): Promise<{ avatar_url: string }> {
        const formData = new FormData();
        formData.append("avatar", file);
        return request("/auth/account/avatar", { method: "POST", body: formData }, token);
    },
};
