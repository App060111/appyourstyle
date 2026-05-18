'use client';

import { useState } from 'react';
import { brands } from '../lib/data';

export default function Converter(){
  const [fromBrand,setFromBrand] = useState('nike');
  const [toBrand,setToBrand] = useState('zara');
  const [inputSize,setInputSize] = useState('M');
  const [category,setCategory] = useState('tops');
  const [result,setResult] = useState(null);

  async function run(){
    const res = await fetch('/api/convert', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({fromBrand,toBrand,inputSize,category})
    });
    setResult(await res.json());
  }

  return (
    <div className="card">
      <h2>Größe sofort übersetzen</h2>
      <p>Alle Marken. Source-Logik. Confidence Score. Ohne Login.</p>
      <div className="converter">
        <select value={fromBrand} onChange={e=>setFromBrand(e.target.value)}>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={inputSize} onChange={e=>setInputSize(e.target.value)}>
          {['XXS','XS','S','M','L','XL','XXL','3XL','4XL'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={toBrand} onChange={e=>setToBrand(e.target.value)}>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          {['tops','pants','shoes','kids','baby','dresses','denim'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={run}>Jetzt übersetzen</button>
      </div>

      {result && (
        <div className="result">
          <div>{result.fromBrandName} {result.inputSize} entspricht ungefähr</div>
          <strong>{result.toBrandName} {result.outputSize}</strong>
          <p>{result.note}</p>
          <p>Confidence: {result.confidencePercent} · Quelle: {result.sourceType} · Risiko: {result.returnRisk}</p>
          <p>Fit: {result.fitType} · Kategorie: {result.category} · Aktualisiert: {result.updatedAt}</p>
        </div>
      )}
    </div>
  )
}
