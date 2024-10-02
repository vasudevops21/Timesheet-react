import React, { useState, useEffect, useRef } from 'react';
import '../Styles/Chatbot.css'; // Ensure this CSS file includes your existing styles

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // Reference for auto-scrolling

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const qaPairs = {
    hi: 'Hi!, I am AGT support Bot, How Can I help You Today!',
    product: 'Our product/service is designed to [brief description of the product/service]. It helps with [primary benefits and use cases].',
    create: 'To create an account, go to our registration page [insert URL or instructions]. Fill in the required information, and follow the prompts to complete the setup.',
    reset: 'Click on the “Forgot Password” link on the login page. Enter your email address, and we’ll send you instructions to reset your password.',
    update: 'Log in to your account, go to the account settings or profile section, and you can update your information there. Be sure to save your changes before exiting.',
    documentation: 'Product documentation and user guides are available on our support page [insert URL or instructions]. You can browse or search for specific topics.',
    contact: 'You can contact customer support by [emailing support@example.com, calling our hotline at (123) 456-7890, or using the live chat feature on our website].',
    refund: 'Our refund policy allows for refunds within [number of days, e.g., 30 days] from the date of purchase. Please review our full refund policy [insert URL or instructions] for more details.',
    track: 'To track your order, log in to your account and visit the “Orders” section. You can view the status of your order and track its shipping progress.',
    defective: 'If you receive a defective or damaged product, please contact our support team at [email or phone number] with your order number and details about the issue. We’ll assist you with returns or replacements.',
    cancel: 'To cancel your subscription, log in to your account and go to the subscription or billing section. Follow the instructions to cancel. You may also contact our support team for assistance.',
    discounts: 'Current discounts and promotions are listed on our website’s promotions page [insert URL] or can be found in our latest newsletter. Be sure to check for any applicable codes during checkout.',
    install: 'Detailed installation or setup instructions can be found in our user guide [insert URL or instructions]. If you need further assistance, our support team is available to help.',
    requirements: 'The system requirements for our product are [list key requirements, e.g., operating system, hardware specs, etc.]. Please refer to the product documentation for a detailed list.',
    report: 'To report a bug or technical issue, please contact our support team at [email or phone number] with a detailed description of the problem. If possible, include any error messages or screenshots.',
    feedback: 'We welcome your feedback and suggestions! Please use our feedback form [insert URL] or contact us directly at [email address] with your comments.',
  };

  const keywords = {
    hi: ['hi', 'help'],
    product: ['product', 'service'],
    create: ['create', 'account'],
    reset: ['reset', 'password'],
    update: ['update', 'account', 'information'],
    documentation: ['documentation', 'user', 'guides'],
    contact: ['contact', 'support'],
    refund: ['refund', 'policy'],
    track: ['track', 'order'],
    defective: ['defective', 'damaged', 'product'],
    cancel: ['cancel', 'subscription'],
    discounts: ['discounts', 'promotions'],
    install: ['install', 'setup'],
    requirements: ['system', 'requirements'],
    report: ['report', 'bug', 'technical', 'issue'],
    feedback: ['feedback', 'suggestions'],
  };

  const findResponse = (input) => {
    const inputLowerCase = input.toLowerCase();

    for (const [key, value] of Object.entries(keywords)) {
      for (const keyword of value) {
        if (inputLowerCase.includes(keyword)) {
          console.log(`Matched keyword: ${keyword} for key: ${key}`);
          return qaPairs[key];
        }
      }
    }

    return "I'm sorry, I don't have an answer for that. Could you please rephrase your question?";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    const response = findResponse(input);
    console.log(`Input: "${input}", Response: "${response}"`);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: response, sender: 'bot' },
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen ? (
        <div id="chat-container" className="chat-container">
          <div id="top-bar" className="top-bar">
            <div id="chat-title" className="chat-title">AGT Support Bot</div>
            <button id="status-button" className="close-button" onClick={toggleChat}>
              <span id="status-dot" style={{ backgroundColor: 'red' }}></span>
              &times;
            </button>
          </div>
          <div id="response" className="response">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
            {/* Reference to scroll to the bottom */}
            <div ref={messagesEndRef} />
          </div>
          <div id="input-container" className="input-container">
            <i id="icon" className="fas fa-comment-dots icon"></i>
            <input
              type="text"
              id="chatbox"
              className="chatbox"
              placeholder="Ask your question here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
            <button id="send-button" className="send-button" onClick={handleSubmit}>
              <i className="fas fa-arrow-right arrow-icon"></i>
            </button>
          </div>
        </div>
      ) : (
        <div id="chat-toggle" className="chat-toggle" title="Support Chatbot" onClick={toggleChat}>
          <i id="toggle-icon" className="fas fa-chevron-up toggle-icon"></i>
          <div id="chat-title-tooltip" className="chat-title-tooltip">Support Bot</div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;


