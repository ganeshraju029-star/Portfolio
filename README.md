# Ganesh Raju Portfolio - Enterprise Backend

A complete production-ready backend system for the Ganesh Raju Portfolio, built with Firebase Cloud Functions, TypeScript, and enterprise-grade security measures.

## 🚀 Features

### Contact Management System
- **Real-time Form Submission**: Instant form processing with validation
- **Email Automation**: 
  - Admin notifications via Resend API
  - Auto-reply emails to visitors
  - Professional HTML email templates with glassmorphism design
- **Smart Priority Detection**: Automatic priority calculation based on message content
- **Request ID Generation**: Unique tracking IDs for all submissions
- **Visitor Analytics**: Automatic collection of device, browser, and location data

### Analytics & Tracking
- **Page View Tracking**: Monitor visitor engagement
- **Project Click Tracking**: Track which projects are most popular
- **Resume Download Tracking**: Monitor resume downloads with analytics
- **Daily Aggregation**: Automated daily statistics
- **Geographic Insights**: Country-level visitor data
- **Device/Browser Analytics**: Detailed technology breakdown

### Admin Dashboard
- **Real-time Statistics**: Live dashboard with key metrics
- **Message Management**: View, update status, and delete messages
- **Activity Logs**: Track all admin actions
- **System Health Monitoring**: Backend performance metrics
- **Paginated Data**: Efficient data retrieval with pagination

### Security
- **Rate Limiting**: Prevent spam and abuse (5 requests per 15 minutes)
- **Input Validation**: Comprehensive server-side validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security Headers**: HTTP security hardening
- **XSS Protection**: Input sanitization and escaping
- **Firestore Security Rules**: Database-level access control

## 📁 Project Structure

```
portfolio/
├── functions/
│   ├── src/
│   │   ├── config/
│   │   │   ├── firebase.ts          # Firebase Admin SDK setup
│   │   │   └── constants.ts         # Application constants
│   │   ├── controllers/
│   │   │   ├── contactController.ts # Contact form logic
│   │   │   ├── analyticsController.ts # Analytics tracking
│   │   │   └── adminController.ts   # Admin dashboard
│   │   ├── middleware/
│   │   │   ├── rateLimiter.ts       # Rate limiting
│   │   │   └── security.ts          # CORS, Helmet, auth
│   │   ├── services/
│   │   │   ├── emailService.ts      # Resend email integration
│   │   │   └── analyticsService.ts  # Analytics tracking
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript definitions
│   │   ├── utils/
│   │   │   ├── validators.ts        # Input validation
│   │   │   └── helpers.ts           # Utility functions
│   │   └── index.ts                 # Cloud Functions entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.json
├── firestore.rules                  # Firestore security rules
├── firestore.indexes.json           # Database indexes
├── firebase.json                    # Firebase configuration
├── .firebaserc                      # Firebase project settings
├── .env.example                     # Environment variables template
├── service-account.example.json    # Service account template
├── .gitignore
├── index.html                      # Frontend (updated with API integration)
└── README.md
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 18
- **Language**: TypeScript
- **Backend**: Firebase Cloud Functions
- **Database**: Firestore
- **Email**: Resend API
- **Authentication**: Firebase Auth
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Validator.js

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher) installed
2. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```
3. A **Firebase project** created in the Firebase Console
4. A **Resend account** with API key (for email automation)
5. **Git** installed (for version control)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ganeshraju029-star/Portfolio.git
cd Portfolio
```

### 2. Install Dependencies

```bash
cd functions
npm install
```

### 3. Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Or link to existing project
firebase use --add
```

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your values
```

Required environment variables:
```env
RESEND_API_KEY=your_resend_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id_here
ADMIN_EMAIL=ganeshraju029@gmail.com
NODE_ENV=production
```

### 5. Set Up Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Save the JSON file as `functions/service-account.json`
5. **Never commit this file to version control**

### 6. Configure Firebase Project ID

Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 7. Deploy Firestore Rules and Indexes

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

## 🧪 Local Development

### Start Firebase Emulators

```bash
# Start all emulators (Functions, Firestore)
firebase emulators:start

# Or start specific emulators
firebase emulators:start --only functions,firestore
```

The emulators will be available at:
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **Firebase UI**: http://localhost:4000

### Test Local Endpoints

```bash
# Test the API endpoint
curl -X POST http://localhost:5001/portfolio-backend-production/us-central1/api/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## 🚢 Deployment

### Deploy to Production

```bash
# Build and deploy all functions
firebase deploy --only functions

# Deploy hosting (if configured)
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

### Deploy Specific Functions

```bash
# Deploy only the main API function
firebase deploy --only functions:api

