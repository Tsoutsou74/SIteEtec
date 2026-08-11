import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Download, FileText, Search, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type DigitalBook = {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  size: number;
  dataUrl: string;
  addedAt: string;
};

const STORAGE_KEY = 'etec-digital-library';
const ACCEPTED_TYPES = '.pdf,.epub,.doc,.docx';

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function DigitalLibrary() {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [books, setBooks] = useState<DigitalBook[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (Array.isArray(saved)) setBooks(saved);
    } catch {
      setBooks([]);
    }
  }, []);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return books;
    return books.filter((book) => book.title.toLowerCase().includes(query) || book.fileName.toLowerCase().includes(query));
  }, [books, search]);

  const persist = (nextBooks: DigitalBook[]) => {
    setBooks(nextBooks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBooks));
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setMessage('Le fichier est trop volumineux. La taille maximale est de 4 Mo.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextBook: DigitalBook = {
        id: `${Date.now()}-${file.name}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileType: file.type || file.name.split('.').pop()?.toUpperCase() || 'Fichier',
        size: file.size,
        dataUrl: String(reader.result),
        addedAt: new Date().toISOString(),
      };

      try {
        persist([nextBook, ...books]);
        setMessage('Livre ajouté avec succès.');
      } catch {
        setMessage('Espace de stockage insuffisant pour ce fichier.');
      }
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const removeBook = (id: string) => {
    const book = books.find((item) => item.id === id);
    if (!book || !window.confirm(`Supprimer « ${book.title} » ?`)) return;
    persist(books.filter((item) => item.id !== id));
    setMessage('Livre supprimé.');
  };

  return (
    <section className="w-full space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-black tracking-tight md:text-2xl">Bibliothèque numérique</h1>
          <p className="mt-1 text-xs opacity-45">Gestion des livres et ressources numériques de l’établissement</p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>
          <span className="text-base leading-none">+</span> Ajouter un livre
          <input ref={inputRef} type="file" accept={ACCEPTED_TYPES} onChange={handleUpload} className="sr-only" />
        </label>
      </div>

      {message && <p className="rounded-xl border px-4 py-3 text-xs font-semibold" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>{message}</p>}

      <div className="flex max-w-md items-center gap-3 rounded-xl border bg-white px-3 py-2.5 dark:bg-white/[0.03]" style={{ borderColor: 'var(--border)' }}>
        <Search size={16} className="opacity-45" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher par titre, format..." className="w-full bg-transparent text-xs outline-none" />
        <span className="shrink-0 text-[10px] font-bold opacity-45">{filteredBooks.length} livre(s)</span>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: 'var(--border)' }}>
          <BookOpen size={30} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-bold">Aucun livre disponible</p>
          <p className="mt-1 text-xs opacity-55">Importez un fichier PDF, EPUB, DOC ou DOCX depuis votre ordinateur.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm dark:bg-white/[0.03]" style={{ borderColor: 'var(--border)' }}>
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[minmax(220px,2fr)_1fr_1fr_1fr_110px] border-b px-3 py-3 text-[10px] font-black uppercase tracking-wider opacity-60 md:px-4" style={{ borderColor: 'var(--border)' }}>
              <span>Titre du livre</span><span>Format</span><span>Taille</span><span>Date d’ajout</span><span className="text-right">Actions</span>
            </div>
            {filteredBooks.map((book) => (
              <div key={book.id} className="grid grid-cols-[minmax(220px,2fr)_1fr_1fr_1fr_110px] items-center border-b px-3 py-3 text-xs last:border-b-0 md:px-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex min-w-0 items-center gap-2">
                  <FileText size={15} className="shrink-0 text-green-600" />
                  <span className="truncate font-semibold" title={book.fileName}>{book.title}</span>
                </div>
                <span className="text-[10px] font-semibold uppercase opacity-60">{book.fileType}</span>
                <span className="text-[10px] opacity-60">{formatSize(book.size)}</span>
                <span className="text-[10px] opacity-60">{new Date(book.addedAt).toLocaleDateString('fr-FR')}</span>
                <div className="flex justify-end gap-1.5">
                  <a href={book.dataUrl} download={book.fileName} title="Télécharger" className="inline-flex items-center justify-center rounded-lg border p-1.5 text-green-600 transition hover:bg-green-500/10" style={{ borderColor: 'var(--border)' }}>
                    <Download size={13} />
                  </a>
                  <button type="button" onClick={() => removeBook(book.id)} title="Supprimer" className="rounded-lg border p-1.5 text-red-500 transition hover:bg-red-500/10" style={{ borderColor: 'var(--border)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
