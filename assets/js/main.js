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
    const first = fig.querySelector('img');
    const second = document.createElement('img');
    second.alt = '';
    fig.appendChild(second);
    return { layers: [first, second], front: 0, src: first.getAttribute('src') };
  });
  // Alle plekken komen om de beurt aan bod, in een steeds andere volgorde.
  let queue = [];
  const nextSlot = () => {
    if (!queue.length) queue = slots.map((_, i) => i).sort(() => Math.random() - 0.5);
    return slots[queue.shift()];
  };
  setInterval(() => {
    if (document.hidden) return;
    const slot = nextSlot();
    const shown = new Set(slots.map((s) => s.src));
    const options = pool.filter((src) => !shown.has(src));
    const next = options[Math.floor(Math.random() * options.length)];
    const oldLayer = slot.layers[slot.front];
    const newLayer = slot.layers[1 - slot.front];
    slot.front = 1 - slot.front;
    slot.src = next;
    newLayer.onload = () => {
      // Nieuw gezicht komt bovenop en landt zacht; daarna blijft het gewoon staan.
      oldLayer.classList.remove('is-top');
      newLayer.classList.add('is-top', 'is-visible');
      setTimeout(() => {
        // Oude laag (nu volledig bedekt) zonder animatie klaarzetten voor de volgende keer.
        oldLayer.classList.add('is-reset');
        oldLayer.classList.remove('is-visible');
        void oldLayer.offsetWidth;
        oldLayer.classList.remove('is-reset');
      }, 1500);
    };
    newLayer.src = next;
  }, 1800);
}
