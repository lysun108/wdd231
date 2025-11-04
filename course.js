// Course data (edit completed: true for courses you've finished)
const courses = [
  { code: 'WDD130', title: 'Web Fundamentals', credits: 2, category: 'WDD', completed: false },
  { code: 'WDD131', title: 'Dynamic Web Fundamentals', credits: 2, category: 'WDD', completed: false },
  { code: 'WDD231', title: 'Frontend Web Development I', credits: 3, category: 'WDD', completed: false },
  { code: 'CSE110', title: 'Programming Building Blocks', credits: 2, category: 'CSE', completed: false },
  { code: 'CSE111', title: 'Programming with Functions', credits: 2, category: 'CSE', completed: false },
  { code: 'CSE210', title: 'Programming with Classes', credits: 3, category: 'CSE', completed: false }
];

const list = document.getElementById('courses');
const creditTotal = document.getElementById('creditTotal');
const filterButtons = document.querySelectorAll('.filter-btn');

function render(filter='all'){
  const items = courses.filter(c => filter === 'all' ? true : c.category === filter);
  list.innerHTML = '';
  let total = 0;

  items.forEach(c => {
    total += c.credits;
    const card = document.createElement('article');
    card.className = 'course-card' + (c.completed ? ' completed' : '');

    const h3 = document.createElement('h3');
    h3.textContent = `${c.code} — ${c.title}`;

    const badge = document.createElement('span');
    badge.className = 'badge ' + (c.category === 'WDD' ? 'wdd' : 'cse');
    badge.textContent = c.category;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${c.credits} credit${c.credits > 1 ? 's' : ''}` + (c.completed ? ' • Completed' : '');

    card.append(h3, badge, meta);
    list.appendChild(card);
  });

  creditTotal.textContent = total;
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter);
  });
});

// initial
render();
