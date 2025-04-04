# LUSIP Website

## Project Overview
The LUSIP website is an efficient and comprehensive platform designed to streamline the management of the Summer Internship Program at LNMIIT. It serves as a central hub for faculty, admins, and students to seamlessly interact with project listings, application submissions, and project management. The system offers a user-friendly and robust interface that enhances productivity and collaboration.

## Features
- Three-role management system (Faculty, Admin, Student)
- Faculty: Create and manage projects, view student applications
- Admin: Manage faculty accounts, view all projects, approve or reject applications
- Student: Browse available projects, apply for internships, track application status
- Automated email notifications for application updates
- Robust and intuitive user interface

## Tech Stack
- Frontend: React, HTML, CSS
- Backend: Node.js, Express.js
- Database: MySQL
- Mail: Nodemailer for email notifications
- Authentication: JWT-based user authentication

## Getting Started

### Prerequisites
- Node.js installed
- MySQL installed

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/anshgupta-007/LUSIP-Updated.git
   ```
2. Install dependencies:
   ```bash
   cd lusip-website
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=password
     DB_NAME=lusip_db
     JWT_SECRET=your_jwt_secret
     MAIL_USER=your_email@example.com
     MAIL_PASS=your_email_password
     ```

### Running the Application
```bash
npm start
```

### Access
Visit `http://localhost:3000` to access the website.

## Contributing
Contributions are welcome! Please feel free to open issues or submit pull requests. For any questions, you can reach out via email at [anshguptahoney@gmail.com](mailto:anshguptahoney@gmail.com).

## License
This project is licensed under the MIT License.

