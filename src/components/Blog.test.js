import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Name of the Author',
  url: 'https://google.com',
  likes: 0
}

test('Blog rendering without details', () => {

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    blog.title
  )
  expect(component.container).toHaveTextContent(
    blog.author
  )
  expect(component.container).not.toHaveTextContent(
    blog.url
  )
  expect(component.container).not.toHaveTextContent(
    'Likes:'
  )
})

test('Blog rendering WITH details', () => {

  const component = render(
    <Blog blog={blog} />
  )
  fireEvent.click(component.getByText('Show'))

  expect(component.container).toHaveTextContent(
    blog.url
  )
  expect(component.container).toHaveTextContent(
    `Likes: ${blog.likes}`
  )
})
