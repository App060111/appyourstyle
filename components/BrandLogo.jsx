export default function BrandLogo({brand}){return <div className="logoMark" aria-label={`${brand.name} logo placeholder`}>{brand.logoText || brand.name.slice(0,3).toUpperCase()}</div>}
