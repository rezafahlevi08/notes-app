import api from "./api.js";
import Swal from "sweetalert2";
import "./api.js";
import "./components.js";
import "../css/styles.css";

const notesContainer = document.querySelector("#notes-container");
const archivedContainer = document.querySelector("#archived-container");

const noteForm = document.querySelector("note-form");

function showLoading() {
  document.body.appendChild(document.createElement("loading-indicator"));
}

function hideLoading() {
  const loadingElement = document.querySelector("loading-indicator");
  if (loadingElement) loadingElement.remove();
}

async function renderNotes() {
  showLoading();
  try {
    const notes = await api.getNotes();
    const archivedNotes = await api.getArchivedNotes();

    notesContainer.innerHTML = "<h2>Active Notes</h2>";
    archivedContainer.innerHTML = "<h2>Archived Notes</h2>";

    notes.forEach((note) => addNoteElement(note, notesContainer, true));
    archivedNotes.forEach((note) =>
      addNoteElement(note, archivedContainer, false),
    );
  } catch (error) {
    Swal.fire(
      "Gagal!",
      "Gagal mengambil catatan! Periksa koneksi internet.",
      "error",
    );
  } finally {
    hideLoading();
  }
}

function addNoteElement(note, container, isActive) {
  const noteElement = document.createElement("note-item");
  noteElement.setAttribute("id", note.id);
  noteElement.setAttribute("title", note.title);
  noteElement.setAttribute("body", note.body);
  noteElement.setAttribute(
    "created",
    new Date(note.createdAt).toLocaleString(),
  );
  noteElement.setAttribute("archived", isActive ? "false" : "true");

  container.appendChild(noteElement);
}

document.addEventListener("delete-note", async (event) => {
  const noteId = event.detail.id;
  const result = await Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Catatan ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    showLoading();
    try {
      await api.deleteNote(noteId);
      Swal.fire("Terhapus!", "Catatan telah dihapus.", "success");
      renderNotes();
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menghapus catatan.", "error");
    } finally {
      hideLoading();
    }
  }
});

document.addEventListener("toggle-archive", async (event) => {
  const { id, archived } = event.detail;
  showLoading();
  try {
    archived ? await api.unarchiveNote(id) : await api.archiveNote(id);
    renderNotes();
  } catch (error) {
    Swal.fire("Gagal!", "Gagal mengubah status catatan.", "error");
  } finally {
    hideLoading();
  }
});

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = noteForm.querySelector("#title").value;
  const body = noteForm.querySelector("#body").value;

  showLoading();
  try {
    await api.addNote(title, body);
    renderNotes();
    noteForm.querySelector("form").reset();
    Swal.fire("Berhasil!", "Catatan berhasil ditambahkan.", "success");
  } catch (error) {
    Swal.fire("Gagal!", "Gagal menambahkan catatan.", "error");
  } finally {
    hideLoading();
  }
});

renderNotes();
