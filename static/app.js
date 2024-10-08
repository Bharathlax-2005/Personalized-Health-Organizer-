class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector('.chatbox__button'),
      chatBox: document.querySelector('.chatbox__support'),
      sendButton: document.querySelector('.send__button'),
    };

    this.state = false;
    this.messages = [];
  }

  display() {
    const { openButton, chatBox, sendButton } = this.args;

    // Toggle chat box visibility on button click
    openButton.addEventListener('click', () => this.toggleState(chatBox));

    // Send message when send button is clicked
    sendButton.addEventListener('click', () => this.onSendButton(chatBox));

    // Send message when Enter key is pressed
    const node = chatBox.querySelector('input');
    node.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.onSendButton(chatBox);
      }
    });
  }

  toggleState(chatBox) {
    // Toggle chat box open/closed state
    this.state = !this.state;

    if (this.state) {
      chatBox.classList.add('chatbox--active');
    } else {
      chatBox.classList.remove('chatbox--active');
    }
  }

  onSendButton(chatBox) {
    const textField = chatBox.querySelector('input');
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 };
    this.messages.push(msg1);

    // Fetch data from the server
    fetch('/predict', {
      method: 'POST',
      body: JSON.stringify({ message: text1 }),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let msg2 = { name: "Sam", message: r.answer };
        this.messages.push(msg2);
        this.updateChatText(chatBox);
        textField.value = '';
      })
      .catch((error) => {
        console.error('Error:', error);
        this.updateChatText(chatBox);
        textField.value = '';
      });
  }

  updateChatText(chatBox) {
    let html = '';
    this.messages
      .slice()
      .reverse()
      .forEach(function (item) {
        if (item.name === "Sam") {
          html += `<div class="messages_item messages_item--visitor">${item.message}</div>`;
        } else {
          html += `<div class="messages_item messages_item--operator">${item.message}</div>`;
        }
      });

    const chatMessage = chatBox.querySelector('.chatbox__messages');
    chatMessage.innerHTML = html;
  }
}

const chatbox = new Chatbox();
chatbox.display();
