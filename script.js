const pages = [...document.querySelectorAll('.page')];
const nav = document.getElementById('nav');
const toggle = document.getElementById('menuToggle');
const links = [...document.querySelectorAll('a[href^="#"]')];
const soundToggle = document.getElementById('soundToggle');
let soundEnabled = true;
let audioContext;

function playClick() {
  if (!soundEnabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(620, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(430, audioContext.currentTime + 0.045);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.025, audioContext.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.065);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.07);
  } catch (_) {}
}

function showPage(id, updateHash = true) {
  const target = pages.find(page => page.dataset.page === id) || pages[0];
  if (target.classList.contains('active')) return;
  pages.forEach(page => page.classList.toggle('active', page === target));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${target.id}`);
  });
  if (updateHash && location.hash !== `#${target.id}`) history.pushState({page:id}, '', `#${target.id}`);
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({top:0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
}

links.forEach(link => link.addEventListener('click', event => {
  const id = link.getAttribute('href').slice(1);
  if (pages.some(page => page.dataset.page === id)) {
    event.preventDefault();
    playClick();
    showPage(id);
  }
}));
toggle.addEventListener('click', () => {
  playClick();
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
soundToggle?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  if (soundEnabled) playClick();
});
document.querySelectorAll('a[target="_blank"], .button').forEach(el => {
  el.addEventListener('click', () => playClick());
});
window.addEventListener('popstate', () => {
  const target = pages.find(page => page.dataset.page === location.hash.slice(1)) || pages[0];
  pages.forEach(page => page.classList.toggle('active', page === target));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${target.id}`));
});
window.addEventListener('DOMContentLoaded', () => {
  const target = pages.find(page => page.dataset.page === location.hash.slice(1)) || pages[0];
  pages.forEach(page => page.classList.toggle('active', page === target));
  document.getElementById('year').textContent = new Date().getFullYear();
});
