import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/images/styles/global.css';

const CustomisedGifts = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleStartCustomising = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please enter your name and phone number.');
      return;
    }
    navigate('/customise', { state: { name, phone } });
  };

  // Yalnız rəqəm qəbul edən funksiya
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // rəqəm olmayan hər şeyi silir
    setPhone(value);
  };

  return (
    <div className="customised-gifts">
      {!showForm && (
        <section className="cta-section">
          <h2>Ready to Personalise Your Gift?</h2>
          <button onClick={handleStartCustomising}>Start Customising</button>
        </section>
      )}

      {showForm && (
        <section className="user-info-section">
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Phone Number"
              maxLength="10"
              pattern="[0-9]*"
              inputMode="numeric"
              required
            />
            <button type="submit">Continue to Customise</button>
          </form>
        </section>
      )}
    </div>
  );
};

export default CustomisedGifts;
