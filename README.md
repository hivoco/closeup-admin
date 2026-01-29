# CloseUp Video Generation - Frontend

Next.js frontend application for the CloseUp video generation system with camera capture, OTP verification, and admin dashboard.

## Features

### User Flow
1. **Video Submission Form** (`/video`)
   - Camera capture for selfies using device front camera
   - Real-time photo validation using Groq AI
   - Form fields: mobile number, gender, attribute love, relationship status, vibe
   - Photo validation checks for:
     - Religious symbols
     - NSFW content
     - Image quality
     - Face visibility

2. **OTP Verification**
   - 6-digit OTP input with auto-focus
   - Paste support for quick entry
   - Resend OTP functionality
   - Real-time validation

3. **Success Screen**
   - Job ID reference
   - WhatsApp delivery notification

### Admin Dashboard
- **Video Jobs List** (`/video-jobs`)
  - Paginated job listings
  - Advanced filtering:
    - Status (queued, processing, completed, failed, etc.)
    - Failed stage (photo, lipsync, stitch, delivery)
    - User ID
    - Date range
  - Mobile number display (decrypted)
  - Retry count tracking
  - Real-time updates

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 20+
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

The production server runs on port 8110.

## API Endpoints Used

### Video Submission
- `POST /api/v1/video/submit` - Submit video form with photo
- `POST /api/v1/photo-validation/check_photo` - Validate captured photo

### Authentication
- `POST /api/v1/auth/verify-otp` - Verify OTP code

### Admin Dashboard
- `GET /api/v1/video-jobs/list` - List video jobs with filters
- `GET /api/v1/video-jobs/{job_id}` - Get specific job details
- `PATCH /api/v1/video-jobs/{job_id}/status` - Update job status
- `PATCH /api/v1/video-jobs/update-job` - Update job by user_id and job_id

## Project Structure

```
frontend/
├── app/
│   ├── video/              # Video submission page
│   │   └── page.tsx
│   ├── video-jobs/         # Admin dashboard
│   │   └── page.tsx
│   ├── admin/              # Original admin (legacy)
│   │   └── page.tsx
│   └── page.tsx            # Home page
├── components/
│   ├── CameraCapture.tsx         # Camera component
│   ├── VideoSubmissionForm.tsx   # Main form component
│   ├── OTPVerification.tsx       # OTP input component
│   └── ui/                       # Shared UI components
└── public/
```

## Key Components

### CameraCapture
- Opens device front camera
- Captures photo on button click
- Shows preview with validation status
- Supports retake functionality

### VideoSubmissionForm
- Collects all required user information
- Integrates camera capture
- Calls photo validation API
- Handles form submission

### OTPVerification
- 6-digit OTP input with auto-focus
- Keyboard navigation support
- Paste support for codes
- Resend OTP functionality
- Real-time error handling

### VideoJobsPage (Admin)
- Filterable job list
- Status badges with color coding
- Pagination controls
- Refresh functionality
- Responsive table design

## Environment Variables

No environment variables needed - API URLs are hardcoded to `http://localhost:8000`.

To change the backend URL, update the fetch calls in:
- `components/VideoSubmissionForm.tsx`
- `components/OTPVerification.tsx`
- `app/video-jobs/page.tsx`

## Camera Permissions

The application requires camera access. When first loaded, the browser will request permission to use the camera. Make sure to:
1. Allow camera access when prompted
2. Use HTTPS in production (required for camera API)
3. Test on actual devices for best camera experience

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14.1+
- Edge 90+

Requires modern browser with:
- MediaDevices API
- getUserMedia support
- ES2020+ features

## Screenshots

### Video Submission Flow
1. Form with camera capture
2. Photo validation feedback
3. OTP verification screen
4. Success confirmation

### Admin Dashboard
- Job listings with filters
- Status indicators
- Pagination controls

## Development Notes

- Camera only works on HTTPS or localhost
- Photo validation requires backend API running
- OTP is sent via backend, not stored in frontend
- All API calls include error handling
- Mobile responsive design throughout

## Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS (or localhost)
- Try different browser
- Check device camera access

### API Errors
- Verify backend is running on port 8000
- Check CORS configuration
- Verify API endpoints match
- Check network tab for details

### Photo Validation Failing
- Ensure Groq API key is set in backend
- Check image size (< 5MB)
- Verify image format (JPEG/PNG)
- Check backend logs

## License

Proprietary - CloseUp/Hivoco
# closeup-admin
