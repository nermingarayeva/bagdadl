// components/TestimonialsSection.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // YALNIZ TƏSDİQLƏNMİŞ rəyləri gətir
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // İstifadəçi rəy yazar
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !message) {
      alert('E-poçt və mesajı doldurun.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/testimonials', 
        { email, message }
      );

      alert('Rəyiniz göndərildi! Admin yoxladıqdan sonra dərc olunacaq.');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error adding testimonial:', err);
      alert('Xəta baş verdi');
    }
  };

  return (
    <section className="testimonials-section" style={{ padding: '50px 20px' }}>
      <h2>Müştəri Rəyləri</h2>

      {/* Rəy yazma formu */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
        <input 
          type="email" 
          placeholder="E-poçt ünvanınız" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />
        <textarea 
          placeholder="Rəyinizi yazın..." 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          required
          rows="4"
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '12px 30px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Rəy Göndər
        </button>
      </form>

      {/* Təsdiqlənmiş rəylər */}
      <div className="testimonial-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {testimonials.length === 0 ? (
          <p>Hələ rəy yoxdur.</p>
        ) : (
          testimonials.map(t => (
            <div 
              key={t._id} 
              style={{
                padding: '20px',
                marginBottom: '20px',
                background: '#f9f9f9',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <p style={{ fontSize: '16px', marginBottom: '10px', fontStyle: 'italic' }}>
                "{t.message}"
              </p>
              <small style={{ color: '#666', fontWeight: 'bold' }}>— {t.email}</small>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;