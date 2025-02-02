class AppName extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h1>Notes App</h1>
      <hr />
    `;
  }
}
customElements.define("app-name", AppName);

class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="note-form">
        <input type="text" id="title" placeholder="Title" required />
        <textarea id="body" placeholder="Your note" required></textarea>
        <button type="submit">Add Notes</button>
      </form>
    `;
  }
}
customElements.define("note-form", NoteForm);

class NoteItem extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="note">
        <h3>${this.getAttribute("title")}</h3>
        <p>${this.getAttribute("body")}</p>
        <small>${this.getAttribute("created")}</small>
        <div class="note-actions">
          <button class="archive-btn">
            ${
              this.getAttribute("archived") === "true" ? "Unarchive" : "Archive"
            }
          </button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;

    this.querySelector(".delete-btn").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("delete-note", {
          bubbles: true,
          detail: { id: this.getAttribute("id") },
        }),
      );
    });

    this.querySelector(".archive-btn").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("toggle-archive", {
          bubbles: true,
          detail: {
            id: this.getAttribute("id"),
            archived: this.getAttribute("archived") === "true",
          },
        }),
      );
    });
  }
}
customElements.define("note-item", NoteItem);

class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
      `;
  }
}
customElements.define("loading-indicator", LoadingIndicator);
