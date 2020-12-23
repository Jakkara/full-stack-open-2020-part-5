import React from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'

const likeBlog = async blog => {
  await blogService.update({
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id
  })
}

const deleteBlog = async blog => {
  await blogService.remove(blog.id)
}

const BlogList = ({ blogs, triggerUpdate }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <h2>blogs</h2>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeHandler={async () => {
            await likeBlog(blog)
            triggerUpdate()
          }}
          deleteHandler={async () => {
            const answer = window.confirm('Are you sure you want to remove this blog?')
            if (!answer) return
            await deleteBlog(blog)
            triggerUpdate()
          }}
        />
      )}
    </div>
  )
}
export default BlogList
