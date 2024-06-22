import { TvaInterface, CategoryInterface } from '../types';

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

