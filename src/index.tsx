import './index.css';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { Context } from 'koa';
import { KoaProvider } from '@app/client/KoaContext';

interface AppProps {
  context?: Context;
}

function App(props: AppProps) {
    const renderRoutes = useRoutes(routes);

    return (
        <KoaProvider value={props?.context || null}>
            {renderRoutes}
        </KoaProvider>
    )
}

export default App;
