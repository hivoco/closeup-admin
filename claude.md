# Frontend Documentation - LegacyLens Face Search Application

This document consolidates all project documentation into a single reference guide.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Admin ZIP Upload Feature](#admin-zip-upload-feature)
5. [Backend Integration](#backend-integration)
6. [Deployment Checklist](#deployment-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a Next.js application for face searching and uploading with the following features:

- **Main Application**: Face search and matching interface
- **Admin Panel**: Bulk ZIP file upload for face database management
- **Real-time Progress**: Upload tracking with visual feedback
- **Modern UI**: Built with Tailwind CSS v4 and shadcn/ui components

**Tech Stack**:
- React 19.2.0
- Next.js 16.0.5
- TypeScript 5
- Tailwind CSS v4
- lucide-react (icons)
- jszip (ZIP handling)

---

## Getting Started

### Installation & Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Development Tools

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Learn Next.js**: [nextjs.org/learn](https://nextjs.org/learn)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)
- **Lucide Icons**: [lucide.dev](https://lucide.dev)

---

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                  # Main home page (entry point)
│   ├── layout.tsx                # Root layout with branding
│   ├── globals.css               # Global styles & color scheme
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard (ZIP upload)
│   ├── debug/
│   │   └── page.tsx              # Debug/troubleshooting page
│   └── examples/
│       └── page.tsx              # Examples/demo page
├── components/
│   ├── PhotoUploadWithID.tsx     # Main upload form with ID & phone
│   ├── PhotoUploadBasic.tsx      # Face search interface
│   ├── PhotoUpload.tsx           # Basic upload (examples only)
│   ├── PhotoUploadAdvanced.tsx   # Advanced upload (examples only)
│   ├── ImageDisplay.tsx          # Gallery of search results
│   ├── ZipUpload.tsx             # Admin ZIP upload component
│   ├── Login.tsx                 # Admin login component
│   ├── CameraDebug.tsx           # Camera debugging tool
│   ├── Logo.tsx                  # App logo component
│   ├── ZipUpload.constants.tsx   # ZIP upload configuration
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── badge.tsx
├── lib/
│   ├── fetch.ts                  # API client functions
│   ├── image.ts                  # Image processing utilities
│   └── utils.ts                  # Helper functions (cn)
├── hooks/
│   └── usePhotoCapture.ts        # Photo capture hook
├── public/                       # Static assets
└── Configuration Files
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    └── components.json
```

---

## Admin ZIP Upload Feature

### Overview

A production-ready admin dashboard with advanced ZIP file upload component supporting up to **25GB** files with:
- Real-time progress tracking
- Rotating tips during upload
- Beautiful modern UI matching design system
- Responsive design (mobile to desktop)
- Professional loading and error states

### Quick Start (3 Steps)

#### Step 1: Update Backend URL

Edit `app/admin/page.tsx` (line 9):

```tsx
const [backendUrl, setBackendUrl] = useState('https://api.example.com/upload');
```

#### Step 2: Access the Page

Navigate to:
```
http://localhost:3000/admin
```

#### Step 3: Upload a ZIP File

Users can:
1. Drag and drop a ZIP file
2. Click "Select ZIP File" button
3. See real-time progress with percentage
4. View rotating tips during upload
5. Get success message when done

### Features Implemented

- ✅ **Drag & Drop Interface** - Intuitive file selection
- ✅ **Real-time Progress Tracking** - Visual progress bar with percentage
- ✅ **25GB File Size Limit** - Perfect for large archives
- ✅ **Dynamic Tips During Upload** - Rotating helpful tips every 4 seconds
- ✅ **Cycling Status Messages** - Changes every 2 seconds during upload
- ✅ **Cancel Upload** - Abort in-progress uploads
- ✅ **Error Handling** - User-friendly error messages with icons
- ✅ **Success State** - Celebration with tips for next time
- ✅ **Live Speed Display** - Shows uploaded/total bytes
- ✅ **XHR-based Upload** - Allows proper progress tracking

### Admin Page Layout

```
Header with gradient branding
    ↓
Main upload card (drag & drop)
    ↓
Info grid (3 columns):
├── Max Size: 25 GB
├── Format: .ZIP
└── Speed: Real-time
    ↓
Tips section (4 helpful tips with icons)
    ↓
Backend URL configuration (optional)
```

### Upload States

**Idle State**:
- Upload icon with gradient background
- "Upload Your ZIP File" heading
- Max size: 25 GB info
- Link to fast.com for speed check
- Select ZIP File button

**During Upload**:
- Animated loading spinner
- Real-time progress bar (0-100%)
- Uploaded bytes / Total bytes display
- Rotating tips (every 4 seconds)
- Status messages (every 2 seconds)
- Cancel Upload button

**Success State**:
- Success celebration card
- Total uploaded file size
- Tips for next time
- Upload Another File button
- View Details button

**Error State**:
- Clear error message with icon
- Allow retry

### Tips Displayed During Upload

1. **Wifi Icon** - Maintain a stable internet connection
2. **Eye Icon** - Don't close or refresh this page during upload
3. **Network Icon** - For large files, use a wired connection
4. **Clock Icon** - Upload time depends on your connection speed
5. **CheckCircle Icon** - You'll see a success message when complete
6. **Shield Icon** - Check your connection: fast.com

### Design System Integration

**Colors Used**:
- **Primary**: Fuchsia/Pink (oklch(0.62 0.28 316))
- **Secondary**: Secondary gradient (oklch(0.68 0.24 334))
- **Accent**: Rose (oklch(0.75 0.21 350))
- **Muted**: Light gray (oklch(0.94 0.01 0))
- **Destructive**: Red (oklch(0.63 0.26 15))

**Styling**:
- Linear gradients for modern look
- Rounded corners: 0.875rem (14px)
- Smooth transitions (300ms)
- Shadow effects for depth
- OKLch color space
- Tailwind CSS v4

### Customization

#### Change Max File Size

Edit `components/ZipUpload.tsx` line 128:

```tsx
const maxSize = 10 * 1024 * 1024 * 1024; // Change 10 to desired GB
```

#### Change Tip Rotation Speed

Edit `components/ZipUpload.tsx` line 65:

```tsx
}, 4000); // Change 4000ms to desired value
```

#### Change Status Message Speed

Edit `components/ZipUpload.tsx` line 57:

```tsx
}, 2000); // Change 2000ms to desired value
```

#### Change Upload Area Gradient

Edit `components/ZipUpload.tsx` line 247:

```tsx
isDragging ? 'border-primary bg-linear-to-br from-primary/15 via-primary/8 to-accent/8'
```

#### Add Custom Success Message

Edit `components/ZipUpload.tsx` line 172:

```tsx
successMessage: '✅ Your custom message here'
```

#### Change Progress Bar Color

Edit `components/ZipUpload.tsx` line 284:

```tsx
className="h-full bg-linear-to-r from-primary via-secondary to-accent"
```

---

## Backend Integration

### Backend Requirements

Your backend should:
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field Name**: `file`
- **Max Size**: Handle up to 25GB
- **Response**: HTTP 200-299 for success

### Node.js / Express Example

```bash
npm install express multer cors dotenv
```

```javascript
const express = require('express');
const multer = require('multer');

const app = express();
app.use(require('cors')());

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file' });
  }

  console.log('✅ File uploaded:', req.file.originalname);
  res.json({ success: true, message: 'Upload received' });
});

