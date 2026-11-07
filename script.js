// Initial Book Data

const initialBooks = [
  {
    id: "BK-108",
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    total: 9,
    available: 8,
    added: 5
  },
  {
    id: "BK-107",
    title: "The Complete Works",
    author: "William Shakespeare",
    category: "Literature",
    total: 14,
    available: 12,
    added: 4
  },
  {
    id: "BK-106",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    total: 14,
    available: 11,
    added: 3
  },
  {
    id: "BK-105",
    title: "The Discovery of India",
    author: "Jawaharlal Nehru",
    category: "History",
    total: 4,
    available: 4,
    added: 2
  },
  {
    id: "BK-104",
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Philosophy",
    total: 7,
    available: 6,
    added: 1
  }
];

let books = JSON.parse(
  localStorage.getItem("libraryBooks_v2") || "null"
) || initialBooks;


// Initial Issue Records

let records = JSON.parse(
  localStorage.getItem("libraryRecords_v2") || "null"
) || [
  {
    id: "IR-007",
    bookId: "BK-108",
    student: "Aarav Sharma",
    issueDate: "2026-11-02",
    returnDate: "",
    status: "Issued"
  },
  {
    id: "IR-006",
    bookId: "BK-107",
    student: "Ananya Das",
    issueDate: "2026-11-01",
    returnDate: "",
    status: "Issued"
  },
  {
    id: "IR-005",
    bookId: "BK-106",
    student: "Rohan Mehta",
    issueDate: "2026-10-30",
    returnDate: "",
    status: "Issued"
  },
  {
    id: "IR-004",
    bookId: "BK-106",
    student: "Ishita Roy",
    issueDate: "2026-10-28",
    returnDate: "",
    status: "Issued"
  },
  {
    id: "IR-003",
    bookId: "BK-107",
    student: "Kabir Sen",
    issueDate: "2026-10-26",
    returnDate: "",
    status: "Issued"
  },
  {
    id: "IR-002",
    bookId: "BK-108",
    student: "Mira Kapoor",
    issueDate: "2026-10-24",
    returnDate: "",
    status: "Issued"
  },
  {
    id: "IR-001",
    bookId: "BK-104",
    student: "Dev Malhotra",
    issueDate: "2026-10-22",
    returnDate: "",
    status: "Issued"
  }
];


// Category Colours

const colors = {
  Science: "#28636a",
  Literature: "#28614c",
  Fiction: "#bd984f",
  Philosophy: "#557b99",
  History: "#8d6797"
};

const $ = id => document.getElementById(id);


// Save Data in Local Storage

const save = () => {
  localStorage.setItem(
    "libraryBooks_v2",
    JSON.stringify(books)
  );

  localStorage.setItem(
    "libraryRecords_v2",
    JSON.stringify(records)
  );
};


// Update Dashboard Statistics

function renderStats() {

  const total = books.reduce(
    (s, b) => s + Number(b.total),
    0
  );

  const available = books.reduce(
    (s, b) => s + Number(b.available),
    0
  );

  $("totalTitles").textContent = books.length;
  $("totalCopies").textContent = total;
  $("availableCopies").textContent = available;
  $("booksIssued").textContent = total - available;

  $("activeCount").textContent =
    records.filter(r => r.status === "Issued").length
    + " active";
}


// Books by Category Chart

