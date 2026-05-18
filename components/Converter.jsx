'use client';

import { useState } from 'react';

export default function Converter() {
  const [fromBrand, setFromBrand] = useState('Nike');
  const [toBrand, setToBrand] = useState('Zara');
  const [size, setSize] = useState('M');
  const [result, setResult] = useState(null);

  async function run() {
    const res = await fetch('/api/convert', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({fromBrand,toBrand,size})
    });
    setResult(await res.json());
  }

  return (
    <div className="card">
      <h2>Größe sofort übersetzen</h2>
      <p>Ohne Login. Ohne App. Ohne Extension.</p>
      <div className="converter">
        <select value={fromBrand} onChange={e=>setFromBrand(e.target.value)}>
          <option>Nike</option><option>Zara</option><option>Adidas</option><option>H&M</option><option>Gucci</option><option>ASOS</option>
        </select>
        <select value={size} onChange={e=>setSize(e.target.value)}>
          <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
        </select>
        <select value={toBrand} onChange={e=>setToBrand(e.target.value)}>
          <option>Zara</option><option>Nike</option><option>Adidas</option><option>H&M</option><option>Gucci</option><option>ASOS</option>
        </select>
        <button onClick={run}>Jetzt übersetzen</button>
      </div>
      {result && (
        <div className="result">
          <div>{result.fromBrand} {result.inputSize} entspricht ungefähr</div>
          <strong>{result.toBrand} {result.outputSize}</strong>
          <p>{result.note}</p>
          <p>Retourenrisiko: {result.returnRisk}</p>
        </div>
      )}
    </div>
  );
}
