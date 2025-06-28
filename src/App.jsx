// Importing React (optional in latest versions, but good practice for clarity)
// eslint-disable-next-line no-unused-vars
import React from 'react';

// Importing the CurrencyConverter component
import CurrencyConverter from './CurrencyConverter';

// App component is the root of your React application
function App() {
  return (
    <div>
      {/* Render the Currency Converter tool */}
      <CurrencyConverter />
    </div>
  );
}

// Exporting the App component so it can be used in index.jsx
export default App;
