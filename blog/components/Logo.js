import react, { useState } from 'react'
import Link from 'next/link'
import '../public/style/components/logo.css'


const Logo = ()=>{

  const [logoName, setLogoName] = useState('雄心壮志')
  const [logoSubText, setLogoSubText] = useState('前端工程师，梦想家')

  return (
    <div className="logo-container">
      <Link href="/">
        <a className="logo-name">{logoName}</a>
      </Link>
      <div className="sub-text">{logoSubText}</div>
    </div>
  )
}

export default Logo