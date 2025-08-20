import { Params, RouteObject } from "react-router-dom";
import { QueryKey } from "@tanstack/react-query";
import loadable from "@loadable/component";
import { api } from "./api";

const Home = loadable(() => import("./Home"), { ssr: true });
const Post = loadable(() => import("./Post"), { ssr: true });

type PrefetchRouteObject = RouteObject & {
  queryKey?: QueryKey | ((params: Params<string>) => QueryKey);
  loadData?: (params: Params<string>) => Promise<unknown>;
};

export const routes: PrefetchRouteObject[] = [
  {
    path: "/",
    element: <Home />,
    queryKey: ["home-data"],
    loadData: () => api.getHomeData(),
  },
  {
    path: "/post/:id",
    element: <Post />,
    queryKey: (params: Params<string>) => ["post", params.id!],
    loadData: (params: Params<string>) => api.getPostById(params.id!),
  },
];
