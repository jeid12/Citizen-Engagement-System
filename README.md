# Citizen Engagement System (CES) - Rwanda

A modern platform that bridges the gap between citizens and government agencies in Rwanda, enabling efficient complaint management and public service feedback.

## Features

- 🌍 Multilingual Support (English and Kinyarwanda)
- 📱 Mobile-First Responsive Design
- 🎫 Complaint Submission and Tracking
- 🔄 Automated Complaint Routing
- 👥 Citizen and Agency Portals
- 📊 Real-time Status Updates
- 🔒 Secure Authentication

## Tech Stack

- Next.js 14 with TypeScript
- Chakra UI for modern, accessible components
- Prisma for database management
- NextAuth.js for authentication
- PostgreSQL database

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/citizen-engagement-system.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
citizen-engagement-system/
├── components/       # Reusable UI components
├── pages/           # Next.js pages and API routes
├── prisma/          # Database schema and migrations
├── public/          # Static assets
├── styles/          # Global styles
├── types/           # TypeScript type definitions
└── utils/           # Helper functions and utilities
```

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting any changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 