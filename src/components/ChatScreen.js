import React from 'react'
import $ from 'jquery'
import '../css/styles.css'

const ENTER_KEY = 13

class ChatScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
    this.state = {
      newMessage: '',
      messageInput: '',
      messages: null,
    }
  }

  async componentDidMount() {
    console.log('DOM is ready for manipulation')
    document.addEventListener('keydown', this._handlePressEnter)

    const response = await this.fetchMessages()
    console.log(response)
    this.storeMessages(response)
    this.scrollChatWindow(0)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._handePressEnter)
  }

  scrollChatWindow = (animationDuration) => {
    console.log('scroll chat window')
    $('.messages-container').animate({ scrollTop: $(document).height() }, animationDuration)
  }

  _handlePressEnter = (event) => {
    if (event.keyCode === ENTER_KEY) {
      this.sendMessage()
    }
  }

  handleInputChange = (e) => {
    const inputValue = e.target.value
    this.setState({
      messageInput: inputValue,
    })
  }

  fetchMessages = async () => {
    console.log('fetch messages')
    // it calls fetch with the url to data/messages.json
    // it converts response to JSON format
    const response = await fetch('data/messages.json')
    const data = await response.json()
    // it passes the fetched messages in JSON format to the storeMessages function
    return data
  }

  storeMessages = (messages) => {
    console.log('store messages', messages)
    // call setState and store messages in the state
    this.setState({ messages })
  }

  renderMessages = () => {
    console.log('---render messages---')
    // fetch all messages from the local state
    // map all the messages
    // append individual message body to div tag with the corresponding classes
    const { messages } = this.state

    return (
      messages &&
      messages.map((message, index) => {
        return (
          <div key={index} className={`message ${message.user === 'user01' ? 'sent' : 'received'}`}>
            {message.body}
          </div>
        )
      })
    )
  }

  sendMessage = () => {
    this.setState(
      {
        newMessage: this.state.messageInput,
      },
      () => {
        const { newMessage } = this.state
        const node = document.createElement('div')
        const textnode = document.createTextNode(newMessage)

        node.appendChild(textnode)
        node.classList.add('message')
        node.classList.add('sent')
        newMessage && document.querySelector('.messages-container').appendChild(node)
        this.clearTextInput()
        this.scrollChatWindow(0)
      }
    )
  }

  clearTextInput = () => {
    this.textInput.current.value = ''
    this.textInput.current.focus()
    this.setState({ messageInput: '' })
  }

  render() {
    const { messageInput, messages } = this.state

    console.log('this is from the component state (in render)', messages)

    return (
      <div className="app-container">
        <div className="header-container">
          <button className="login-button">Login / Sign up</button>
        </div>
        <div className="messages-container">{messages && this.renderMessages()}</div>
        <div className="send-message-container">
          <input
            className="message-input"
            placeholder="Type your message..."
            onChange={this.handleInputChange}
            value={messageInput}
            type="text"
            id="textinput"
            name="textinput"
            ref={this.textInput}
          />
          <button className="send-message-button" onClick={this.sendMessage}>
            Send
          </button>
        </div>
      </div>
    )
  }
}

export default ChatScreen
