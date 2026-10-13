// Mobiel menu
const toggle = document.querySelector('.menu-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
links.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Stemfragmenten: één tegelijk afspelen. Zet het pad naar het mp3-bestand in data-sample.
let current = null;
document.querySelectorAll('.play').forEach((btn) => {
  btn.addEventListener('click', () => {
    const status = btn.closest('.voice').querySelector('.voice-status');
    const src = btn.dataset.sample;
    if (!src) {
      status.textContent = 'Fragment volgt';
      return;
    }
    if (current && current.btn === btn && !current.audio.paused) {
      current.audio.pause();
      status.textContent = '';
      return;
    }
    if (current) {
      current.audio.pause();
      current.status.textContent = '';
    }
    const audio = new Audio(src);
    audio.play();
    status.textContent = 'Speelt af';
    audio.addEventListener('ended', () => { status.textContent = ''; });
    current = { btn, audio, status };
  });
});

// Contactformulier: in dit concept nog niet gekoppeld aan een verzenddienst.
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.elements.email;
  if (!email.value || !email.checkValidity()) {
    note.textContent = 'Vul een geldig e-mailadres in.';
    email.focus();
    return;
  }
  note.textContent = 'Concept: het formulier wordt bij livegang gekoppeld. Mail ons gerust via contact@aiconicvoices.com.';
});
