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

export interface Strategy {
    id:         number;
    user_id:    number;
    name:       string;
    steps:      StrategyStep[];
    created_at: string;
    updated_at: string;
}

export interface CreateStrategyPayload {
    name:  string;
    steps: { position: number; title?: string; content: string }[];
}

export const strategyApi = {
    getAll(accessToken: string): Promise<Strategy[]> {
        return request("/strategies", {}, accessToken);
    },

    create(payload: CreateStrategyPayload, accessToken: string): Promise<Strategy> {
        return request("/strategies", { method: "POST", body: JSON.stringify(payload) }, accessToken);
    },
};
