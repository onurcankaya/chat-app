import React from 'react'

const Message = ({ message }) => (
  <div className={`message ${message.user === 'user01' ? 'sent' : 'received'}`}>{message.body}</div>
)

export default Message