app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});
```

### Python / Flask Example

```bash
pip install flask flask-cors
```

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file'}), 400

    file = request.files['file']
    file.save(f'uploads/{file.filename}')

    return jsonify({'success': True, 'message': 'File uploaded'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Python / FastAPI Example

```bash
pip install fastapi uvicorn python-multipart
```

```python
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    with open(f'uploads/{file.filename}', 'wb') as f:
        f.write(await file.read())
    return {'success': True, 'message': 'File uploaded'}
```

### Go / Gin Example

```bash
go get github.com/gin-gonic/gin
go get github.com/gin-contrib/cors
```

```go
package main

import "github.com/gin-gonic/gin"

func main() {
    router := gin.Default()
    router.POST("/upload", uploadFile)
    router.Run(":5000")
}

func uploadFile(c *gin.Context) {
    file, _ := c.FormFile("file")
    file.SaveUploadedFile("uploads/" + file.Filename)
    c.JSON(200, gin.H{"success": true})
}
```

### Java / Spring Boot Example

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

```java
@RestController
@CrossOrigin(origins = "*")
public class UploadController {
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        file.transferTo(new File("uploads/" + file.getOriginalFilename()));
        return ResponseEntity.ok(Map.of("success", true));
    }
}
```

### Testing Backend

```bash
# Using cURL
curl -X POST -F "file=@/path/to/archive.zip" http://localhost:5000/upload

