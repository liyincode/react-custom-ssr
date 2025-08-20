import { createContext } from "react";
import { Context } from "koa";

const KoaContext = createContext<Context | null>(null);

export const KoaProvider = KoaContext.Provider;

