export default function Header(){
  return (
    <div className="nav">
      <a className="logo" href="/">AppYourStyle</a>
      <div className="navlinks">
        <a href="/">Converter</a>
        <a href="/brands">Brands</a>
        <a href="/size-guides">Guides</a>
        <a className="hideMobile" href="/nike-to-zara-size">Nike→Zara</a>
        <a className="hideMobile" href="/adidas-vs-hm-fit">Adidas vs H&M</a>
        <a href="/eu-42-to-us-men">EU42→US</a>
        <a href="/faq">FAQ</a>
      </div>
    </div>
  )
}
