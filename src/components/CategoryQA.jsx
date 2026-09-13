import { useState } from "react";

export default function CategoryQA({ category }) {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      q: "What materials are used in these products?",
      a: "Our products use premium quality materials sourced from trusted suppliers worldwide.",
    },
    {
      id: 2,
      q: "What sizes are available?",
      a: "We offer sizes from S to XXL. Check the size guide on each product page for exact measurements.",
    },
    {
      id: 3,
      q: "How long does shipping take?",
      a: "Standard shipping takes 3-5 business days. Express shipping is available at checkout.",
    },
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setQuestions([
        ...questions,
        {
          id: Date.now(),
          q: newQuestion,
          a: "Thank you for your question! Our team will respond within 24 hours.",
        },
      ]);
      setNewQuestion("");
      setShowForm(false);
    }
  };

  return (
    <div className="qa-section">
      <div className="qa-header">
        <h3>❓ Questions & Answers</h3>
        <button className="qa-ask-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "Ask a Question"}
        </button>
      </div>

      {showForm && (
        <form className="qa-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your question about this category..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            required
          />
          <button type="submit">Submit Question</button>
        </form>
      )}

      <div className="qa-list">
        {questions.map((item) => (
          <div className="qa-item" key={item.id}>
            <div className="qa-question">
              <span className="qa-icon">Q:</span>
              <p>{item.q}</p>
            </div>
            <div className="qa-answer">
              <span className="qa-icon">A:</span>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
