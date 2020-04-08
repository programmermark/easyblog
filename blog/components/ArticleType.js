import React, { useState, useEffect } from 'react'
import  { servicePath } from '../config/apiBaseUrl'
import axios from 'axios'
import '../public/style/components/articletype.css'

const ArticleType = (props) => {

    const [ types, setTypes] = useState(['全部', '点击量'])

    const [ selectedType, setSelectedType ] = useState(types[0])

    const changeArticleType = (type)=>{
        if (selectedType !== type) {
            setSelectedType(type)
            props.changeType(type)
        }
    }

    useEffect(() => {
        const fecthData = async () => {
            const result = await axios.get(`${servicePath.getArticleTypes}`)
                .then(res => {
                    const result = res.data.data
                    const list = ['全部']
                    result.forEach(item => {
                        list.push(item.name)
                    })
                    list.push('点击量')
                    return list
                })
                setTypes(result)    
        }
        fecthData()
    }, [])

    return (
        <div className="type-wrapper">
            <span className="title">文章类别：</span>
            {
                types.map((item, index) => {
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