# Using Python Requests
import requests
files = {'file': open('archive.zip', 'rb')}
requests.post('http://localhost:5000/upload', files=files)

# From browser console (JavaScript)
const file = document.querySelector('input[type="file"]').files[0];
const formData = new FormData();
formData.append('file', file);
fetch('http://localhost:5000/upload', { method: 'POST', body: formData })
  .then(r => r.json())
  .then(console.log);
```

### Production Considerations

1. **File Storage**: Store in cloud (S3, GCS, Azure Blob)
2. **Virus Scanning**: Use ClamAV or similar
3. **Rate Limiting**: Implement to prevent abuse
4. **Authentication**: Add user authentication
5. **Logging**: Log all uploads with details
6. **Monitoring**: Track upload metrics
7. **HTTPS**: Always use HTTPS
8. **Cleanup**: Delete old uploads periodically

---

## Deployment Checklist

### Pre-Deployment Setup

#### Frontend Configuration
- [ ] Update backend URL in `app/admin/page.tsx` line 9
- [ ] Verify all imports are correct
- [ ] Run `npm run build` and check for errors
- [ ] Test locally at `http://localhost:3000/admin`

#### Backend Setup
- [ ] Backend server is running
- [ ] Backend accepts POST requests
- [ ] Backend expects file in field named `file`
- [ ] Backend returns HTTP 200-299 on success
- [ ] Backend can handle at least 25GB files
- [ ] Uploads directory exists and is writable
- [ ] Logging is configured

### Network & Security

#### CORS Configuration
- [ ] CORS is enabled on backend
- [ ] Frontend domain is in CORS allowed origins
- [ ] Content-Type headers are correct
- [ ] Credentials are handled appropriately

#### HTTPS
- [ ] Frontend uses HTTPS in production
- [ ] Backend uses HTTPS in production
- [ ] SSL certificates are valid
- [ ] Mixed content warnings are resolved

#### Authentication & Authorization
- [ ] Add user authentication to `/admin` route (optional)
- [ ] Verify user is admin before allowing uploads (optional)
- [ ] Log uploads with user information (optional)
- [ ] Implement request signing for security (optional)

### File Handling

#### Validation
- [ ] Backend validates ZIP format
- [ ] Backend checks file size (max 25GB)
- [ ] Reject non-ZIP files
- [ ] Reject corrupted ZIP files
- [ ] Rate limiting is implemented

#### Storage
- [ ] Upload directory has enough disk space
- [ ] File permissions are correct (600 or similar)
- [ ] Uploaded files are not in web root (security)
- [ ] Backup strategy is in place
- [ ] Old uploads are cleaned up periodically

#### Scanning
- [ ] Virus scanning is enabled (optional)
- [ ] Malware detection is configured (optional)
- [ ] Quarantine infected files (optional)

### Testing

#### Manual Testing
- [ ] Upload small ZIP (< 100MB)
  - [ ] File shows in uploads folder
  - [ ] Success message displays
  - [ ] Progress bar works
  - [ ] Tips rotate correctly
- [ ] Upload medium ZIP (500MB - 2GB)
  - [ ] Progress tracking is accurate
  - [ ] Cancel button works
  - [ ] Connection is stable
- [ ] Upload large ZIP (5GB+)
  - [ ] Long uploads complete successfully
  - [ ] Progress updates continuously
  - [ ] No timeout errors
