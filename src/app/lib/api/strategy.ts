import { request } from "./client";

export interface StrategyStep {
    id:          number;
    strategy_id: number;
    position:    number;
    title:       string | null;
    content:     string;
    created_at:  string;
    updated_at:  string;
}

export interface StrategyIndicator {
    id:          number;
    strategy_id: number;
    name:        string;
    description: string;
    created_at:  string;
    updated_at:  string;
}

export interface Strategy {
    id:         number;
    user_id:    number;
    name:       string;
    steps:      StrategyStep[];
    indicators: StrategyIndicator[];
    version:    number | null;
    created_at: string;
    updated_at: string;
}

export interface CreateStrategyPayload {
    name:       string;
    steps:      { position: number; title?: string; content: string }[];
    indicators: { name: string; description: string }[];
}

export interface UpdateStrategyPayload {
    name?:       string;
    steps?:      { position: number; title?: string; content: string }[];
    indicators?: { name: string; description: string }[];
}

export const strategyApi = {
    getAll(accessToken: string): Promise<Strategy[]> {
        return request("/strategies", {}, accessToken);
    },

    getOne(id: number, accessToken: string): Promise<Strategy> {
        return request(`/strategies/${id}`, {}, accessToken);
    },

    create(payload: CreateStrategyPayload, accessToken: string): Promise<Strategy> {
        return request("/strategies", { method: "POST", body: JSON.stringify(payload) }, accessToken);
    },

    update(id: number, payload: UpdateStrategyPayload, accessToken: string): Promise<Strategy> {
        return request(`/strategies/${id}`, { method: "PATCH", body: JSON.stringify(payload) }, accessToken);
    },

    delete(id: number, accessToken: string): Promise<void> {
        return request(`/strategies/${id}`, { method: "DELETE" }, accessToken);
    },
};
