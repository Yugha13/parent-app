# Parent App

A mobile application for parents to track their children's school activities, attendance, homework, exams, and fees.

## Features

### Attendance Tracking
- View attendance by week, month, or year
- Color-coded status indicators (present, absent, late)
- Overall attendance percentage with visual indicator
- Collapsible month sections in year view

### Homework Management
- Today's homework with subject and summary
- Expandable details for full information, notes, and attachments
- Yesterday's homework status (Completed/Pending/Not Submitted)
- Home screen widget showing pending homework count

### Exam Tracking
- Upcoming exams with date, subject, and type information (Unit Test, Mid-Term, End-Term)
- Notification when exam schedule is not yet available
- Ongoing/scheduled exams with details
- Completed exams with marks scored, total marks, and teacher remarks

### Fees Management
- Total due amount display with Pay Now button
- Payment options for full amount or by category
- Category-wise fee breakdown (Academics, Library, Transport, Other fees)
- Each category shows due amount and payment status (Paid/Partially Paid/Pending)
- Multiple payment methods (Card, UPI, Net Banking)

## Design Principles

- Minimal and clean interface for easy reading
- Card or list views for organized information display
- Intuitive icons for quick identification (Attendance – calendar, Homework – notebook, Exams – test icon, Fees – rupee symbol)
- Smooth transitions for expanding/collapsing details
- Consistent color coding for status indicators

## Technology Stack

- React Native with Expo
- TypeScript for type safety
- React Navigation for routing
- i18next for internationalization

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd parent-app

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on a Device

- Use the Expo Go app on your mobile device
- Scan the QR code from the terminal
- Or run on an emulator/simulator

## Project Structure

- `/app`: Main application screens
- `/components`: Reusable UI components
- `/data`: Mock data for development
- `/styles`: Common styles and theme configuration
- `/types`: TypeScript type definitions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.