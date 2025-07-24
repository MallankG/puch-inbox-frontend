# Puch.ai - Gmail Inbox Management Assistant

Puch.ai is an AI-powered email assistant designed to streamline Gmail inbox management for busy professionals and SMBs. It automates the identification and handling of email subscriptions, enables quick unsubscriptions, and supports advanced AI-driven email summaries and communication—all from a unified dashboard.

## Detailed Features

### Subscription Management
- Automatically scans your Gmail inbox to detect and categorize email subscriptions.
- Categorizes subscriptions into groups such as Free, Paid, and Promo for better visibility.
- Provides a centralized view of all subscriptions, making it easy to manage them in one place.

### One-Click Unsubscribe
- Allows users to unsubscribe from unwanted emails with a single click.
- Displays real-time feedback on the success or failure of unsubscribe actions.
- Handles edge cases where unsubscribe links are missing by leveraging AI to suggest alternative actions.

### AI Summaries
- Uses advanced AI models to generate concise summaries of your emails.
- Helps users quickly identify urgent or important messages without reading through entire threads.
- Provides fallback options in case of AI errors, ensuring a seamless user experience.

### Scheduling & Reminders
- Enables users to schedule email sends, such as "Send tomorrow at 8 AM."
- Sends reminders for important emails via SMS or WhatsApp, ensuring you never miss a critical message.
- Includes error handling for undelivered notifications, with retry options.

### Dashboard
- Features a clean and intuitive interface for managing subscriptions and inbox organization.
- Provides real-time progress updates for actions like inbox scans and unsubscribe requests.
- Includes bulk actions for multi-select unsubscribe or archive, with confirmation dialogs for safety.

### Sorting & Filtering
- Offers advanced sorting and filtering options to help users focus on what matters most.
- Allows users to tag emails for better organization, such as marking promotional emails or notification-only messages.

### Accessibility & User Experience
- Designed with accessibility in mind, featuring high contrast, keyboard navigation, and responsive layouts for both desktop and mobile.
- Provides context-sensitive help and tooltips for new users.
- Ensures real-time feedback on all actions, with non-blocking loaders for lengthy operations.

## Target Audience

Puch.ai is tailored for:

- **Startup Founders**: Reduce noise and distractions by managing newsletters and service subscriptions.
- **Freelancers**: Control recurring costs and save time on repetitive client communication.
- **SMB Operations Leads**: Ensure important opportunities are not lost by tagging promotional and notification-only emails.

## Tools and Technologies Used

- **Frontend**: Built with React and TypeScript, leveraging Vite for fast builds.
- **Styling**: Tailwind CSS for responsive and modern UI design.
- **Backend**: Node.js for server-side operations and API integrations.
- **AI Integration**: OpenAI/Gemini for text classification and summarization.
- **Authentication**: Google OAuth 2.0 for secure Gmail integration.
- **Notifications**: Twilio API for SMS and WhatsApp reminders.
- **Task Scheduling**: BullMQ for asynchronous processing of heavy operations.
- **Error Handling**: Comprehensive logging and retry mechanisms for robust user experience.

## Privacy and Security

- All Gmail data is fetched via secure, encrypted channels.
- Minimal metadata-only storage for user emails—no bodies or private content persisted beyond what’s essential.
- GDPR and major privacy compliance baseline.