function renderChart() {

  const categories = [
    "Literature",
    "Fiction",
    "Science",
    "Philosophy",
    "History"
  ];

  const values = categories.map(category =>
    books
      .filter(b => b.category === category)
      .reduce((sum, b) => sum + Number(b.total), 0)
  );

  const max = Math.max(
    16,
    Math.ceil(Math.max(...values, 1) / 2) * 2
  );

  const steps = [
    max,
    max * 0.875,
    max * 0.75,
    max * 0.625,
    max * 0.5,
    max * 0.375,
    max * 0.25,
    max * 0.125,
    0
  ];

  $("yAxis").innerHTML = steps
    .map(v => `<span>${Number.isInteger(v) ? v : v.toFixed(1)}</span>`)
    .join("");

  $("gridLines").innerHTML = steps
    .map(() => "<span></span>")
    .join("");

  $("categoryBars").innerHTML = categories
    .map((category, index) => `
      <div class="bar-item">

        <div
          class="bar"
          title="${values[index]} books"
          style="
            height: ${values[index] / max * 100}%;
            background: ${colors[category]};
          "
        ></div>

        <div class="bar-label">
          ${category}
        </div>

      </div>
    `)
    .join("");

  $("genreCount").textContent =
    categories.filter(category =>
      books.some(b => b.category === category)
    ).length + " Active Genres";
}


// Recently Added Books

function renderRecent() {

  const sorted = [...books]
    .sort((a, b) => b.added - a.added)
    .slice(0, 5);

  $("recentBooks").innerHTML = sorted.map(b => `

    <div class="recent-row">

      <div class="recent-left">

        <div
          class="book-cover"
          style="background: ${colors[b.category] || "#6256c9"}"
        >
          ✦
        </div>

        <div>

          <div class="recent-title">
            ${escapeHtml(b.title)}
          </div>

          <div class="recent-meta">

            ${escapeHtml(b.id)}

            &nbsp;

            <span class="${
              b.available > 0
                ? "available-text"
                : "issued-text"
            }">

              ● ${b.available > 0 ? "Available" : "Issued"}

            </span>

          </div>

        </div>

      </div>

      <span class="category-tag">
        ${escapeHtml(b.category)}
      </span>

    </div>

  `).join("");
}


// Prevent HTML Injection

function escapeHtml(s) {

  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

}


// Display Book Catalogue

function renderBooks() {

  const q = $("searchInput").value.toLowerCase();

  const list = books.filter(b =>
    [b.id, b.title, b.author, b.category]
      .some(v => String(v).toLowerCase().includes(q))
  );

  $("bookTable").innerHTML = list.length

    ? list.map(b => `

      <tr>

        <td>${escapeHtml(b.id)}</td>

        <td>
          <strong>${escapeHtml(b.title)}</strong>
        </td>

        <td>${escapeHtml(b.author)}</td>

        <td>${escapeHtml(b.category)}</td>

        <td>${b.total}</td>

        <td>${b.available}</td>

        <td>

          <span class="status ${
            b.available > 0 ? "available" : "issued"
          }">

            ${b.available > 0 ? "Available" : "Issued"}

          </span>

        </td>

        <td>

          <button
            class="action-btn"
            data-delete="${escapeHtml(b.id)}"
          >
            Delete
          </button>

        </td>

      </tr>

    `).join("")

    : `
      <tr>
        <td colspan="8" class="empty-row">
          No books found.
        </td>
      </tr>
    `;


  // Update Available Book Dropdown

  $("issueBook").innerHTML = books
    .filter(b => b.available > 0)
    .map(b => `

      <option value="${escapeHtml(b.id)}">

        ${escapeHtml(b.title)}
        (${b.available} available)

      </option>

    `)
    .join("") || '<option value="">No available books</option>';

}


// Display Issue Records

function renderRecords() {

  const active = records.filter(
    r => r.status === "Issued"
  );

  $("returnRecord").innerHTML = active.map(r => {

    const b = books.find(x => x.id === r.bookId);

    return `

      <option value="${r.id}">

        ${escapeHtml(b?.title || r.bookId)}
        — ${escapeHtml(r.student)}

      </option>

    `;

  }).join("") || '<option value="">No active issues</option>';


  $("recordsTable").innerHTML = records.length

    ? [...records].reverse().map(r => {

      const b = books.find(x => x.id === r.bookId);

      return `

        <tr>

          <td>${escapeHtml(r.id)}</td>

          <td>${escapeHtml(b?.title || r.bookId)}</td>

          <td>${escapeHtml(r.student)}</td>

          <td>${escapeHtml(r.issueDate)}</td>

          <td>${r.returnDate || "—"}</td>

          <td>

            <span class="status ${
              r.status === "Issued" ? "issued" : "available"
            }">

              ${r.status}

            </span>

          </td>

          <td>

            ${
              r.status === "Issued"

                ? `<button
                    class="action-btn"
                    data-return="${r.id}"
                  >
                    Return
                  </button>`

                : "—"
            }

          </td>

        </tr>

      `;

    }).join("")

    : `

      <tr>
        <td colspan="7" class="empty-row">
          No issue records yet.
        </td>
      </tr>

    `;

}


