import React, { useState, useRef, useEffect } from "react";
import "./AIAssistant.scss";
import { searchTrips, generateTripResponse } from "../../services/TripService";

const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your AI Assistant. How can I help you today? Try asking me about trips, destinations, or tours! 🌍",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuery = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Check if user is asking about trips/tours
      const tripKeywords = [
        "trip",
        "tour",
        "destination",
        "package",
        "travel",
        "holiday",
        "vacation",
        "itinerary",
        "departure",
        "booking",
      ];
      const isAskingAboutTrips = tripKeywords.some((keyword) =>
        userQuery.toLowerCase().includes(keyword)
      );

      let botMessageText = "";

      if (isAskingAboutTrips) {
        // Search for trips from database
        console.log("🔍 Trip query detected:", userQuery);
        const searchResults = await searchTrips(userQuery);
        console.log("📊 Search results:", searchResults);
        const response = generateTripResponse(searchResults);
        console.log("💬 Generated response:", response);
        botMessageText = response.text;
      } else {
        // Handle general questions
        console.log("💭 General question:", userQuery);
        botMessageText = await handleGeneralQuestion(userQuery);
      }

      const botMessage = {
        id: messages.length + 2,
        text: botMessageText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I encountered an error processing your request. Please try again later! 😅",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneralQuestion = async (query) => {
    const lowerQuery = query.toLowerCase();

    // Predefined responses for common questions
    const responses = {
      greeting: {
        keywords: ["hello", "hi", "hey", "greetings"],
        response:
          "Hi there! 👋 I'm here to help you find the perfect trip! You can ask me about tours, destinations, or travel packages. What are you looking for? 🌍",
      },
      help: {
        keywords: ["help", "what can you do", "assist"],
        response:
          "I can help you with:\n• Finding group tours 🚌\n• Discovering tailor-made tours ✨\n• Searching for specific destinations 🗺️\n• Learning about travel dates and durations 📅\n\nJust ask me about any trip or destination you're interested in!",
      },
      pricing: {
        keywords: ["price", "cost", "expensive", "cheap", "affordable"],
        response:
          "For pricing information, I recommend contacting our sales team or visiting specific tour details. Different tours have different packages and seasonal pricing! 💰",
      },
      booking: {
        keywords: ["book", "reserve", "how to book", "booking process"],
        response:
          "To book a tour, you can:\n1. Browse available tours 🔍\n2. Check the itinerary and dates 📋\n3. Contact our sales team for confirmation 📞\n4. Complete payment 💳\n\nWould you like me to help you find a specific tour?",
      },
    };

    for (const [key, { keywords, response }] of Object.entries(responses)) {
      if (keywords.some((kw) => lowerQuery.includes(kw))) {
        return response;
      }
    }

    // Default response
    return "That's an interesting question! For more specific information, I'd recommend browsing our tour catalog or contacting our sales team. Is there anything else about our trips I can help with? 😊";
  };

  if (!isOpen) return null;

  return (
    <div className="ai-assistant-overlay" onClick={onClose}>
      <div
        className="ai-assistant-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ai-assistant-header">
          <div className="ai-assistant-title">
            <div className="ai-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8V4m0 16v-4m8-8h-4m-8 0H4m11.313 11.313l2.828-2.828m-5.656 0l-2.828 2.828m0-5.656l2.828-2.828m-5.656 0l2.828 2.828" />
              </svg>
            </div>
            <div>
              <h2>AI Assistant</h2>
              <span className="status-badge">Ready to help</span>
            </div>
          </div>
          <button className="ai-close-btn" onClick={onClose} aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="ai-messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`ai-message ${message.sender}`}>
              <div className="ai-message-content">
                {message.sender === "bot" && (
                  <div className="ai-avatar">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                  </div>
                )}
                <div className="ai-message-text">{message.text}</div>
              </div>
              <span className="ai-message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message bot">
              <div className="ai-message-content">
                <div className="ai-avatar">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
                <div className="ai-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="ai-input-form">
          <div className="ai-input-wrapper">
            <input
              type="text"
              className="ai-input"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={isLoading || !inputValue.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4429026 C0.994623095,2.0591707 0.837654326,3.0143979 1.15159189,3.97788954 L3.03521743,10.4188826 C3.03521743,10.5759799 3.34915502,10.7330773 3.50612381,10.7330773 L16.6915026,11.5185642 C16.6915026,11.5185642 17.1624089,11.5185642 17.1624089,12.0493666 C17.1624089,12.5801689 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
