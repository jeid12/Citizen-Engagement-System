# Citizen Engagement System (CES) - Rwanda

A modern web application that enables citizens to submit and track complaints/issues to government agencies in Rwanda.

## Features

- **User Authentication**
  - Email-based registration with verification
  - Secure login system
  - Password reset functionality

- **Complaint Management**
  - Submit new complaints
  - Track complaint status
  - Attach supporting documents
  - Categorize complaints by type
  - Location-based complaint tracking

- **Agency Integration**
  - Agency-specific dashboards
  - Complaint assignment and tracking
  - Response management
  - Status updates

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Material-UI (MUI) for UI components
- Redux Toolkit for state management
- React Router for navigation
- Formik & Yup for form handling
- Axios for API requests

### Backend
- Node.js with TypeScript
- Express.js framework
- TypeORM for database management
- PostgreSQL (hosted on Render)
- JWT for authentication
- Nodemailer for email services

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Citizen-Engagement-System.git
cd Citizen-Engagement-System
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

4. Set up Environment Variables

Backend (.env):
```env
DATABASE_URL=your_render_postgres_url
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

Frontend (.env):
```env
VITE_API_URL=http://localhost:5000
```

5. Start Development Servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Project Structure

```
citizen-engagement-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── theme/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── entity/
    │   ├── middleware/
    │   ├── routes/
    │   ├── services/
    │   └── index.ts
    └── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/verify/:token` - Verify email
- POST `/api/auth/forgot-password` - Request password reset

### Complaints
- POST `/api/complaints` - Submit new complaint
- GET `/api/complaints` - List user's complaints
- GET `/api/complaints/:id` - Get complaint details
- PUT `/api/complaints/:id` - Update complaint
- DELETE `/api/complaints/:id` - Delete complaint

### Categories
- GET `/api/categories` - List complaint categories
- POST `/api/categories` - Create new category (admin only)

### Agencies
- GET `/api/agencies` - List agencies
- GET `/api/agencies/:id/complaints` - List agency complaints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Rwanda ICT Chamber
- Government of Rwanda
- All contributors and supporters

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/Citizen-Engagement-System](https://github.com/yourusername/Citizen-Engagement-System) 