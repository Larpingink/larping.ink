setInterval(() => {
  if (Math.random() > 0.7) {
    const glitch = document.createElement('div');
    glitch.style.position = 'fixed';
    glitch.style.top = Math.random() * 100 + 'vh';
    glitch.style.left = Math.random() * 100 + 'vw';
    glitch.style.width = Math.random() * 20 + 'px';
    glitch.style.height = '1px';
    glitch.style.background = '#ffffff';
    glitch.style.opacity = '0.5';
    document.body.appendChild(glitch);
    setTimeout(() => glitch.remove(), 100);
  }
}, 50); 
