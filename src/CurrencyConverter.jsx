// Import dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { currencyOptions } from './currencyData';
import './CurrencyConverter.css';

// ===========================
// Custom dropdown value (selected item with flag)
// ===========================
const customSingleValue = ({ data }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img
      src={`https://flagcdn.com/w40/${data.countryCode}.png`} // Fetch flag image using country code
      alt={data.label}
      style={{ width: '20px', marginRight: '10px' }}
    />
    {data.label}
  </div>
);

// ===========================
// Custom dropdown option (with flag + label)
// ===========================
const customOption = ({ data, innerRef, innerProps, isFocused }) => (
  <div
    ref={innerRef}
    {...innerProps}
    style={{
      backgroundColor: isFocused ? '#e0e7ff' : 'white', // Highlight focused option
      padding: '10px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    }}
  >
    <img
      src={`https://flagcdn.com/w40/${data.countryCode}.png`}
      alt={data.label}
      style={{ width: '20px', marginRight: '10px' }}
    />
    {data.label}
  </div>
);

// ===========================
// Main Component
// ===========================
const CurrencyConverter = () => {
  // State declarations
  const [amount, setAmount] = useState(1); // amount to convert
  const [fromCurrency, setFromCurrency] = useState(currencyOptions[0]); // selected source currency
  const [toCurrency, setToCurrency] = useState(currencyOptions[1]); // selected target currency
  const [convertedAmount, setConvertedAmount] = useState(null); // result of conversion
  const [loading, setLoading] = useState(false); // show/hide loader
  const [error, setError] = useState(''); // show error message
  const [darkMode, setDarkMode] = useState(false); // theme toggle

  // Fetch conversion rate using API
  const fetchConversionRate = () => {
    if (amount <= 0) return;

    setLoading(true);
    setError('');

    fetch(`https://v6.exchangerate-api.com/v6/5b07a22edde3a47a2e5e937e/latest/${fromCurrency.value}`)
      .then((res) => res.json())
      .then((data) => {
        const rate = data.conversion_rates[toCurrency.value];
        setConvertedAmount((amount * rate).toFixed(2)); // calculate converted value
      })
      .catch((err) => {
        setError('Failed to fetch conversion rate.');
        console.error(err);
      })
      .finally(() => setLoading(false)); // hide loader
  };

  return (
    <div className={`converter-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Theme toggle button */}
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      <h1>Currency Converter</h1>

      {/* Inputs and dropdowns */}
      <div className="input-group">
        {/* Amount input field */}
        <input
          type="number"
          value={amount}
          min="0"
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Source currency dropdown */}
        <Select
          value={fromCurrency}
          onChange={setFromCurrency}
          options={currencyOptions}
          components={{ SingleValue: customSingleValue, Option: customOption }}
          className="select-container"
          isSearchable
        />

        {/* Target currency dropdown */}
        <Select
          value={toCurrency}
          onChange={setToCurrency}
          options={currencyOptions}
          components={{ SingleValue: customSingleValue, Option: customOption }}
          className="select-container"
          isSearchable
        />

        {/* Convert button */}
        <button className="convert-btn" onClick={fetchConversionRate}>
          Convert
        </button>
      </div>

      {/* Loader / Error / Result */}
      {loading ? (
        <div className="loader" /> // spinner shown while fetching
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p> // error message
      ) : (
        convertedAmount !== null && (
          <p>
            {amount} {fromCurrency.value} = {convertedAmount} {toCurrency.value}
          </p>
        )
      )}
    </div>
  );
};

// ===========================
// Prop type validation for custom components
// ===========================
customSingleValue.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    countryCode: PropTypes.string.isRequired,
  }).isRequired,
};

customOption.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    countryCode: PropTypes.string.isRequired,
  }).isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  innerProps: PropTypes.object,
  isFocused: PropTypes.bool,
};

export default CurrencyConverter;
