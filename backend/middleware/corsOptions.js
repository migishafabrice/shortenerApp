const corsOptions = {
  origin: 'http://localhost:3000', // Use env for flexibility
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Allow cookies and headers like Authorization
  allowedHeaders: ['Content-Type', 'Authorization', 'CSRF-Token'],
};

module.exports = corsOptions;

