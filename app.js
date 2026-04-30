const posts = [];

function showScreen(target) {
  const tabPost = document.getElementById('postTab');
  const tabAdmin = document.getElementById('adminTab');
  document.getElementById('timelineScreen').classList.toggle('hidden', target !== 'timeline');
  document.getElementById('loginScreen').classList.toggle('hidden', target !== 'login');
  document.getElementById('adminScreen').classList.toggle('hidden', target !== 'admin');
  tabPost.classList.toggle('active', target === 'timeline');
  tabAdmin.classList.toggle('active', target !== 'timeline');
}

function loginAdmin() {
  const id = document.getElementById('loginId').value;
  const pw = document.getElementById('loginPw').value;
  const msg = document.getElementById('loginMsg');
  if (id === 'jyugyo' && pw === '3810') {
    msg.textContent = '';
    renderAdmin();
    showScreen('admin');
  } else {
    msg.textContent = 'ログイン情報が正しくありません。';
  }
}

document.getElementById('postForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.status = '提出済み';
  data.likes = 0;
  posts.unshift(data);
  e.target.reset();
  renderTimeline();
  renderAdmin();
});

function renderTimeline() {
  const root = document.getElementById('timeline');
  root.innerHTML = posts.map((p, i) => `
    <article class="post">
      <h3>${p.course} / ${p.name}</h3>
      <p>${p.detail || ''}</p>
      <span class="badge submitted">${p.status}</span>
      <button onclick="likePost(${i})">👍 ${p.likes}</button>
    </article>`).join('');
}

function likePost(index) {
  posts[index].likes += 1;
  renderTimeline();
  renderAdmin();
}

function renderAdmin() {
  const tbody = document.getElementById('adminTable');
  tbody.innerHTML = posts.map(p => `<tr><td>${p.date || ''}</td><td>${p.name}</td><td>${p.faculty}</td><td>${p.course}</td><td>${p.category}</td><td>${(p.detail || '').slice(0, 50)}</td><td>${p.likes}</td><td>${p.status}</td></tr>`).join('');
}

function downloadCsv() {
  const header = ['活動日', '学生氏名', '所属学部', '担当授業', '活動カテゴリ', '活動内容', '教員コメント', 'いいね数', '累計ポイント', 'ステータス', '確認日', '承認者'];
  const rows = posts.map(p => [p.date, p.name, p.faculty, p.course, p.category, p.detail, '', p.likes, 0, p.status, '', '']);
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'la_records.csv';
  a.click();
}
