const revealed = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealed.forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index * 70, 320)}ms`;
  revealObserver.observe(node);
});

const form = document.querySelector('#closed-test-form');
const joinNote = document.querySelector('#join-note');
if (form) {
  form.addEventListener('submit', () => {
    const success = document.querySelector('[data-fs-success]');
    const error = document.querySelector('[data-fs-error]');
    const emailInput = document.querySelector('#email');
    const enteredEmail = (emailInput && emailInput.value ? emailInput.value : '').trim();

    if (success) success.textContent = '';
    if (error) error.textContent = '';

    if (joinNote && enteredEmail) {
      joinNote.textContent =
        `Thanks. The developer will send an email to ${enteredEmail} with steps to join the Google Play closed testing program and download the latest app.`;
      joinNote.classList.add('show');
    }
  });
}

const newsList = document.querySelector('#news-list');

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderNewsItems(items) {
  if (!newsList) return;

  if (!Array.isArray(items) || items.length === 0) {
    newsList.innerHTML = '<p class="news-empty">No news posts yet. Add your first update in news.json.</p>';
    return;
  }

  newsList.innerHTML = items
    .map((item) => {
      const title = escapeHtml(item.title || 'Untitled update');
      const summary = escapeHtml(item.summary || '');
      const date = escapeHtml(item.date || 'TBA');
      const tag = escapeHtml(item.tag || 'Update');
      const link = item.link ? escapeHtml(item.link) : '';

      return `
        <article class="news-card">
          <div class="news-meta">
            <span>${date}</span>
            <span class="news-tag">${tag}</span>
          </div>
          <h3>${title}</h3>
          <p>${summary}</p>
          ${link ? `<a class="news-link" href="${link}" target="_blank" rel="noopener noreferrer">Read details</a>` : ''}
        </article>
      `;
    })
    .join('');
}

async function loadNews() {
  if (!newsList) return;

  try {
    const response = await fetch('news.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch news data.');
    const data = await response.json();
    renderNewsItems(data.news);
  } catch {
    newsList.innerHTML =
      '<p class="news-empty">Could not load news right now. Try reloading or check news.json format.</p>';
  }
}

loadNews();
