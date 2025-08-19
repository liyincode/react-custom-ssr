import React, { useState } from 'react';
import './App.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1 className="title">Hello Custom SSR!</h1>
            <p>This page is rendered on the server.</p>
            <div className="counter">
                <p>You clicked {count} times </p>
                <button onClick={() => setCount(count + 1)}>
                    Click me
                </button>
            </div>
        </div>
    );
}

export default App;
