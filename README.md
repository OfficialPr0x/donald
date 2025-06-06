# Intimate AI

A sophisticated AI-driven application that connects with Handy devices for an immersive interactive experience.

## Project Structure

```
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API and external services
│   │   ├── config/        # Configuration and constants
│   │   └── styles/        # Global styles
│   └── public/            # Static assets
├── server/                # Node.js Express backend
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── nlp/              # Natural language processing
└── README.md
```

## Features

- 🔐 **Authentication**: Secure user registration and login with Supabase
- 💳 **Payment Processing**: Stripe integration for subscriptions
- 🎯 **Device Integration**: Handy device connectivity and control
- 🤖 **AI Chat**: Venice AI integration for conversational experiences
- 🎤 **Voice Selection**: Multiple AI voice options
- 📱 **PWA Support**: Progressive Web App capabilities
- 🎨 **Responsive Design**: Tailwind CSS for modern UI
- 🛡️ **Error Handling**: Comprehensive error boundaries and logging

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Stripe account
- Venice AI API access
- Handy device API access

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd intimate-ai
```

### 2. Install dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Environment Setup

#### Backend (.env)
Copy `server/.env.example` to `server/.env` and configure:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database - Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# Authentication
JWT_SECRET=your-jwt-secret

# Stripe Integration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Venice AI Integration
VENICE_API_KEY=your-venice-api-key

# Handy Device Integration
HANDY_API_KEY=your-handy-api-key
```

#### Frontend (.env)
Copy `client/.env.example` to `client/.env` and configure:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:4000/api

# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_KEY=your-supabase-key

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## Development

### Start the backend server
```bash
cd server
npm run dev
```

### Start the frontend development server
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Production Build

### Build the frontend
```bash
cd client
npm run build
```

### Start the backend in production
```bash
cd server
npm start
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Payment Endpoints
- `POST /api/payments/create-subscription` - Create Stripe subscription
- `POST /api/payments/webhook` - Stripe webhook handler

### Device Endpoints
- `POST /api/device/connect` - Connect Handy device
- `GET /api/device/status` - Get device status
- `POST /api/device/control` - Control device

### Chat Endpoints
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history

### Preferences Endpoints
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

## Testing

### Run frontend tests
```bash
cd client
npm test
```

### Run backend tests
```bash
cd server
npm test
```

### Run end-to-end tests
```bash
cd client
npx cypress open
```

## Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the production bundle: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables in your hosting dashboard

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Ensure all environment variables are configured
2. Deploy using your preferred hosting service
3. Set up domain and SSL certificate

### Database Setup (Supabase)
1. Create tables for users, preferences, chat history
2. Set up authentication rules
3. Configure row-level security policies

## Security Considerations

- All API endpoints require authentication
- Rate limiting is implemented
- Input validation on all user inputs
- CORS configured for production domains
- Helmet.js for security headers
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Private - All rights reserved

## Support

For support, contact [support email] or create an issue in the repository.

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 4000 are available
2. **Environment variables**: Double-check all required env vars are set
3. **Database connection**: Verify Supabase credentials
4. **API keys**: Ensure all external service API keys are valid

### Logs

- Frontend: Check browser console for errors
- Backend: Check server logs for API errors
- Database: Check Supabase dashboard for query errors
