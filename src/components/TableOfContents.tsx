'use client'

import {useState, useEffect} from 'react'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({content}: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const headings = content.match(/^#{1,3}\s.+$/gm) || []
    const tocItems = headings.map((heading) => {
      const level = heading.match(/^#+/)?.[0].length || 0
      const title = heading.replace(/^#+\s/, '')
      const id = title.toLowerCase().replace(/[^\w]+/g, '-')
      return {id, title, level}
    })
    setToc(tocItems)

    const contentElement = document.querySelector('.interview-content')
    if (contentElement) {
      contentElement.classList.toggle('ml-80', isOpen)
    }
  }, [content, isOpen])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const header = document.querySelector('header')
      const headerHeight = header ? header.offsetHeight : 0
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight - 20

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      element.style.scrollMarginTop = `${headerHeight + 20}px`

      setTimeout(() => {
        element.style.scrollMarginTop = ''
      }, 1000)
    }
  }
  return (
    <nav
      className={`bg-white dark:bg-slate-800 p-4 rounded-lg fixed top-2/4 -translate-y-1/2 ml-2 ${
        isOpen ? 'w-72' : ''
      }`}
    >
      <button onClick={toggleOpen} className='font-bold'>
        {isOpen ? '←' : '→'}
      </button>
      {isOpen && (
        <ul className='space-y-2 max-h-[75vh] overflow-y-auto'>
          {toc.map((item) => (
            <li
              key={item.id}
              style={{marginLeft: `${(item.level - 1) * 24}px`}}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className='hover:text-sky-500 cursor-pointer'
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
