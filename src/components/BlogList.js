import React from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'

const likeBlog = async blog => {
  blogService.update({
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id
  })
}

const BlogList = ({ blogs, triggerUpdate }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <h2>blogs</h2>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeHandler={() => {
          likeBlog(blog)
          triggerUpdate()
        }
        } />
      )}
    </div>
  )
}
export default BlogList
