import React from 'react'

const style = {
  border: '1px solid grey',
  padding: '3px 5px'
}

const Blog = ({ blog, likeHandler, deleteHandler }) => {
  const [detailsVisible, setDetailsVisible] = React.useState(false)

  return (<div style={style} className='blog-entry'>
    <p>
      {blog.title} {blog.author}
      <button className="show-details" onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? 'Hide' : 'Show'}
      </button>
    </p>
    {detailsVisible && (
      <div>
        <p>
          {blog.url}
        </p>
        <p className="like-count">
          Likes: {blog.likes}
        </p>
        <button className="blog-like" onClick={likeHandler}>Like</button>
        {blog.user && blog.user.name && (
          <p>
            {blog.user.name}
          </p>
        )}
        {blog.user.username === JSON.parse(localStorage.getItem('user')).username && (
          <button onClick={deleteHandler}>Remove?</button>
        )}
      </div>
    )}
  </div>
  )
}
export default Blog
