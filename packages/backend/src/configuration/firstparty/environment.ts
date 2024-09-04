import {Env} from "hono/types";

interface IEnv extends Env {
    GOOGLE_MAPS_API_KEY: string;
}

export type {IEnv};