// Refresh Entire Dashboard

function render() {

  renderStats();
  renderChart();
  renderRecent();
  renderBooks();
  renderRecords();

}


// Add Book Form

$("showFormBtn").onclick = () => {

  $("bookForm").classList.remove("hidden");
  $("bookId").focus();

};


$("cancelFormBtn").onclick = () => {

  $("bookForm").reset();
  $("bookForm").classList.add("hidden");

};


$("bookForm").onsubmit = e => {

  e.preventDefault();

  const id = $("bookId").value.trim();
  const quantity = Number($("bookQuantity").value);

  if (books.some(b =>
    b.id.toLowerCase() === id.toLowerCase()
  )) {

    alert("This Book ID already exists.");
    return;

  }

  if (quantity < 1) {

    alert("Enter a valid quantity.");
    return;

  }

  books.push({

    id: id,

    title: $("bookTitle").value.trim(),

    author: $("bookAuthor").value.trim(),

    category: $("bookCategory").value,

    total: quantity,

    available: quantity,

    added: Date.now()

  });

  save();

  $("bookForm").reset();

  $("bookForm").classList.add("hidden");

  render();

};


// Search Books

$("searchInput").addEventListener(
  "input",
  renderBooks
);


// Delete Books

$("bookTable").onclick = e => {

  const id = e.target.dataset.delete;

  if (id && confirm("Delete this book from the catalogue?")) {

    if (records.some(r =>
      r.bookId === id && r.status === "Issued"
    )) {

      alert(
        "This book has an active issue record and cannot be deleted."
      );

      return;

    }

    books = books.filter(b => b.id !== id);

    save();

    render();

  }

};


// Set Default Dates

$("issueDate").value =
  new Date().toISOString().slice(0, 10);

$("returnDate").value =
  new Date().toISOString().slice(0, 10);


// Issue Book

$("issueForm").onsubmit = e => {

  e.preventDefault();

  const b = books.find(
    x => x.id === $("issueBook").value
  );

  if (!b || b.available < 1) {

    alert("No copies are currently available.");
    return;

  }

  b.available--;

  records.push({

    id: "IR-" + String(Date.now()).slice(-6),

    bookId: b.id,

    student: $("studentName").value.trim(),

    issueDate: $("issueDate").value,

    returnDate: "",

    status: "Issued"

  });

  save();

  $("issueForm").reset();

  $("issueDate").value =
    new Date().toISOString().slice(0, 10);

  render();

};


// Return Book

function returnBook(recordId) {

  const r = records.find(
    x => x.id === recordId && x.status === "Issued"
  );

  if (!r) return;

  const b = books.find(
    x => x.id === r.bookId
  );

  if (b) {

    b.available = Math.min(
      b.total,
      b.available + 1
    );

  }

  r.status = "Returned";

  r.returnDate =
    $("returnDate").value ||
    new Date().toISOString().slice(0, 10);

  save();

  render();

}


// Return Form

$("returnForm").onsubmit = e => {

  e.preventDefault();

  if (!$("returnRecord").value) {

    alert("There are no active issues to return.");
    return;

  }

  returnBook($("returnRecord").value);

};


// Return Directly From Issue Records

$("recordsTable").onclick = e => {

  const id = e.target.dataset.return;

  if (id) {

    returnBook(id);

  }

};


// Initial Display

render();
