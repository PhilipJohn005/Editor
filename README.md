# Certificate Editor

A powerful web-based certificate design and editing application built with React, TypeScript, and Fabric.js. Create, customize, and export professional certificates with an intuitive drag-and-drop interface.

## 🚀 Features

### Canvas Editor
- **Custom Canvas Sizes**: Create certificates in custom dimensions or standard A4 formats (portrait/landscape)
- **Visual Canvas Editor**: Powered by Fabric.js for smooth object manipulation
- **Zoom Controls**: Zoom in/out functionality with visual zoom percentage display
- **Smart Snapping**: Objects snap to canvas edges and center with visual guidelines
- **Layer Management**: Move objects up/down in layers with visual controls

### Design Elements
- **Text Elements**:
  - Static Text: Add regular text with full formatting options
  - Dynamic Text: Add placeholder text fields (e.g., `{Name}`) for template usage
  - Font customization (size, family, color, alignment)
  - Real-time text editing with property panel

- **Image Management**:
  - Upload images with progress tracking
  - Automatic S3 cloud storage integration
  - Image library for reusing uploaded assets
  - Smart image scaling and boundary constraints
  - Drag-and-drop image placement

- **Verification Elements**:
  - Digital Signature integration
  - QR Code

### Advanced Functionality
- **Export Options**: Export certificates as PDF with high-quality rendering
- **Responsive Design**: Works across different screen sizes
- **Object Controls**: Delete, move, resize, and rotate objects with visual feedback

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Fabric.js 6.6.2** for canvas manipulation
- **Tailwind CSS 4.1.3** for styling
- **React Router DOM** for navigation
- **Axios** for API communication
- **Vite** for development and building

### Backend
- **Node.js** with Express 5.1.0
- **MongoDB** with Mongoose for data persistence
- **AWS S3** for image storage with presigned URLs
- **CORS** enabled for cross-origin requests

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Concurrently** for running frontend and backend together

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd certificate-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   PORT=3001
   ```

## 🚀 Running the Application

### Development Mode

**Run both frontend and backend together:**
```bash
npm run dev:fullstack
```

**Run frontend only:**
```bash
npm run dev
```

**Run backend only:**
```bash
npm run backend
```

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Sidebar/           # Sidebar with design tools
│   │   │   ├── MiniPanels/    # Individual tool panels
│   │   │   └── SidebarMenu/   # Navigation menu
│   │   ├── Template/          # Image handling components
│   │   ├── DeleteComponent.tsx # Object deletion
│   │   ├── Export.tsx         # PDF export functionality
│   │   ├── LayerList.tsx      # Layer management
│   │   ├── Progressbar.tsx    # Upload progress
│   │   └── Snapping.tsx       # Smart snapping system
│   ├── App.tsx               # Main canvas editor
│   ├── CanvasSetup.tsx       # Initial canvas configuration
│   └── main.tsx              # Application entry point
├── backend/
│   └── index.mts             # Express server with MongoDB & S3
└── package.json              # Dependencies and scripts
```

## 🎯 Usage

1. **Start the Application**: Run `npm run dev:fullstack`
2. **Create Canvas**: Choose canvas size or use A4 presets
3. **Design Certificate**: 
   - Add text elements from the sidebar
   - Upload and position images
   - Add verification elements (signatures, QR codes)
4. **Customize**: Use the property panel to adjust fonts, colors, and alignment
5. **Save**: Canvas automatically saves to database
6. **Export**: Generate PDF version of your certificate

## 🔧 API Endpoints

- `POST /certificate` - Create new certificate
- `GET /certificate/:id` - Retrieve certificate data
- `PUT /certificate/:id` - Update certificate
- `POST /certificate/:id/elements` - Add elements to certificate
- `GET /get-presigned-url` - Get S3 upload URL for images

## 🎨 Design Features

- **Smart Guidelines**: Visual snapping guides for precise alignment
- **Boundary Constraints**: Objects stay within canvas bounds
- **Real-time Updates**: All changes sync immediately
- **Professional Export**: High-quality PDF generation
- **Responsive Interface**: Adapts to different screen sizes

## 🔒 Data Storage

- **Canvas Data**: Stored in MongoDB with full object serialization
- **Images**: Uploaded to AWS S3 with secure presigned URLs
- **Auto-backup**: All changes automatically saved to database

---

## 📄 License

This project is private and proprietary.  
Copyright (c) 2025 Sertify. All rights reserved.
