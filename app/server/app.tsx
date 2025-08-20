import {
  dehydrate,
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Context } from "koa";
import { matchRoutes } from "react-router-dom";
import { routes } from "@/routes";
import { StaticRouter } from "react-router-dom/server";
import App from "@/index";

export default async function renderApp(ctx: Context) {
  const queryClient = new QueryClient();
  const prefetchRoutes = matchRoutes(routes, ctx.req.url ?? "");

  if (prefetchRoutes) {
    const promiseRoutes = prefetchRoutes
      .map(({ route, params }) => {
        if (route?.queryKey && route?.loadData) {
          const queryKey = typeof route.queryKey === 'function' 
            ? route.queryKey(params) 
            : route.queryKey;

          console.log("🔥 [SSR] 预取数据 - QueryKey:", JSON.stringify(queryKey), "Params:", params);
          const loadData = route.loadData(params);
          return queryClient.prefetchQuery({
            queryKey,
            queryFn: () => loadData,
          });
        }
        return null;
      })
      .filter((promise) => promise !== null);

    if (promiseRoutes.length > 0) {
      await Promise.all(promiseRoutes);
      console.log(`✅ 成功预取 ${promiseRoutes.length} 个查询`);
    }
  }

  // 脱水处理，将数据转换为字符串，用于后续的 html 渲染
  const dehydratedState = dehydrate(queryClient);
  ctx.dehydratedState = dehydratedState;
  ctx.queryClient = queryClient;

  return (
    <StaticRouter location={ctx.req.url || "/"}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <App context={ctx} />
        </HydrationBoundary>
      </QueryClientProvider>
    </StaticRouter>
  );
}
