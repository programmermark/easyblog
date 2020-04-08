import React, { useState } from 'react'
import '../public/style/components/articletype.css'

const ArticleType = (props) => {

    const [ selectedType, setSelectedType ] = useState(props.types[0])

    const changeArticleType = (type)=>{
        if (selectedType !== type) {
            setSelectedType(type)
            props.changeType(type)
        }
    }

    return (
        <div className="type-wrapper">
            <span className="title">文章类别：</span>
            {
                props.types.map((item, index) => {
                    return (
                        <div 
                            className={`type-item ${selectedType === item? "active": ""}`} 
                            key={index}
                            onClick={changeArticleType.bind(this, item)}>
                            {item}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ArticleType