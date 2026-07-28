/* ─── NAV: SCROLL STATE ───────────────────────────── */
const nav = document.getElementById('nav');
const scrollThreshold = 64;

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > scrollThreshold);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();


/* ─── NAV: MOBILE DRAWER ──────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');

navToggle.addEventListener('click', () => {
  const open = navDrawer.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navDrawer.setAttribute('aria-hidden', String(!open));
});

// Close drawer on link click
navDrawer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navDrawer.classList.remove('open');
    navToggle.classList.remove('open');
    navDrawer.setAttribute('aria-hidden', 'true');
  });
});


/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─── QUIZ: EVALUACIÓN DE SALUD DENTAL ───────────── */
const QUESTIONS = [
  '¿Sientes dolor o sensibilidad al comer o beber algo caliente o frío?',
  '¿Notas sangrado al cepillarte o usar hilo dental?',
  '¿Ha pasado más de un año desde tu última limpieza dental?',
  '¿Te gustaría mejorar la apariencia o blancura de tu sonrisa?'
];

const RESULTS = [
  {
    level:   'green',
    emoji:   '😊',
    tag:     'Tu salud dental',
    title:   '¡Todo parece estar bien!',
    body:    'No reportas síntomas de alerta. Aun así, una revisión de rutina anual es la mejor forma de mantener tu salud bucal en óptimas condiciones. Pequeños controles previenen grandes tratamientos.',
    waText:  'Hola%2C%20quisiera%20agendar%20una%20consulta%20de%20revisi%C3%B3n%20de%20rutina%20en%20Cl%C3%ADnica%20Dental%20Chacao.',
    cta:     'Agendar revisión de rutina'
  },
  {
    level:   'yellow',
    emoji:   '🔍',
    tag:     'Revisión recomendada',
    title:   'Hay algo que vale la pena revisar',
    body:    'Algunos de tus síntomas sugieren que una consulta preventiva sería lo más conveniente. Detectar una situación a tiempo evita que se convierta en algo más complejo y costoso.',
    waText:  'Hola%2C%20quisiera%20agendar%20una%20consulta%20preventiva%20en%20Cl%C3%ADnica%20Dental%20Chacao.%20Tengo%20algunos%20s%C3%ADntomas%20que%20quisiera%20evaluar.',
    cta:     'Agendar consulta preventiva'
  },
  {
    level:   'red',
    emoji:   '⚠️',
    tag:     'Atención prioritaria',
    title:   'Te recomendamos agendar pronto',
    body:    'Varios de los síntomas que indicaste merecen atención odontológica sin demora. En Clínica Dental Chacao te atendemos con prioridad — escríbenos y te orientamos.',
    waText:  'Hola%2C%20quisiera%20agendar%20una%20cita%20con%20prioridad%20en%20Cl%C3%ADnica%20Dental%20Chacao.%20Tengo%20varios%20s%C3%ADntomas%20que%20quisiera%20revisar.',
    cta:     'Contactar ahora'
  }
];

// Button labels per question
const BTN_YES = ['Sí, lo siento', 'Sí, me pasa', 'Sí, ha pasado', 'Sí, me interesa'];
const BTN_NO  = ['No, ninguna', 'No, sin sangrado', 'No, fui hace poco', 'Estoy satisfecho/a'];
const EMOJIS_YES = ['😬', '🩸', '📅', '✨'];
const EMOJIS_NO  = ['😌', '✅', '👍', '😊'];

let currentQ = 0;
let yesCount  = 0;

const quizFill    = document.getElementById('quizFill');
const quizCounter = document.getElementById('quizCounter');
const quizBody    = document.getElementById('quizBody');
const quizResultWrap = document.getElementById('quizResultWrap');

function setProgress(step) {
  quizFill.style.width = (step / QUESTIONS.length * 100) + '%';
}

function renderQuestion(index) {
  setProgress(index);
  quizCounter.textContent = `Pregunta ${index + 1} de ${QUESTIONS.length}`;
  quizResultWrap.style.display = 'none';
  quizBody.style.display = 'block';

  quizBody.innerHTML = `
    <p class="quiz__question">${QUESTIONS[index]}</p>
    <div class="quiz__choices">
      <button class="quiz__btn" onclick="answer(true, ${index})">
        <span class="quiz__btn-emoji">${EMOJIS_YES[index]}</span>
        ${BTN_YES[index]}
      </button>
      <button class="quiz__btn" onclick="answer(false, ${index})">
        <span class="quiz__btn-emoji">${EMOJIS_NO[index]}</span>
        ${BTN_NO[index]}
      </button>
    </div>
  `;
}

function answer(isYes, qIndex) {
  if (qIndex !== currentQ) return; // prevent double-click
  if (isYes) yesCount++;
  currentQ++;

  if (currentQ < QUESTIONS.length) {
    renderQuestion(currentQ);
  } else {
    showResult();
  }
}

function showResult() {
  setProgress(QUESTIONS.length);
  quizCounter.textContent = 'Evaluación completada';
  quizBody.style.display = 'none';

  let r;
  if (yesCount === 0)      r = RESULTS[0];
  else if (yesCount <= 2)  r = RESULTS[1];
  else                     r = RESULTS[2];

  const waPath = encodeURIComponent('https://wa.me/584242327069?text=') + r.waText;
  const waLink = `https://wa.me/584242327069?text=${r.waText}`;

  quizResultWrap.style.display = 'block';
  quizResultWrap.innerHTML = `
    <div class="quiz__result">
      <div class="quiz__result-badge quiz__result-badge--${r.level}">
        <span>${r.emoji}</span>
      </div>
      <p class="quiz__result-tag">${r.tag}</p>
      <h3 class="quiz__result-title">${r.title}</h3>
      <p class="quiz__result-body">${r.body}</p>
      <a href="${waLink}" target="_blank" rel="noopener" class="quiz__result-action">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        ${r.cta}
      </a>
      <button class="quiz__result-reset" onclick="restartQuiz()">Volver a evaluar</button>
    </div>
  `;
}

function restartQuiz() {
  currentQ  = 0;
  yesCount  = 0;
  quizResultWrap.style.display = 'none';
  quizResultWrap.innerHTML = '';
  quizBody.style.display = 'block';
  renderQuestion(0);
}

// Init
renderQuestion(0);
