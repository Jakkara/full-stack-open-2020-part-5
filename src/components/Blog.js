import React from 'react'

const style = {
  border: '1px solid grey',
  padding: '3px 5px'
}

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = React.useState(false)

  return (<div style={style} className='blog-entry'>
    <p>
      {blog.title} {blog.author}
      <button onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? 'Hide' : 'Show'}
      </button>
    </p>
    {detailsVisible && (
      <div>
        <p>
          {blog.url}
        </p>
        <p>
          Likes: {blog.likes}
          <button>Like</button>
        </p>
        {blog.user && blog.user.name && (
          <p>
            {blog.user.name}
          </p>
        )}
      </div>
    )}
  </div>
  )
}
export default Blog
