// components/MainContent.js

export default function MainContent() {
    return (
      <main className="main-content">
          <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Online photo editor for everyone
        </h1>
        <p className="hero-description">
          Our online photo editor offers everything you need to enhance and edit
          photos effortlessly. Experience simple photo editing online for free!
        </p>
        <a href="#edit-now" className="cta-button">
          Edit photo for free
        </a>
      </div>
      <div className="hero-image">
        <div className="editor-preview">
          <div className="editor-sidebar">
            <div className="tool-item">
              <span className="tool-icon">✂️</span>
              <span className="tool-name">Crop</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">🔄</span>
              <span className="tool-name">Resize</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">↻</span>
              <span className="tool-name">Rotate & Flip</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">🔆</span>
              <span className="tool-name">Blush</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">◇</span>
              <span className="tool-name">Reshape</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">😁</span>
              <span className="tool-name">Teeth Whitening</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">✨</span>
              <span className="tool-name">Effects</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">🪄</span>
              <span className="tool-name">Magic Remove</span>
            </div>
          </div>
          <div className="image-preview">
            <div className="before-after">
             
              <div className="retouch-badge">
                <span className="badge-icon">✨</span>
                <span className="badge-text">AI Skin Retouch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-preview">
        <h2 className="features-title">Discover popular features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">✏️</span>
            <span className="feature-text">Create a design</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <span className="feature-text">AI image generator</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon">✨</span>
            <span className="feature-text">Enhance photo</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🖼️</span>
            <span className="feature-text">Remove background</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎨</span>
            <span className="feature-text">Photo to art</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon">👤</span>
            <span className="feature-text">Generate Headshots</span>
          </div>
        </div>
      </div>
    </section>
  
      </main>
    );
  }