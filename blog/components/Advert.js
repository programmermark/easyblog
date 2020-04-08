import React from 'react'
import '../public/style/components/advert.css'

const Advert = (props)=>{
  return (
    <div className="advert-container">
      {
        props.advertList && props.advertList.length > 0 &&
        props.advertList.map((item, index) => {
          return (
            <a href={item.url} target="_blank" key={index} className="advert-item" >
              <img src={item.img} />
            </a>
          )
        })
      }
    </div>
  )
}

export default Advert