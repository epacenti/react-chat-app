import { Component } from "react";
import React from "react";
import EmojiPicker from "emoji-picker-react";
import "../css/Input.css";

class Input extends Component {
  state = {
    text: "",
    showEmojiPicker: false,
  };

  onChange = (e) => {
    this.setState({ text: e.target.value });
    this.props.onTyping(e.target.value !== ""); // Notify the parent component about typing status
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.text.trim() === "") {
      return; // If input text is empty, do nothing
    }
    this.setState({ text: "" });
    this.props.onSendMessage(this.state.text);
  };

  toggleEmojiPicker = () => {
    this.setState((prevState) => ({
      showEmojiPicker: !prevState.showEmojiPicker,
    }));
  };

  handleEmojiSelect = (emoji) => {
    const { text } = this.state;
    const updatedText = text + emoji.emoji;
    this.setState({ text: updatedText });
  };

  setPickerRef = (ref) => {
    this.pickerRef = ref;
  };

  componentDidMount() {
    window.addEventListener("click", this.handleOutsideClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleOutsideClick);
  }

  handleOutsideClick = (event) => {
    const emojiPickerContainer = document.querySelector(".emoji-picker");
    const emojiButton = document.querySelector(".Input button");

    if (
      emojiPickerContainer &&
      emojiButton &&
      !emojiPickerContainer.contains(event.target) &&
      !emojiButton.contains(event.target)
    ) {
      this.setState({ showEmojiPicker: false });
    }
  };

  render() {
    const { text, showEmojiPicker } = this.state;
    const { isDarkMode } = this.props;
    const formClassName = isDarkMode ? "dark" : "light";

    return (
      <div className="Input">
        <form onSubmit={this.onSubmit} className={`form ${formClassName}`}>
          <input
            onChange={this.onChange}
            value={text}
            type="text"
            placeholder="What's on your mind?"
            autoFocus={true}
          />
          <button type="button" onClick={() => this.toggleEmojiPicker()}>
            😀
          </button>
          {showEmojiPicker && (
            <div ref={this.setPickerRef} className="emoji-picker">
              <EmojiPicker
                onEmojiClick={this.handleEmojiSelect}
                skinTonesDisabled={true}
              />
            </div>
          )}
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default Input;
