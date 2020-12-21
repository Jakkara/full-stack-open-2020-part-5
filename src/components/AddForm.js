import React, { useState } from 'react'
import blogService from '../services/blogs'

const AddForm = ({ onSuccess, onError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      await blogService.create({
        title, author, url
      })
      onSuccess(`Added blog entry: ${title}`, 2000)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (e) {
      onError('Error adding blog entry', 2000)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input name="title" value={title} onChange={({ target }) => setTitle(target.value)} /><br />
        <label htmlFor="author">Author</label>
        <input name="author" value={author} onChange={({ target }) => setAuthor(target.value)} /><br />
        <label htmlFor="url">URL</label>
        <input name="url" value={url} onChange={({ target }) => setUrl(target.value)} /><br />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AddForm
