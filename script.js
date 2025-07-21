const audio = document.getElementById('music-player');
const playPauseBtn = document.getElementById('play-pause-button');
const prevBtn = document.getElementById('prev-button');
const nextBtn = document.getElementById('next-button');
const progressBar = document.getElementById('progress-bar');
const volumeControl = document.getElementById('volume-control');
const songTitle = document.getElementById('song-title');
const musicImage = document.getElementById('music-image');

const songs = [
  { title: "Her", file: "audio/her.mp3", cover: "img/songcover.jpg" },
];

let currentSongIndex = 0;
let isPlaying = false;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.file;
  songTitle.textContent = song.title;
  musicImage.src = song.cover;
  progressBar.value = 0;
}

loadSong(currentSongIndex);

function playSong() {
  audio.play().catch(() => {}); // catch if play blocked
  isPlaying = true;
  playPauseBtn.textContent = "Pause";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = "Play";
}

playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
});

nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

progressBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});

// Initialize volume
audio.volume = volumeControl.value;

// Enter screen logic - click to start music and remove overlay
const enterScreen = document.getElementById('enter-screen');
enterScreen.addEventListener('click', () => {
  enterScreen.style.display = 'none';
  playSong();
});

// DROPDOWN toggles
const dropdownHeaders = document.querySelectorAll('.dropdown-header.clickable');
dropdownHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const dropdownContent = header.nextElementSibling;
    if (!dropdownContent) return;
    dropdownContent.classList.toggle('active');
  });
});
// Simple particles animation (like snowflakes floating)
// Uses canvas with white semi-transparent small circles

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particlesArray;

const colors = ['rgba(255, 255, 255, 0.3)', 'rgba(168, 208, 255, 0.2)', 'rgba(69, 123, 185, 0.37)'];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 1 + 0.2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.y += this.speedY;
    if (this.y > canvas.height) {
      this.y = 0 - this.size;
      this.x = Math.random() * canvas.width;
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  const numberOfParticles = 80;
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
  resizeCanvas();
  init();
});

resizeCanvas();
init();
animate();
// DELIBERATELY UNSAFE XSS DEMO
const submitBtn = document.getElementById("submit-btn");
const userInput = document.getElementById("user-input");
const output = document.getElementById("output");

submitBtn.addEventListener("click", () => {
  const input = userInput.value;
  output.innerHTML = input; 
});