# Deploy only the cleanup function
firebase deploy --only functions:cleanupAnalytics
```

## 📡 API Endpoints

### Contact Form

#### POST /api/contact
Submit contact form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Google",
  "subject": "Internship Opportunity",
  "message": "I'm interested in...",
  "linkedin": "https://linkedin.com/in/johndoe",
  "phone": "+1234567890",
  "sourcePage": "/",
  "visitorData": {
    "sessionId": "session-id",
    "country": "India",
    "device": "Desktop",
    "browser": "Chrome",
    "os": "Windows",
    "language": "en-US",
    "screenResolution": "1920x1080"
  }
}
```

**Response:**
```json
{
  "success": true,
  "connectionId": "abc123",
  "requestId": "CONN-2026-0001"
}
```

### Analytics

#### POST /api/analytics/pageview
Track page view

#### POST /api/analytics/project-click
Track project click

#### POST /api/analytics/resume-download
Track resume download

#### GET /api/analytics/dashboard
Get dashboard statistics (admin only)

### Admin (Requires Authentication)

#### GET /api/connections
Get all connections with pagination

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)
- `status`: Filter by status (new, read, replied, archived)
- `priority`: Filter by priority (low, medium, high)

#### GET /api/connections/:id
Get single connection by ID

#### PATCH /api/connections/:id
Update connection status or priority

#### DELETE /api/connections/:id
Delete connection

#### GET /api/admin/dashboard
Get complete dashboard data

#### GET /api/admin/health
Get system health status

## 🔒 Security

### Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 5 per email address
- **Strategy**: In-memory with automatic cleanup

### Input Validation
- Name: 2-100 characters, letters only
- Email: Valid email format
- Message: 10-5000 characters
- Optional fields: Max length validation
- URL validation for LinkedIn

### Firestore Security Rules
- Public: Create connections, analytics
- Admin: Read/write all collections
- No public access to sensitive data

### Security Headers
- Content-Security-Policy
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy

## 📊 Firestore Collections

### connections
Stores contact form submissions
- Fields: name, email, company, subject, message, priority, status, etc.

### analytics
Stores visitor session data
- Fields: sessionId, visitorId, pageViews, visitor data

### dailyAnalytics
Aggregated daily statistics
- Fields: date, pageViews, uniqueVisitors, topPages, etc.

### resumeDownloads
Tracks resume downloads
- Fields: timestamp, country, device, browser

### projectClicks
Tracks project interactions
- Fields: projectId, projectName, timestamp, visitor data

### adminLogs
Admin activity log
- Fields: action, connectionId, timestamp

## 🧭 Monitoring & Logging

### View Function Logs

```bash
# View all logs
firebase functions:log

# View logs for specific function
firebase functions:log --only api

# Real-time log streaming
firebase functions:log --only api
```

### Firestore Console
Access via Firebase Console → Firestore Database

### Firebase Console Monitoring
- Functions: https://console.firebase.google.com/project/PROJECT_ID/functions
- Firestore: https://console.firebase.google.com/project/PROJECT_ID/firestore

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean build artifacts
rm -rf functions/dist
npm run build
```

### Deployment Errors
```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# Check project configuration
firebase use
```

### Email Not Sending
1. Verify Resend API key in environment variables
2. Check Resend dashboard for API usage
3. Verify email addresses are valid
4. Check function logs for errors

### Rate Limiting Issues
- Check rate limit configuration in `constants.ts`
- Verify rate limiter is working in logs
- Adjust limits if needed

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow existing code structure
- Add JSDoc comments for functions
- Use meaningful variable names

### Testing
- Test locally with emulators before deployment
- Validate all inputs on both client and server
- Test error handling scenarios
- Verify email templates

### Security
- Never commit service account keys
- Use environment variables for secrets
- Validate all user inputs
- Implement proper error handling
- Use HTTPS in production

## 🔄 CI/CD

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: cd functions && npm install
        
      - name: Build
        run: cd functions && npm run build
        
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## 📄 License

This project is proprietary and confidential.

## 👤 Author

**Ganesh Raju**
- LinkedIn: [linkedin.com/in/ganesh-raju015](https://linkedin.com/in/ganesh-raju015)
- GitHub: [github.com/ganeshraju029-star](https://github.com/ganeshraju029-star)
- Email: ganeshraju029@gmail.com

## 🙏 Acknowledgments

- Firebase for the excellent backend infrastructure
- Resend for reliable email delivery
- The open-source community for amazing tools

---

**Built with ❤️ by Ganesh Raju**
