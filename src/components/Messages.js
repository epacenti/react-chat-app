import { Component, createRef } from "react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import "../css/Messages.css";

class Messages extends Component {
  messagesRef = createRef();

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messagesRef.current) {
      this.messagesRef.current.scrollTop =
        this.messagesRef.current.scrollHeight;
    }
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  }

  render() {
    const { messages, isTyping, isDarkMode } = this.props;

    // Group messages by date
    const groupedMessages = {};
    messages.forEach((message) => {
      const date = new Date();
      const day = date.getDate();
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        date
      );
      const year = date.getFullYear();
      const formattedDate = `${month} ${day < 10 ? "0" + day : day}, ${year}`;

      if (!groupedMessages[formattedDate]) {
        groupedMessages[formattedDate] = [];
      }

      groupedMessages[formattedDate].push(message);
    });

    return (
      <div className={`Messages-container ${isDarkMode ? "dark" : "light"}`}>
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="Message-date">{date}</div>
            <ul className="Messages-list" ref={this.messagesRef}>
              {groupedMessages[date].map((m) => this.renderMessage(m))}
            </ul>
          </div>
        ))}
        {isTyping && (
          <div className="Typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}{" "}
        {/* Render typing indicator */}
      </div>
    );
  }

  renderMessage(message) {
    const { member, text } = message;
    const { currentMember } = this.props;
    const messageFromMe = member.id === currentMember.id;
    const className = messageFromMe
      ? "Messages-message currentMember"
      : "Messages-message";
    const avatarStyle = {
      backgroundColor: member.clientData.color,
    };
    const usernameInitial = member.clientData.username.charAt(0).toUpperCase();
    const timestamp = new Date().getTime(); // Generate the timestamp
    const messageId = uuidv4(); // Generate a unique identifier

    return (
      <li className={className} key={messageId}>
        <div className="avatar" style={avatarStyle}>
          {usernameInitial}
        </div>
        <div className="Message-content">
          <div className="username">{member.clientData.username}</div>
          <div className="text">{text}</div>
          <div className="timestamp">{this.formatTimestamp(timestamp)}</div>
        </div>
      </li>
    );
  }
}

export default Messages;
