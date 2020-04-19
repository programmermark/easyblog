import React from 'react'
import Link from 'next/link'
import marked from 'marked'
import '../public/style/components/noveldetailed.css'

const NovelDetailed = (props)=>{
  const novel = props.novel
  const chapterList = props.chapterList
  const chapterLength = Math.floor(chapterList.length / 3) * 3
  const chapterObj = {
    list: chapterList.slice(0, chapterLength),
    subList: chapterList.slice(chapterLength, chapterList.length)
  }

  const renderer = new marked.Renderer()
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: false,
    highlight: function(code){
      return hljs.highlightAuto(code).value;
    }
  })

  return (
    <div className='novel-detailed'>
      <div className='novel-info'>
        <div className='info-left'>
          <img className='img' src={novel.novelCoverImg} title={novel.novelName} />
        </div>
        <div className='info-right'>
          <div className='sub-info info-first'>
            <div className='novel-name'>{novel.novelName}</div>
            <div className='author'>
              <Link href='/about'>
                <a className='name'>{novel.author}</a>
              </Link>
              著</div>
            <div className='create-time'>小说始连载于{novel.novelCreateTime}</div>
          </div>
          <div
            className='sub-info info-second' 
            dangerouslySetInnerHTML={{__html: marked(novel.novelSummary)}}></div>
        </div>
      </div>
      <div className='chapter-list'>
        <div className='head'>
          <h3>全部章节（共{chapterList.length}章）</h3>
        </div>
        <div className='list-content'>
          {
            chapterObj.list.map((item)=>{
              return (
                <Link href={`/chapterdetail?id=${item.chapterId}`} key={item.chapterId}>
                  <a className='chapter-item'>{item.chapterName}</a>
                </Link>
              )
            })
          }
          {
            chapterObj.subList.map((item)=>{
              return (
                <Link href={`/chapterdetail?id=${item.chapterId}`} key={item.chapterId}>
                  <a className='chapter-item last-chapter-item'>{item.chapterName}</a>
                </Link>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default NovelDetailed