import React from 'react'

const Notification = ({ className, message }) => {
  return (
    <div className={className}>
      <h3>{message}</h3>
    </div>
  )
}

export default Notification
