
const CONFIG = {
  alias: 'Murdered.lol',
  displayName: 'DORM',
  bio: 'AP/CE.',
  avatar: 'assets/46ad02263ac4b77bacb26c34c567118f.jpg',
  accentA: '#7c3aed',
  accentB: '#06b6d4',
  analyticsKeyPrefix: 'dorm_analytics_',
  links: [
    { id: '1', title: 'murdered.lol', url: 'https://murdered.lol', emoji: '', pinned: true },
    { id: '2', title: 'Telegram', url: 'https://t.me/valuingniggers', emoji: '' },
    { id: '3', title: 'Biolink', url: 'https://larping.ink', emoji: '' },
    { id: '4', title: 'Doxbin', url: 'doxbin.com/user/valuing', emoji: '' },
    { id: '5', title: 'Discord', url: 'discord.com/wgwgwgwuhyg', emoji: '' },
    { id: '6', title: 'Nohello', url: 'https://www.nohello.com/', emoji: '' },
    
  ]
};
document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.querySelector("title");
  const aliasEl = document.querySelector(".alias"); // main name element


  const titlePhrases = [
    "DORM",
    "Biolink",
    "Welcome.",
    "AP/CE.",
    "Online",
  ];

  let index = 0;
  const changeInterval = 1500; // milliseconds between swaps
  const effect = "glitch"; // "fade" or "glitch"

  function setAliasText(newText) {
    if (!aliasEl) return;

    if (effect === "fade") {
      aliasEl.classList.add("fade-out");
      setTimeout(() => {
        aliasEl.textContent = newText;
        aliasEl.classList.remove("fade-out");
        aliasEl.classList.add("fade-in");
        setTimeout(() => aliasEl.classList.remove("fade-in"), 400);
      }, 400);
    } else if (effect === "glitch") {
      aliasEl.classList.add("glitching");
      setTimeout(() => {
        aliasEl.textContent = newText;
        aliasEl.classList.remove("glitching");
      }, 400);
    } else {
      aliasEl.textContent = newText;
    }
  }

  function cycleTitles() {
    const current = titlePhrases[index % titlePhrases.length];
    document.title = current;
    setAliasText(current);
    index++;
  }

  // start loop
  cycleTitles();
  setInterval(cycleTitles, changeInterval);
});

const audio = document.getElementById('bg-music');
function startMusic() {
    audio.play().catch(err => console.log("Playback blocked:", err));
    document.removeEventListener('click', startMusic);
    document.removeEventListener('keydown', startMusic);
}
document.addEventListener('click', startMusic);
document.addEventListener('keydown', startMusic);
// Handles the intro overlay and background music start
document.addEventListener("DOMContentLoaded", () => {
  const enterScreen = document.getElementById("enter-screen");
  const enterBtn = document.getElementById("enter-btn");
  const music = document.getElementById("bg-music");
  const player = document.getElementById("music-player");

  function startSite() {
    // fade out overlay
    enterScreen.classList.add("fade-out");
    setTimeout(() => {
      enterScreen.style.display = "none";
      player.classList.remove("hidden");

      // start music
      try {
        music.volume = 0.5;
        music.play();
      } catch (err) {
        console.warn("Music play blocked:", err);
      }
    }, 600);
  }

  enterBtn.addEventListener("click", startSite);
});
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bg-music");
  const playBtn = document.getElementById("play-btn");
  const progress = document.getElementById("progress");
  const volume = document.getElementById("volume");
  const timeEl = document.getElementById("time");

  // Toggle play/pause
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = "⏸";
    } else {
      audio.pause();
      playBtn.innerHTML = "▶️";
    }
  });

  // Update progress bar
  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent || 0;
    timeEl.textContent = formatTime(audio.currentTime);
  });

  // Seek
  progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
  });

  // Volume
  volume.addEventListener("input", () => {
    audio.volume = volume.value / 100;
  });

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
});