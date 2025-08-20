import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import App from '@/index';
import { loadableReady } from '@loadable/component';

const root = document.getElementById('root');

if (root) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, 
                refetchOnMount: false,    
                refetchOnWindowFocus: false, 
                refetchOnReconnect: false,  
            },
        },
    });
    
    // 获取服务端脱水的状态
    const getDehydratedState = () => {
        const scriptElement = document.getElementById('__REACT_QUERY_STATE__');
        if (scriptElement) {
            try {
                return JSON.parse(scriptElement.textContent || '{}');
            } catch (error) {
                console.error('Failed to parse dehydrated state:', error);
                return undefined;
            }
        }
        return undefined;
    };
    
    const dehydratedState = getDehydratedState();
    
    const AppComponent = (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={dehydratedState}>
                    <App />
                </HydrationBoundary>
            </QueryClientProvider>
        </BrowserRouter>
    );

    loadableReady(() => {
        hydrateRoot(root, AppComponent);
    })
}
