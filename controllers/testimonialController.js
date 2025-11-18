const getTestimonials = (req, res) => {
    res.json([{ email: 'test@example.com', message: 'Hello!' }]);
};

const addTestimonial = (req, res) => {
    const { email, message } = req.body;
    res.status(201).json({ email, message });
};

const deleteTestimonial = (req, res) => {
    res.json({ message: `Deleted testimonial ${req.params.id}` });
};

module.exports = { getTestimonials, addTestimonial, deleteTestimonial };
