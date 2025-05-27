import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [average, setAverage] = useState(null);
  const [error, setError] = useState(null);

  const calculateAverage = async () => {
    setError(null);
    const numbers = input.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));

    if (numbers.length === 0) {
      setError('Please enter valid numbers separated by commas');
      setAverage(null);
      return;
    }

    try {
      const response = await fetch('http://localhost:9876/number/e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers }),
      });
      const data = await response.json();
      if (response.ok) {
        setAverage(data.average);
      } else {
        setError(data.error || 'Something went wrong');
        setAverage(null);
      }
    } catch (err) {
      setError('Failed to connect to backend');
      setAverage(null);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', fontFamily: 'Arial' }}>
      <h1>Average Calculator</h1>
      <input
        type="text"
        placeholder="Enter numbers separated by commas"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />
      <button onClick={calculateAverage} style={{ marginTop: 10, padding: '8px 12px' }}>
        Calculate Average
      </button>
      {average !== null && (
        <div style={{ marginTop: 20 }}>
          <strong>Average:</strong> {average}
        </div>
      )}
      {error && (
        <div style={{ marginTop: 20, color: 'red' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
