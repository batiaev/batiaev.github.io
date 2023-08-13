import Title from '../components/Title'
import Chip from '../components/Chip'
import data from '../data/data.json'
import { useState } from 'react'
import Link from "next/link";

export default function Blog() {
  const [selectedItem, elevate] = useState('#')

  return (
    <section>
      <Title text="Blog" />
      <div className="flexbox">
        {data.blog.map((blog, index) => (
          <div key={blog.name} >
              <Link
                  href={blog.link}
                  aria-label={blog.name}
              >
            <div className="card"
                  onMouseOver={() => elevate(blog.name)}
                  onMouseOut={() => elevate('none')}
                  onSelect={() => elevate(blog.name)}
                  onFocus={() => elevate(blog.name)}
            >
              <img
                className="cardMedia"
                width="100%"
                src={blog.logo}
                title={blog.name}
              />
              <div>
                <h3>
                  {blog.badge && <Chip label={blog.badge}/>} {blog.name}
                </h3>
              </div>
            </div>
          </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