- [ ] Error Scenarios
  - [ ] Non-ZIP file rejected
  - [ ] Oversized file rejected
  - [ ] Network interruption handled
  - [ ] Cancel upload works

#### Device Testing
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Tablet (iPad)

#### Network Conditions
- [ ] Test on slow connection (throttle network)
- [ ] Test on fast connection
- [ ] Test with intermittent drops
- [ ] Verify timeout handling

### Performance

#### Frontend
- [ ] Page loads quickly
- [ ] No console errors
- [ ] No memory leaks during upload
- [ ] Smooth animations (no jank)
- [ ] Responsive on all devices

#### Backend
- [ ] Backend handles concurrent uploads
- [ ] No memory issues with large files
- [ ] CPU usage is reasonable
- [ ] Database queries (if any) are optimized
- [ ] Response times are acceptable

### Monitoring & Logging

#### Logging
- [ ] Frontend logs upload errors
- [ ] Backend logs all uploads
- [ ] Log includes: filename, size, IP, timestamp
- [ ] Logs are stored securely
- [ ] Old logs are archived/deleted

#### Monitoring
- [ ] Disk space is monitored
- [ ] Upload directory is monitored
- [ ] Backend errors trigger alerts
- [ ] Failed uploads are tracked
- [ ] Success rate is tracked

#### Analytics
- [ ] Track upload volume
- [ ] Track average file size
- [ ] Track success rate
- [ ] Track common errors
- [ ] Monitor user patterns

### Backup & Recovery

#### Backups
- [ ] Daily backups of uploads are configured
- [ ] Backups are tested (restore verification)
- [ ] Backups are stored off-site
- [ ] Backup retention policy is defined
- [ ] Recovery time objective (RTO) is acceptable

#### Disaster Recovery
- [ ] Failure scenarios are documented
- [ ] Rollback procedure is tested
- [ ] Alternative upload methods exist
- [ ] Data loss prevention measures are in place

### Production Deployment

#### Environment Setup
- [ ] Environment variables are set correctly
- [ ] Production database is configured
- [ ] Logging level is appropriate
- [ ] Debug mode is disabled
- [ ] Error reporting is configured

#### Deployment Process
- [ ] Code is reviewed
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Staging deployment works
- [ ] Production deployment procedure is documented

#### Post-Deployment
- [ ] Run smoke tests
- [ ] Verify uploads work
- [ ] Check logs for errors
- [ ] Monitor error rates
- [ ] Get team sign-off

### Ongoing Maintenance

#### Daily Tasks
- [ ] Check error logs
- [ ] Monitor disk usage
- [ ] Verify uploads are processing
- [ ] Check system health

#### Weekly Tasks
- [ ] Review upload statistics
- [ ] Check for failed uploads
- [ ] Verify backups completed
- [ ] Review security logs

#### Monthly Tasks
- [ ] Update dependencies
- [ ] Review and optimize queries
- [ ] Test disaster recovery
- [ ] Analyze usage patterns
- [ ] Plan improvements

#### Quarterly Tasks
- [ ] Security audit
- [ ] Performance review
- [ ] Capacity planning
- [ ] Update documentation

### Rollback Plan

If deployment fails or issues are found:

1. **Immediate Actions**
   - [ ] Stop accepting new uploads
   - [ ] Notify users
   - [ ] Investigate error
   - [ ] Review logs

2. **Rollback**
   - [ ] Restore previous version
   - [ ] Restart services
   - [ ] Verify functionality
   - [ ] Communicate to users

3. **Post-Rollback**
   - [ ] Identify root cause
   - [ ] Create bug fix
   - [ ] Re-test thoroughly
   - [ ] Plan re-deployment

### Success Criteria

Your deployment is successful when:

- ✅ Users can upload ZIP files
- ✅ Real-time progress displays
- ✅ Tips rotate during upload
- ✅ Status messages change
- ✅ Success message shows on completion
- ✅ Error handling works
- ✅ Mobile works smoothly
- ✅ No console errors
- ✅ Logs show all uploads
- ✅ Performance is acceptable
- ✅ No timeouts on large files
- ✅ HTTPS is working
- ✅ CORS is configured
- ✅ Rate limiting is active
- ✅ Backups are running

