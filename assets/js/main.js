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
    status.textContent = 'Speelt af';
    audio.play().catch(() => { status.textContent = 'Afspelen lukt niet'; });
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

// Gezichten bovenaan: om de paar seconden zacht een ander gezicht uit de pool tonen.
const collage = document.querySelector('.collage');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (collage && !reduceMotion) {
  const pool = ['manuel', 'martine', 'alkan', 'machteld', 'joshua', 'shari', 'tom', 'zoe', 'hans',
    'annefleur', 'dasilvian', 'dominik', 'barbara', 'ferdi', 'cas', 'zineb', 'jules']
    .map((n) => `assets/img/voices/${n}.jpg`);
  const slots = [...collage.querySelectorAll('figure')].map((fig) => {
    const base = fig.querySelector('img');
    const layer = document.createElement('img');
    layer.className = 'fade-layer';
    layer.alt = '';
    fig.appendChild(layer);
    return { base, layer, src: base.getAttribute('src') };
  });
  let last = -1;
  setInterval(() => {
    if (document.hidden) return;
    let i;
    do { i = Math.floor(Math.random() * slots.length); } while (i === last && slots.length > 1);
    last = i;
    const slot = slots[i];
    const shown = new Set(slots.map((s) => s.src));
    const options = pool.filter((src) => !shown.has(src));
    const next = options[Math.floor(Math.random() * options.length)];
    slot.layer.onload = () => {
      slot.layer.classList.add('is-visible');
      setTimeout(() => {
        slot.base.onload = () => slot.layer.classList.remove('is-visible');
        slot.base.src = next;
      }, 1700);
    };
    slot.src = next;
    slot.layer.src = next;
  }, 3200);
}
