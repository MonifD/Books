import { Note } from "@/model/Note";
import { API_URL } from "@/config";


export const getNotesByBookId = async (bookId: number): Promise<Note[]> => {
  const res = await fetch(`${API_URL}/books/${bookId}/notes`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des notes");
  return data;
};

export const addNoteToBook = async (bookId: number, content: string): Promise<Note> => {
  const res = await fetch(`${API_URL}/books/${bookId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de l’ajout de la note");
  return data;
};