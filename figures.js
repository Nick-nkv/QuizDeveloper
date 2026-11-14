/* =========================================================================
   HÌNH MINH HOẠ (SVG vẽ bằng code)
   Dùng trong questions.js qua thuộc tính fig / efig: efig: "gitAreas"
   ========================================================================= */
const FIGS = (() => {
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const svg = (w, h, body, label) =>
    `<svg viewBox="0 0 ${w} ${h}" style="max-width:${w}px" role="img" aria-label="${esc(label)}">
      <defs><marker id="fx-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" class="fx-head"/></marker></defs>${body}</svg>`;

  // Hộp có tiêu đề + các dòng phụ, căn giữa theo chiều dọc.
  const box = (x, y, w, h, title, sub, cls) => {
    const subs = sub == null ? [] : [].concat(sub);
    const cx = x + w / 2;
    // Không có tiêu đề thì căn giữa các dòng phụ.
    const ty = y + h / 2 - (title ? subs.length : subs.length + 1) * 8.5 + 5;
    let out = `<g class="fx-box ${cls || ""}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>`;
    if (title) out += `<text x="${cx}" y="${ty}" text-anchor="middle" class="fx-t">${esc(title)}</text>`;
    subs.forEach((s, i) => { out += `<text x="${cx}" y="${ty + 17 * (i + 1)}" text-anchor="middle" class="fx-s">${esc(s)}</text>`; });
    return out + "</g>";
  };
  const txt = (x, y, t, cls = "fx-lbl", anchor = "middle") =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${esc(t)}</text>`;
  const arrow = (x1, y1, x2, y2, label, lx, ly, anchor) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="fx-line" marker-end="url(#fx-ah)"/>` +
    (label ? txt(lx ?? (x1 + x2) / 2, ly ?? (y1 + y2) / 2 - 7, label, "fx-lbl", anchor) : "");
  const curve = (d, label, lx, ly) =>
    `<path d="${d}" class="fx-line" marker-end="url(#fx-ah)"/>` + (label ? txt(lx, ly, label) : "");
  const seg = (x1, y1, x2, y2, cls = "fx-line") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  const node = (x, y, t, cls = "") =>
    `<g class="fx-node ${cls}"><circle cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y + 4}" text-anchor="middle">${esc(t)}</text></g>`;
  const frame = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="fx-frame"/>`;

  const F = {};

  F.gitAreas = svg(630, 200,
    box(10, 60, 130, 64, "Working Dir", "thư mục code") +
    box(170, 60, 130, 64, "Staging Area", "chờ commit") +
    box(330, 60, 130, 64, "Local Repo", ".git trên máy") +
    box(490, 60, 130, 64, "Remote", "GitHub / GitLab", "acc") +
    curve("M75,60 Q155,10 235,60", "git add", 155, 27) +
    curve("M235,60 Q315,10 395,60", "git commit", 315, 27) +
    curve("M395,60 Q475,10 555,60", "git push", 475, 27) +
    curve("M555,124 Q315,200 75,124", "git clone / git pull", 315, 184),
    "Luồng add, commit, push trong Git");

  F.gitBranch = svg(560, 160,
    seg(40, 50, 440, 50) + seg(120, 50, 200, 120) + seg(200, 120, 280, 120) + seg(280, 120, 440, 50) +
    node(40, 50, "C1") + node(120, 50, "C2") + node(360, 50, "C5") + node(440, 50, "M") +
    node(200, 120, "C3", "acc") + node(280, 120, "C4", "acc") +
    txt(470, 55, "main", "fx-lbl", "start") + txt(305, 125, "feature", "fx-lbl", "start") +
    txt(440, 22, "merge commit", "fx-s") + txt(140, 105, "tạo nhánh", "fx-s", "end"),
    "Nhánh feature tách ra từ main rồi được merge lại");

  F.mergeRebase = svg(620, 195,
    txt(150, 22, "git merge", "fx-t") + txt(470, 22, "git rebase", "fx-t") +
    seg(310, 35, 310, 165, "fx-frame-line") +
    seg(30, 70, 260, 70) + seg(90, 70, 140, 140) + seg(140, 140, 200, 140) + seg(200, 140, 260, 70) +
    node(30, 70, "A") + node(90, 70, "B") + node(170, 70, "X") + node(260, 70, "M") +
    node(140, 140, "C", "acc") + node(200, 140, "D", "acc") + txt(260, 44, "merge commit", "fx-s") +
    seg(340, 90, 560, 90) +
    node(340, 90, "A") + node(395, 90, "B") + node(450, 90, "X") + node(505, 90, "C'", "acc") + node(560, 90, "D'", "acc") +
    txt(532, 128, "commit được viết lại", "fx-s") +
    txt(150, 185, "Giữ nguyên lịch sử, thêm 1 commit gộp", "fx-s") +
    txt(470, 185, "Lịch sử thẳng hàng, đổi hash commit", "fx-s"),
    "So sánh merge và rebase");

  F.lifecycle = svg(590, 270,
    box(10, 30, 120, 44, "onCreate()") + box(160, 30, 120, 44, "onStart()") +
    box(310, 30, 120, 44, "onResume()") + box(460, 30, 120, 44, "Đang chạy", null, "acc") +
    arrow(130, 52, 160, 52) + arrow(280, 52, 310, 52) + arrow(430, 52, 460, 52) +
    arrow(520, 74, 520, 140) + txt(512, 112, "rời màn hình", "fx-lbl", "end") +
    box(460, 140, 120, 44, "onPause()") + box(310, 140, 120, 44, "onStop()") +
    box(160, 140, 120, 44, "onRestart()", null, "plain") +
    arrow(460, 162, 430, 162) + arrow(310, 162, 280, 162) + txt(295, 133, "mở lại") +
    arrow(220, 140, 220, 74) +
    arrow(370, 184, 370, 216) + txt(380, 206, "finish / bị huỷ", "fx-lbl", "start") +
    box(310, 216, 120, 44, "onDestroy()", null, "warn"),
    "Vòng đời Activity");

  F.vmLifecycle = svg(600, 165,
    box(20, 30, 250, 40, "Activity #1") + box(290, 30, 210, 40, "Activity #2 (tạo lại)") +
    seg(280, 22, 280, 150, "fx-frame-line") + txt(280, 14, "xoay màn hình") +
    txt(508, 55, "finish()", "fx-lbl", "start") +
    box(20, 100, 480, 40, "ViewModel: dữ liệu vẫn còn nguyên", null, "acc") +
    txt(508, 125, "onCleared()", "fx-lbl", "start"),
    "ViewModel sống lâu hơn Activity khi xoay màn hình");

  F.mvvm = svg(630, 195,
    box(10, 60, 120, 70, "View", ["Activity /", "Composable"]) +
    box(190, 60, 120, 70, "ViewModel", "giữ UiState", "acc") +
    box(370, 60, 120, 70, "Repository", ["nguồn dữ liệu", "duy nhất"]) +
    box(510, 15, 110, 55, "API", "Retrofit", "plain") + box(510, 125, 110, 55, "Database", "Room", "plain") +
    arrow(130, 82, 190, 82, "event") + arrow(190, 110, 130, 110, "state", 160, 128) +
    arrow(310, 82, 370, 82, "gọi") + arrow(370, 110, 310, 110, "dữ liệu", 340, 128) +
    arrow(490, 82, 510, 50) + arrow(490, 108, 510, 145),
    "Kiến trúc MVVM");

  F.cleanArch = svg(600, 190,
    box(10, 40, 170, 100, "Presentation", ["UI, ViewModel"]) +
    box(215, 40, 170, 100, "Domain", ["UseCase, Model,", "Repository", "(interface)"], "acc") +
    box(420, 40, 170, 100, "Data", ["RepositoryImpl,", "API, Room"]) +
    arrow(180, 90, 215, 90) + arrow(420, 90, 385, 90) +
    txt(300, 175, "Mũi tên = hướng phụ thuộc. Domain không phụ thuộc tầng nào.", "fx-s"),
    "Ba tầng của Clean Architecture");

  F.composeLayouts = svg(600, 200,
    txt(100, 22, "Column", "fx-t") + txt(300, 22, "Row", "fx-t") + txt(500, 22, "Box", "fx-t") +
    frame(20, 35, 160, 150) + box(45, 48, 110, 34, "A") + box(45, 93, 110, 34, "B") + box(45, 138, 110, 34, "C") +
    frame(220, 35, 160, 150) + box(232, 85, 42, 50, "A") + box(279, 85, 42, 50, "B") + box(326, 85, 42, 50, "C") +
    frame(420, 35, 160, 150) +
    `<g class="fx-box"><rect x="435" y="50" width="130" height="120" rx="9"/><text x="448" y="72" class="fx-t">A</text></g>` +
    box(470, 88, 80, 55, "B", "chồng lên", "acc"),
    "Column xếp dọc, Row xếp ngang, Box xếp chồng");

  F.udf = svg(520, 195,
    box(20, 65, 160, 70, "ViewModel", "giữ state") + box(340, 65, 160, 70, "UI", "Composable", "acc") +
    curve("M100,65 Q260,5 420,65", "state đi xuống", 260, 27) +
    curve("M420,135 Q260,195 100,135", "event đi lên (click, nhập liệu)", 260, 186),
    "Luồng dữ liệu một chiều");

  F.recomposition = svg(560, 210,
    box(190, 10, 180, 60, "CounterScreen", "count: 1 → 2", "plain") +
    seg(280, 70, 100, 120) + seg(280, 70, 280, 120) + seg(280, 70, 460, 120) +
    box(20, 120, 160, 60, "Header", "không đọc count", "plain") +
    box(200, 120, 160, 60, "Counter", ["đọc count", "→ chạy lại"], "acc") +
    box(380, 120, 160, 60, "Footer", "không đọc count", "plain") +
    txt(280, 203, "Chỉ composable đọc state bị thay đổi mới được recompose", "fx-s"),
    "Recomposition chỉ chạy lại phần cần thiết");

  F.polymorphism = svg(520, 195,
    box(180, 15, 160, 60, "Animal", "open fun speak()") +
    box(30, 125, 180, 60, "Dog", "speak() = \"Gâu\"", "acc") +
    box(310, 125, 180, 60, "Cat", "speak() = \"Meo\"", "acc") +
    arrow(120, 125, 230, 75) + arrow(400, 125, 290, 75) + txt(260, 112, "kế thừa", "fx-s"),
    "Kế thừa và đa hình");

  F.dip = svg(600, 195,
    box(10, 70, 160, 60, "ViewModel", "phụ thuộc interface") +
    box(220, 70, 170, 60, "UserRepository", "«interface»", "acc dash") +
    box(430, 15, 160, 58, "UserRepositoryImpl", "gọi API thật") +
    box(430, 125, 160, 58, "FakeUserRepository", "dùng khi test", "plain") +
    arrow(170, 100, 220, 100) + arrow(430, 44, 390, 88) + arrow(430, 154, 390, 112) +
    txt(395, 104, "implement", "fx-s", "start"),
    "Dependency Inversion: phụ thuộc vào interface");

  F.stackQueue = svg(600, 210,
    `<path d="M60,40 L60,180 L180,180 L180,40" class="fx-line"/>` +
    box(70, 145, 100, 30, "A") + box(70, 110, 100, 30, "B") + box(70, 75, 100, 30, "C", null, "acc") +
    arrow(95, 8, 95, 68) + txt(88, 30, "push", "fx-lbl", "end") +
    arrow(145, 68, 145, 8) + txt(152, 30, "pop", "fx-lbl", "start") +
    txt(120, 202, "Stack · LIFO", "fx-t") +
    seg(320, 80, 540, 80) + seg(320, 130, 540, 130) +
    box(335, 87, 55, 36, "A", null, "acc") + box(400, 87, 55, 36, "B") + box(465, 87, 55, 36, "C") +
    arrow(595, 105, 548, 105) + txt(570, 95, "enqueue") +
    arrow(325, 105, 272, 105) + txt(296, 95, "dequeue") +
    txt(430, 165, "Queue · FIFO", "fx-t"),
    "Stack và Queue");

  F.binarySearch = (() => {
    const vals = [2, 5, 8, 12, 16, 23, 38, 56, 72];
    let body = txt(300, 30, "Tìm 23 · mid = 16 < 23 → bỏ nửa trái, tìm tiếp nửa phải", "fx-s");
    vals.forEach((v, i) => {
      body += box(48 + i * 56, 50, 52, 44, String(v), null, i === 4 ? "acc" : i < 4 ? "dim" : "");
    });
    body += txt(74, 118, "lo") + txt(298, 118, "mid") + txt(522, 118, "hi");
    return svg(600, 130, body, "Tìm kiếm nhị phân");
  })();

  F.bigO = (() => {
    const X = n => 50 + n * 44, K = 10, TOP = 20;
    const curves = [
      { f: () => 1, cls: "fx-good" },
      { f: n => Math.log2(n), cls: "fx-good" },
      { f: n => n, cls: "fx-mid" },
      { f: n => n * Math.log2(n), cls: "fx-mid" },
      { f: n => n * n, cls: "fx-bad" }
    ];
    let body = seg(50, 220, 500, 220, "fx-axis") + seg(50, 220, 50, 15, "fx-axis");
    curves.forEach(c => {
      const pts = [];
      for (let n = 1; n <= 10; n++) {
        const y = 220 - c.f(n) * K;
        if (y >= TOP) { pts.push(X(n) + "," + y.toFixed(1)); continue; }
        // Cắt đường cong đúng tại mép trên thay vì kéo ngang.
        const py = 220 - c.f(n - 1) * K;
        pts.push((X(n - 1) + 44 * (py - TOP) / (py - y)).toFixed(1) + "," + TOP);
        break;
      }
      body += `<polyline points="${pts.join(" ")}" class="fx-curve ${c.cls}"/>`;
    });
    body += txt(276, 30, "O(n²)", "fx-lbl", "start") + txt(408, 30, "O(n log n)", "fx-lbl", "start") +
      txt(488, 112, "O(n)", "fx-lbl", "end") + txt(488, 180, "O(log n)", "fx-lbl", "end") +
      txt(488, 204, "O(1)", "fx-lbl", "end") +
      txt(275, 248, "n (kích thước dữ liệu) →", "fx-s") +
      `<text x="20" y="120" text-anchor="middle" class="fx-s" transform="rotate(-90 20 120)">thời gian →</text>`;
    return svg(520, 260, body, "So sánh các độ phức tạp Big O");
  })();

  F.hashmap = svg(600, 225,
    box(10, 85, 110, 54, "key \"an\"", null, "acc") + arrow(120, 112, 170, 112) +
    box(170, 85, 110, 54, "hash(key)", "% 5 → 2", "plain") + arrow(280, 112, 330, 118) +
    [0, 1, 2, 3, 4].map(i => box(330, 20 + i * 40, 60, 36, String(i), null, "plain")).join("") +
    arrow(390, 118, 430, 118) + box(430, 100, 110, 36, "an → 25", null, "acc") +
    arrow(390, 198, 430, 198) + box(430, 180, 75, 36, "bo → 7") + seg(505, 198, 515, 198) + box(515, 180, 75, 36, "cu → 9"),
    "HashMap: key được băm ra vị trí ô nhớ");

  F.http = svg(600, 190,
    box(20, 55, 140, 80, "App", "Android", "acc") + box(440, 55, 140, 80, "Server", "REST API") +
    arrow(160, 80, 440, 80, "Request: GET /users/1", 300, 70) +
    arrow(440, 112, 160, 112, "Response: 200 OK + JSON", 300, 132) +
    txt(300, 172, "{ \"id\": 1, \"name\": \"An\" }", "fx-code"),
    "Request và response HTTP");

  F.dispatchers = svg(600, 190,
    [["Main", "Cập nhật UI, xử lý click (không làm việc nặng!)", "acc"],
     ["IO", "Gọi mạng, đọc/ghi database, file", ""],
     ["Default", "Tính toán nặng: sort, xử lý ảnh, parse JSON lớn", ""]]
      .map(([n, d, c], i) => box(10, 15 + i * 60, 140, 46, n, null, c) +
        box(165, 15 + i * 60, 425, 46, null, d, "plain")).join(""),
    "Các Dispatcher của coroutine");

  F.hiltScopes = svg(600, 335,
    seg(300, 62, 200, 100) + seg(300, 62, 490, 100) + seg(200, 152, 105, 190) + seg(200, 152, 320, 190) + seg(320, 242, 320, 275) +
    box(210, 10, 180, 52, "SingletonComponent", "@Singleton", "acc") +
    box(90, 100, 220, 52, "ActivityRetainedComponent", "@ActivityRetainedScoped") +
    box(400, 100, 180, 52, "ServiceComponent", "@ServiceScoped", "plain") +
    box(10, 190, 190, 52, "ViewModelComponent", "@ViewModelScoped") +
    box(230, 190, 180, 52, "ActivityComponent", "@ActivityScoped") +
    box(230, 275, 180, 52, "FragmentComponent", "@FragmentScoped", "plain"),
    "Cây component và scope của Hilt");

  F.intent = svg(600, 205,
    txt(10, 22, "Explicit: chỉ rõ màn hình cần mở", "fx-t", "start") +
    box(10, 32, 160, 44, "MainActivity") + arrow(170, 54, 240, 54) + box(240, 32, 170, 44, "DetailActivity", null, "acc") +
    txt(10, 112, "Implicit: chỉ nói hành động", "fx-t", "start") +
    box(10, 122, 160, 50, "App của bạn", "ACTION_VIEW url") + arrow(170, 147, 240, 147) +
    box(240, 122, 170, 50, "Hệ thống Android", "tìm app phù hợp", "plain") +
    arrow(410, 138, 450, 118) + arrow(410, 158, 450, 178) +
    box(450, 100, 140, 36, "Chrome", null, "acc") + box(450, 160, 140, 36, "Firefox", null, "acc"),
    "Explicit Intent và Implicit Intent");

  F.memoryLeak = svg(560, 185,
    box(20, 50, 190, 80, "object Singleton", ["sống suốt", "vòng đời app"], "acc") +
    box(350, 50, 190, 80, "Activity", ["đã onDestroy()", "GC không dọn được"], "warn") +
    arrow(210, 90, 350, 90, "giữ tham chiếu", 280, 82) +
    txt(280, 170, "Cách tránh: dùng applicationContext, hoặc bỏ tham chiếu khi onDestroy", "fx-s"),
    "Memory leak do singleton giữ Activity");

  F.recycler = svg(540, 265,
    `<rect x="150" y="50" width="190" height="160" rx="14" class="fx-phone"/>` +
    box(165, 8, 160, 32, "Item 1", null, "dim") +
    box(165, 60, 160, 32, "Item 2") + box(165, 100, 160, 32, "Item 3") + box(165, 140, 160, 32, "Item 4") +
    box(165, 220, 160, 32, "Item 5", null, "acc") +
    curve("M325,24 Q470,130 325,236", "", 0, 0) +
    txt(405, 128, "tái sử dụng", "fx-lbl", "start") + txt(405, 145, "ViewHolder", "fx-lbl", "start") +
    txt(150, 28, "cuộn ra khỏi màn hình", "fx-s", "end") + txt(150, 240, "item mới cuộn vào", "fx-s", "end"),
    "RecyclerView tái sử dụng view");

  F.layoutSizes = svg(600, 180,
    txt(150, 22, "wrap_content", "fx-t") + txt(450, 22, "match_parent", "fx-t") +
    frame(20, 35, 260, 130) + box(35, 50, 90, 36, "Button") + txt(150, 150, "vừa đủ nội dung", "fx-s") +
    frame(320, 35, 260, 130) + box(335, 50, 230, 36, "Button", null, "acc") + txt(450, 150, "chiếm hết chiều rộng view cha", "fx-s"),
    "wrap_content và match_parent");

  F.visibility = svg(600, 200,
    [["VISIBLE", 15], ["INVISIBLE", 215], ["GONE", 415]].map(([name, x]) =>
      txt(x + 85, 22, name, "fx-t") + frame(x, 35, 170, 160) + box(x + 15, 48, 140, 36, "A")).join("") +
    box(30, 92, 140, 36, "B") + box(30, 136, 140, 36, "C") +
    box(230, 92, 140, 36, null, "vẫn chiếm chỗ", "plain dash") + box(230, 136, 140, 36, "C") +
    box(430, 92, 140, 36, "C", null, "acc") + txt(500, 160, "B không chiếm chỗ,", "fx-s") + txt(500, 177, "C dồn lên", "fx-s"),
    "VISIBLE, INVISIBLE và GONE");

  F.matrix2d = (() => {
    let body = txt(92, 32, "i \\ j", "fx-s", "end");
    for (let j = 0; j < 4; j++) body += txt(145 + j * 75, 32, String(j), "fx-lbl");
    for (let i = 0; i < 3; i++) {
      body += txt(92, 71 + i * 48, String(i), "fx-lbl", "end");
      for (let j = 0; j < 4; j++) {
        body += box(110 + j * 75, 45 + i * 48, 70, 42, String(i * 4 + j + 1), null, i === 1 && j === 2 ? "acc" : "plain");
      }
    }
    return svg(460, 200, body, "Mảng hai chiều 3 hàng 4 cột");
  })();

  return F;
})();
