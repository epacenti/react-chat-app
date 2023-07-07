import React, { Component } from "react";
import "../css/App.css";
import "../css/Dark-mode.css";
import Messages from "./Messages";
import Input from "./Input";

function randomName() {
  const adjectives = [
    "autumn",
    "hidden",
    "bitter",
    "misty",
    "silent",
    "empty",
    "dry",
    "dark",
    "summer",
    "icy",
    "delicate",
    "quiet",
    "white",
    "cool",
    "spring",
    "winter",
    "patient",
    "twilight",
    "dawn",
    "crimson",
    "wispy",
    "weathered",
    "blue",
    "billowing",
    "broken",
    "cold",
    "damp",
    "falling",
    "frosty",
    "green",
    "long",
    "late",
    "lingering",
    "bold",
    "little",
    "morning",
    "muddy",
    "old",
    "red",
    "rough",
    "still",
    "small",
    "sparkling",
    "throbbing",
    "shy",
    "wandering",
    "withered",
    "wild",
    "black",
    "young",
    "holy",
    "solitary",
    "fragrant",
    "aged",
    "snowy",
    "proud",
    "floral",
    "restless",
    "divine",
    "polished",
    "ancient",
    "purple",
    "lively",
    "nameless",
  ];
  const nouns = [
    "waterfall",
    "river",
    "breeze",
    "moon",
    "rain",
    "wind",
    "sea",
    "morning",
    "snow",
    "lake",
    "sunset",
    "pine",
    "shadow",
    "leaf",
    "dawn",
    "glitter",
    "forest",
    "hill",
    "cloud",
    "meadow",
    "sun",
    "glade",
    "bird",
    "brook",
    "butterfly",
    "bush",
    "dew",
    "dust",
    "field",
    "fire",
    "flower",
    "firefly",
    "feather",
    "grass",
    "haze",
    "mountain",
    "night",
    "pond",
    "darkness",
    "snowflake",
    "silence",
    "sound",
    "sky",
    "shape",
    "surf",
    "thunder",
    "violet",
    "water",
    "wildflower",
    "wave",
    "water",
    "resonance",
    "sun",
    "wood",
    "dream",
    "cherry",
    "tree",
    "fog",
    "frost",
    "voice",
    "paper",
    "frog",
    "smoke",
    "star",
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const formattedAdjective =
    adjective.charAt(0).toUpperCase() + adjective.slice(1);
  const formattedNoun = noun.charAt(0).toUpperCase() + noun.slice(1);

  return `${formattedAdjective} ${formattedNoun}`;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      member: {
        username: randomName(),
        color: randomColor(),
      },
      typingMembers: [],
      loggedIn: false,
      isMounted: false,
      error: false,
      errorMessage: "",
      isDarkMode: false,
    };

    this.drone = new window.Scaledrone("D29d6YQFtlVTVLQk", {
      data: this.state.member,
    });

    this.drone.on("open", (error) => {
      if (error) {
        console.error(error);
        this.setState({
          error: true,
          errorMessage:
            "Failed to connect to Scaledrone. Please try again later.",
        });
        return;
      }
      if (this.state.isMounted) {
        // Check if the component is still mounted
        const member = { ...this.state.member };
        member.id = this.drone.clientId;
        this.setState({ member });
      }
    });

    const room = this.drone.subscribe("observable-room");
    room.on(
      "data",
      (data, member) => {
        if (this.state.isMounted) {
          const messages = [...this.state.messages];
          messages.push({ member, text: data });
          this.setState({ messages });
        }
      },
      (error) => {
        console.error(error);
        this.setState({
          error: true,
          errorMessage: "Failed to receive message. Please try again later.",
        });
      }
    );
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  handleLogin = () => {
    this.setState({ loggedIn: true });
  };

  handleLogout = () => {
    this.setState({ loggedIn: false });
  };

  onSendMessage = (message) => {
    if (!this.state.isMounted) {
      return; // Exit early if the component is not mounted
    }

    this.drone.publish(
      {
        room: "observable-room",
        message,
      },
      (error) => {
        if (error) {
          console.error(error);
          this.setState({
            error: true,
            errorMessage: "Failed to send message. Please try again later.",
          });
        }
      }
    );
    this.setState({ isTyping: false }); // Set typing status to false when sending a message
  };

  setTypingStatus = (isTyping) => {
    this.setState({ isTyping });
  };

  toggleDarkMode = () => {
    this.setState((prevState) => ({
      isDarkMode: !prevState.isDarkMode,
    }));
  };

  renderError() {
    const { error, errorMessage } = this.state;
    if (error) {
      return <div className="error-message">{errorMessage}</div>;
    }
    return null;
  }

  render() {
    const { loggedIn, isDarkMode } = this.state;

    if (!loggedIn) {
      return (
        <div className={`App ${isDarkMode ? "dark" : "light"}`}>
          <div className="welcome-page">
            <h1>
              Welcome to the <span className="sparkle">EnaChatBox</span> !
            </h1>
            <button onClick={this.handleLogin}>Login</button>
            <button onClick={this.toggleDarkMode}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`App ${isDarkMode ? "dark" : "light"}`}>
        {this.renderError()}
        <div className="App-header">
          <h1>EnaChatBox</h1>
          <button onClick={this.toggleDarkMode} className="Dark-mode-button">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="Logout-button" onClick={this.handleLogout}>
            Logout
          </button>{" "}
          {/* Add Logout button */}
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
          isTyping={this.state.isTyping} // Pass the isTyping state to Messages component
          isDarkMode={isDarkMode} // Pass the isDarkMode state to Messages component
        />
        <Input
          onSendMessage={this.onSendMessage}
          onTyping={this.setTypingStatus}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }
}

export default App;
