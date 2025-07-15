# 💥 Fury Wars Strategy Hub

A comprehensive strategy and gaming website for Fury Wars Online - featuring game reviews, gameplay videos, weapon analysis, character guides, and interactive gameplay experience.

## 🎮 Features

- **Interactive Game Experience**: Embedded Fury Wars gameplay with Ruffle Flash Player
- **Video Preview System**: Click-to-play video previews with YouTube integration
- **Comprehensive Game Guide**: Detailed weapon analysis and character strategies
- **Screenshot Gallery**: High-quality game screenshots with modal viewing
- **Responsive Design**: Mobile-friendly layout with modern UI/UX
- **SEO Optimized**: Structured data, meta tags, and semantic HTML

## 🚀 Live Demo

Visit the live website: [Fury Wars Strategy Hub](https://your-domain.pages.dev)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with animations and responsive design
- **Game Integration**: Ruffle Flash Player for web compatibility
- **Video Player**: YouTube embedded videos with custom modal system
- **Deployment**: Cloudflare Pages
- **Version Control**: Git & GitHub

## 📁 Project Structure

```
furywars/
├── index.html              # Main website page
├── css/
│   ├── style.css          # Main stylesheet
│   └── animations.css     # Animation styles
├── js/
│   ├── main.js           # Core JavaScript functionality
│   ├── particles.js      # Particle background effects
│   ├── games-data.js     # Game data management
│   └── game-renderer.js  # Game rendering system
├── images/               # Game screenshots and assets
│   ├── jietu1.jpeg      # Game screenshots
│   ├── jietu2.jpeg
│   ├── ...
│   ├── video-preview-1.jpg  # Video preview images
│   ├── video-preview-2.jpg
│   └── video-preview-3.jpg
├── audio/               # Audio files (optional)
├── start-server.bat     # Local development server script
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## 🎯 Key Features Breakdown

### 🎮 Game Integration
- Embedded Fury Wars game using Ruffle Flash Player
- Multiple game access options (embedded, popup, direct link)
- Game loading diagnostics and error handling
- Responsive game container with fullscreen support

### 🎬 Video System
- Interactive video previews with hover effects
- YouTube embedded videos with autoplay
- Custom modal video player
- Video statistics and channel information

### 📸 Screenshot Gallery
- High-quality game screenshots
- Click-to-enlarge modal viewing
- Detailed descriptions for each screenshot
- Responsive grid layout

### 🔱 Weapon & Character Analysis
- Detailed weapon statistics and descriptions
- Character class breakdown with abilities
- Team composition strategies
- Game mode specific tactics

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Node.js (for local development server)
- Git (for version control)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fury-wars-hub.git
cd fury-wars-hub
```

2. Start local development server:
```bash
# Using Node.js http-server
npx http-server . -p 8000 -o

# Or using Python
python -m http.server 8000

# Or using the provided batch script (Windows)
start-server.bat
```

3. Open your browser and navigate to `http://localhost:8000`

## 📦 Deployment

### Cloudflare Pages Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Cloudflare Pages
3. Configure build settings:
   - **Build command**: (none required)
   - **Build output directory**: `/`
   - **Root directory**: `/`

4. Deploy and enjoy your live website!

## 🎨 Customization

### Adding New Videos
1. Add video preview images to `/images/` directory
2. Update video data in `js/main.js`:
```javascript
const videoData = {
    video4: {
        title: 'New Video Title',
        embedUrl: 'https://www.youtube.com/embed/VIDEO_ID',
        description: 'Video description'
    }
};
```
3. Add HTML structure in `index.html` for the new video card

### Adding New Screenshots
1. Add screenshot images to `/images/` directory
2. Add screenshot HTML structure in the screenshots section
3. Images will automatically work with the existing modal system

### Styling Customization
- Main styles: `css/style.css`
- Animations: `css/animations.css`
- Colors, fonts, and layouts can be easily modified

## 🔧 Browser Compatibility

- **Chrome**: ✅ Fully supported
- **Firefox**: ✅ Fully supported
- **Safari**: ✅ Fully supported
- **Edge**: ✅ Fully supported
- **Mobile browsers**: ✅ Responsive design

## 📱 Mobile Responsiveness

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎪 Interactive Features

- **Particle Background**: Animated particle effects
- **Hover Animations**: Interactive hover effects on cards and buttons
- **Keyboard Shortcuts**: 
  - `F` - Toggle fullscreen
  - `M` - Toggle audio
  - `Space` - Start game
  - `ESC` - Close modals
  - `Ctrl+V` - Play first video

## 🔍 SEO Features

- Semantic HTML structure
- Meta tags and Open Graph optimization
- Structured data (JSON-LD)
- Sitemap ready
- Performance optimized

## 📈 Performance

- Optimized images with lazy loading
- Minimal JavaScript dependencies
- CSS animations using GPU acceleration
- Compressed assets for faster loading

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Game Credits

- **Game**: Fury Wars Online
- **Developer**: APPWILL COMPANY LTD
- **Flash Player**: Ruffle (Rust-based Flash Player emulator)

## 📞 Support

For support, please open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com).

## 🌟 Acknowledgments

- Thanks to the Ruffle project for Flash Player emulation
- YouTube for video embedding capabilities
- Cloudflare for reliable hosting

---

**Enjoy playing Fury Wars and mastering the explosive combat strategies!** 💥🎮 