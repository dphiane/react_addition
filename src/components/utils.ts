import { TvaInterface, CategoryInterface } from './types';

export const getCategoryNameFromIRI = (categoryIRI: string | undefined, categories: CategoryInterface[]) => {
  if (!categoryIRI) {
    return 'Catégorie inconnue';
  }
  const categoryId = categoryIRI.split('/').pop()!;
  const category = categories.find(cat => cat.id === parseInt(categoryId, 10));
  return category ? category.name : 'Catégorie inconnue';
};

export const getTvaFromIri = (tvaIRI: string | undefined, tvas: TvaInterface[]) => {
  if (!tvaIRI) {
    return 'TVA inconnue';
  }
  const tvaId = tvaIRI.split('/').pop()!;
  const tva = tvas.find(tva => tva.id === parseInt(tvaId, 10));
  return tva ? tva.tva : 'TVA inconnue';
};


export const formatDate = (date: Date) => {
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

// Formatage de l'heure
export const formatTime = (date: Date) => {
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}h${minutes}`;
};

export const formatDateForResearch = (date: Date) => {
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${year}-${month}-${day}`;
}