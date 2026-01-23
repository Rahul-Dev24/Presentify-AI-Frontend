# Presentify AI 🎬➡️📊

<div align="center">

**Intelligent Video-to-PPT Tool – A Modern Solution Based on WebAV and FFmpeg**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebAV](https://img.shields.io/badge/WebAV-FF6B35?style=for-the-badge&logo=webassembly&logoColor=white)](https://github.com/hughfenghen/WebAV)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)

[🚀 Live Demo](https://video.liwenkai.fun) | [📖 Usage Guide](#-usage-guide) | [🛠️ Local Deployment](#local-deployment) | [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎯 Core Features

| Feature                       | Description                                                            |
| ----------------------------- | ---------------------------------------------------------------------- |
| 🎥 **Screen Recording**       | Real-time screen recording with system audio and microphone support    |
| 📁 **Local Video Processing** | Upload local video files for intelligent analysis                      |
| 🧠 **Smart Frame Extraction** | Automatically extract key frames using difference detection algorithms |
| 📊 **PPT Generation**         | One-click export to PowerPoint presentations                           |
| 🖼️ **Image Preview**          | Scrollable preview of all extracted images                             |
| 📥 **Batch Download**         | Download single images or all images in bulk                           |

### 🚀 Technical Highlights

- **🎨 Modern UI**: Contemporary design, dark theme, smooth animations
- **⚡ High Performance**: Native-level performance with WebCodecs + WebAssembly
- **🔒 Privacy First**: Fully client-side processing; data never leaves the browser
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
- **🎛️ Intelligent Algorithms**: Dynamic threshold calculation with automatic similar-frame filtering
- **🛡️ Type Safety**: Complete TypeScript type system

## 🛠️ Tech Stack

### Frontend Framework

- **Next.js 15** – React framework with App Router
- **TypeScript** – Type-safe JavaScript
- **Tailwind CSS v4** – Utility-first CSS framework
- **Shadcn/ui** – High-quality UI component library

### Video Processing

- **WebAV** – Modern web video processing library
- **FFmpeg.wasm** – FFmpeg running in the browser
- **WebCodecs API** – Native video encoding/decoding

### UI/UX Enhancements

- **Lucide React** – Icon library
- **Radix UI** – Unstyled UI primitives
- **Class Variance Authority** – Component variant management

## 📦 Quick Start

### Requirements

- **Node.js** 18.x or higher
- **pnpm** 9.x or **npm** 10.x
- **Modern Browser** (Chrome 102+, Edge 102+)

### Local Deployment

```bash
git clone https://github.com/liwenka1/video-to-ppt.git
cd video-to-ppt

pnpm install
# or
npm install

pnpm dev
# or
npm run dev

open http://localhost:3000

```

### Production Deployment

```bash
pnpm build

pnpm start
```

🎮 Usage Guide

1. Screen Recording Mode
   Prepare Recording: Click the "Prepare Recording" button.

Select Screen: Choose the specific screen or window you wish to record.

Start Recording: Click "Start Recording" to begin the capture.

Smart Screenshots: The system automatically detects visual changes and captures screenshots.

Generate PPT: Once recording is finished, generate a PPT with a single click.

2. Local Video Processing
   Upload Video: Drag and drop or select a local video file.

Format Conversion: The file is automatically converted to a compatible format if necessary.

Intelligent Analysis: The system extracts keyframes and filters out duplicate or similar content.

Preview & Confirm: Scroll through and review all extracted images.

Download & Export: Export as a PPT file or batch download the images.

3. Image Management Features ✨
   Full Preview: A scrollable interface to view all extracted frames.

Batch Download: Click the "Download All" button to receive a ZIP file containing all images.

Single Actions: Hover over an individual image to reveal download and preview buttons.

Index Identification: Each image is labeled with a sequence number for easy reference and positioning.

🏗️ Project Structure
Would you like me to translate the Project Structure directory list as well, or help with the technical documentation for the algorithms mentioned later in the file?

```
video-to-ppt/
├── app/
│   ├── (site)/
│   ├── local-video/
│   ├── screen-recording/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ui/
├── lib/
│   ├── video-processing.ts
│   ├── video-diagnostics.ts
│   ├── ppt-generation.ts
│   └── utils.ts
├── data/
├── styles/
├── public/
├── next.config.ts
├── tailwind.config.ts
└── package.json

```

```typescript
/**
 * Calculates the degree of difference between two image frames.
 * Uses the Root Mean Square (RMS) of luminance differences as the standard.
 */
function calculateImageDifference(imgData1: ImageData, imgData2: ImageData): number {
	let sumOfSquares = 0;
	const length = imgData1.data.length;

	for (let i = 0; i < length; i += 4) {
		// Convert RGB to Luminance (Rec. 709 standard)
		const luminance1 = 0.2126 * imgData1.data[i] + 0.7152 * imgData1.data[i + 1] + 0.0722 * imgData1.data[i + 2];

		const luminance2 = 0.2126 * imgData2.data[i] + 0.7152 * imgData2.data[i + 1] + 0.0722 * imgData2.data[i + 2];

		const diff = luminance1 - luminance2;
		sumOfSquares += diff * diff;
	}

	return Math.sqrt(sumOfSquares / (length / 4));
}
```

### Dynamic Threshold Calculation

```typescript
/**
 * Pre-processes the video to calculate the optimal difference threshold.
 * Dynamically adjusts based on video content to improve keyframe extraction accuracy.
 */
async function preprocessVideo(video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<number> {
	const duration = video.duration;
	const sampleCount = Math.min(50, Math.max(20, Math.floor(duration / 10)));
	const differences: number[] = [];

	for (let i = 0; i < sampleCount - 1; i++) {
		// Calculate difference between sampled frames
		const time1 = (duration / sampleCount) * i;
		const time2 = (duration / sampleCount) * (i + 1);

		const diff = await calculateFrameDifference(video, canvas, time1, time2);
		differences.push(diff);
	}

	// Use the median as the baseline threshold
	differences.sort((a, b) => a - b);
	const medianDiff = differences[Math.floor(differences.length / 2)];

	// Set a reasonable threshold range [10, 60]
	return Math.max(10, Math.min(medianDiff, 60));
}
```

## 🎨 Design Highlights

### Modern Design Style

- **🎯 Function First**: Clear visual hierarchy with an intuitive workflow
- **🌙 Dark Theme**: Professional dark color scheme to reduce eye strain
- **🌈 Gradient Backgrounds**: Dynamic blue / purple / cyan gradients
- **💎 Glassmorphism**: Backdrop blur effects with translucent elements
- **⚡ Smooth Animations**: Natural transitions and interactive feedback

### Responsive Design

- **📱 Mobile First**: Mobile-first design principles
- **🖥️ Desktop Optimized**: Best experience on large screens
- **♿ Accessibility Support**: Keyboard navigation and screen reader compatibility
- **🎛️ Status Feedback**: Real-time processing status and progress indicators

## 🚨 Troubleshooting

### Common Issues and Solutions

<details>

<summary><strong>🔧 FFmpeg Import Error</strong></summary>

**Error Message**: `Module not found: Can't resolve '@ffmpeg/ffmpeg'`

**Solution**:

```typescript
// Configuration in next.config.ts
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ffmpeg/ffmpeg': '@ffmpeg/ffmpeg/dist/esm/index.js',
    };
    return config;
  },
};

## 📊 Project Status

![GitHub Stars](https://img.shields.io/github/stars/liwenka1/video-to-ppt?style=social)
![GitHub Forks](https://img.shields.io/github/forks/liwenka1/video-to-ppt?style=social)
![GitHub Issues](https://img.shields.io/github/issues/liwenka1/video-to-ppt)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/liwenka1/video-to-ppt)

---

**🌟 If this project is helpful to you, please give it a Star!**

[⬆️ Back to Top](#Presentify AI-️)

Made with ❤️ by [Rahul Singh](https://github.com/liwenka1)
```