---

## Troubleshooting

### Common Issues

#### Upload Never Completes
- Check backend is running and reachable
- Verify CORS headers allow your frontend domain
- Check browser network tab for failed requests
- Verify backend URL is correct in `app/admin/page.tsx`

#### Progress Bar Stuck
- Browser may have paused the request
- Network connection may have interrupted
- Try cancelling and retrying
- Check server is receiving data

#### Large Files Timeout
- Increase backend timeout (usually 30s default)
- Consider chunked upload for files > 5GB
- Recommend users check speed at [fast.com](https://fast.com)
- Check connection stability

#### Tips Not Showing
- Check browser console for errors
- Verify component mounted correctly
- Tips rotate every 4 seconds - wait a moment
- Verify JavaScript is enabled

#### Progress Inaccurate
- XHR events may batch
- This is normal - final result will be accurate
- Large files may show slower updates

#### Non-ZIP File Rejected
- File validation occurs on frontend
- Ensure file has .zip extension
- Check MIME type is application/zip

#### File Size Rejected
- Default limit is 25GB
- Verify file size in bytes
- Check configuration in `components/ZipUpload.tsx` line 86

### Browser Support

- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari 12+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires:
- JavaScript enabled
- Fetch/XHR support
- FormData API
- HTML5 File API

### Performance Considerations

- **XHR for Progress**: More reliable than Fetch API for large files
- **Progress Throttling**: Updates happen naturally with XHR events
- **Lightweight Component**: ~15KB gzipped
- **No Dependencies**: Uses native browser APIs
- **Optimized Rendering**: Only updates when state changes

### Security Notes

1. **File Validation**: Check on backend that file is actually a ZIP
2. **CORS**: Configure CORS headers on your backend if needed
3. **File Size**: Consider storage limits on your backend
4. **Virus Scan**: Add antivirus scanning on backend for received files
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **HTTPS**: Always use HTTPS in production
7. **Authentication**: Add authentication to `/admin` route
8. **Input Validation**: Never trust client-side validation alone

---

## Useful Commands

### Build & Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality
```

### Deployment (if using Vercel)

The easiest way to deploy is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Backend Monitoring
```bash
tail -f logs/upload.log  # Watch upload logs
du -sh uploads/          # Check upload folder size
ls -lh uploads/ | wc -l  # Count uploaded files
```

---

## Key Files Reference

### Entry Points
- [app/page.tsx](app/page.tsx) - Main home page
- [app/admin/page.tsx](app/admin/page.tsx) - Admin dashboard

### Core Components
- [components/PhotoUploadWithID.tsx](components/PhotoUploadWithID.tsx) - Main upload form
- [components/PhotoUploadBasic.tsx](components/PhotoUploadBasic.tsx) - Face search
- [components/ImageDisplay.tsx](components/ImageDisplay.tsx) - Results gallery
- [components/ZipUpload.tsx](components/ZipUpload.tsx) - Admin ZIP upload

### Utilities
- [lib/fetch.ts](lib/fetch.ts) - API client
- [lib/image.ts](lib/image.ts) - Image processing
- [hooks/usePhotoCapture.ts](hooks/usePhotoCapture.ts) - Photo capture hook

### Configuration
- [app/globals.css](app/globals.css) - Global styles
- [components/ZipUpload.constants.tsx](components/ZipUpload.constants.tsx) - ZIP upload config
- [next.config.ts](next.config.ts) - Next.js config

---

## Support & Resources

For questions or issues:

1. **Check this documentation** first
2. **Browser console** (F12) for error messages
3. **Network tab** for failed requests
4. **Backend logs** for upload errors
5. **[GitHub Issues](https://github.com/anthropics/claude-code/issues)** for bug reports

---

**Status**: ✅ Complete & Production Ready
**Last Updated**: December 2024
**Version**: 1.0
