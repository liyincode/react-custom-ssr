import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from '../../src/App';

const root = document.getElementById('root');

if (root) {
    hydrateRoot(root, <App />);
}
