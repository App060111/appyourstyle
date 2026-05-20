export default function BrandLogo({brand}){return <div className='logoMark'>{brand.logoText||brand.name.slice(0,3).toUpperCase()}</div>}
