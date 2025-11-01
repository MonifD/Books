import { Book } from "@/model/Books";
import { API_URL } from "@/config";


export const getBooks = async (params: Record<string, any> = {}): Promise<Book[]> => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/books${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des livres");
  return await res.json();
};

export const getBookById = async (id: number): Promise<Book> => {
  const res = await fetch(`${API_URL}/books/${id}`);
  if (!res.ok) throw new Error("Livre introuvable");
  return await res.json();
};

export const addBook = async (bookData: Book): Promise<Book> => {
  const res = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de l’ajout du livre");
  return data;
};

export const updateBook = async (id: number, bookData: Partial<Book>): Promise<Book> => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour");
  return data;
};

export const deleteBook = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression");
  return data;
};
