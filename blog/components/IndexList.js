import React , { useState, useEffect } from 'react'
import TalkItem from './TalkItem'
import ArticleItem from './ArticleItem'
import NovelItem from './NovelItem'
import { Badge, Spin, Pagination } from 'antd'
import '../public/style/components/indexlist.css'
import axios from 'axios'
import { servicePath } from '../config/apiBaseUrl'


const List  = (props)=>{ // 首页的列表块
  const selectedColor = '#52c41a'
  const unSelectedColor = '#ff4d4f'
  const pageSize = 10

  const [ tabs, setTabs ] = useState([
    // { name: '全部', type: 'all', count: 0, color: selectedColor },
    { name: '文章', type: 'article', count: 0, color: selectedColor },
    { name: '说说', type: 'talk', count: 0, color: unSelectedColor },
    { name: '小说', type: 'novel', count: 0,  color: unSelectedColor }
  ])
  const [ isLoading, setIsloading ] = useState(false)
  const [ selectedIndex, setSelectedIndex ] = useState(0)
  const [ current, setCurrent ] = useState(1)
  const [ total, setTotal ] = useState(0)
  const [ list, setList ] = useState([])

  const changeTab = (index)=> {
    setSelectedIndex(index)
    const tabsClone = JSON.parse(JSON.stringify(tabs))
    tabsClone.forEach((tabsItem, tabsIndex)=>{
      if(tabsIndex === index){
        tabsItem.color = selectedColor
      } else {
        tabsItem.color = unSelectedColor
      }
    })
    setTabs(tabsClone)
    const listType = tabs[index].type
    getTalkList(listType)
  }

  const getTalkList = (type, pagesize = pageSize, currentPage = current)=>{
    if (!type) {
      tabs.forEach(item=>{
        if (item.color === selectedColor) {
          type = item.type
        }
      })
    }
    let requestUrl = ''
    switch (type) {
      case 'all':
        requestUrl = servicePath.getTalkList
        break;
      case 'article':
        requestUrl = servicePath.getArticleList
        break;
      case 'talk':
        requestUrl = servicePath.getTalkList
        break;
      case 'novel':
        requestUrl = servicePath.getNovelList
        break;
    
      default :
        requestUrl = servicePath.getTalkList
        break;
    }
    setIsloading(true)
    axios({
      method: 'post',
      url: requestUrl,
      data: {
        limit: pagesize,
        offset: (currentPage - 1) * pagesize
      }
    })
      .then(res=>{
        const result = res.data
        if (result.success) {
          setTotal(result.data.total)
          setList(result.data.list)
          console.log(list)
        }
        setIsloading(false)
      })
  }

  const addLikeNum = (id)=>{ // 增加点赞数：针对说说
    const listClone = JSON.parse(JSON.stringify(list))
    for (const item of listClone) {
      if (item.listType === 'talk' && item.id === id) {
        item.likeCount++
      }
    }
    setList(listClone)
  }

  const changePage = (page, pageSize)=>{
    let type = ''
    tabs.forEach(item=>{
      if (item.color === selectedColor) {
        type = item.type
      }
    })
    setCurrent(page)
    getTalkList(type, pageSize, page)
  }

  useEffect(()=>{
    getTalkList()
    const list = JSON.parse(JSON.stringify(tabs))
    list.forEach(item=>{
      if(item.type === 'article'){
        item.count = props.userInfo.articleCount
      } else if (item.type === 'talk') {
        item.count = props.userInfo.talkCount
      }
    })
  }, [])
  
  return (
    <div className="list-container">
      <div className="tab-container">
        <div>
          {
            tabs.map((item, index)=> {
              return (
                <Badge 
                  className="badge" 
                  count={item.count} 
                  key={index + item.type}
                  style={{'backgroundColor': item.color}} >
                  <div 
                    className={`tab-item ${selectedIndex === index? 'actived': null}`} 
                    onClick={changeTab.bind(this, index)}>{item.name}</div>
                </Badge>
              )
            })
          }
        </div>
        <div className="type-line" style={{'transform': `translateX(${selectedIndex * 6}rem)`}}></div>
      </div>
      <div>
      <Spin spinning={isLoading} tip={'加载中...'}>
        {
          list.map((item, index) => {
            return (
              <div key={index + item.publishTime}> 
              {
                item.listType === 'talk' &&
                <TalkItem  
                  talkItem={item} 
                  addLikeNum={addLikeNum}
                  />
              }
              {
                item.listType === 'article' &&
                <ArticleItem article={item} />
              }
              {
                item.listType === 'novel' &&
                <NovelItem novel={item} />
              }
              </div>
            )
          })
        }
          <Pagination
            className="page"
            current={current}
            total={total}
            showTotal={total => `共 ${total} 条记录`}
            pageSize={pageSize}
            defaultCurrent={current}
            showQuickJumper
            onChange={changePage}
          />
        </Spin>
      </div>
    </div>
  )
}

export default List