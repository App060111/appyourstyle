'use client';import{useState}from'react';
export default function Accordion({items}){const[open,setOpen]=useState(0);return <div className="accordion">{items.map((it,i)=><div className="accItem" key={it.title}><button onClick={()=>setOpen(open===i?-1:i)}><span>{it.title}</span><span>{open===i?'−':'+'}</span></button>{open===i&&<div className="accBody">{it.body}</div>}</div>)}</div>}
