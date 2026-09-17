/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UraianPekerjaan, DivisiPekerjaan, ItemPekerjaan } from '../types';

/**
 * Calculate jumlahHarga for an item
 * jumlahHarga = hargaSatuan × volume
 */
export const calculateJumlahHarga = (hargaSatuan: number, volume: number): number => {
  return hargaSatuan * volume;
};

/**
 * Calculate totalDivisi for a divisi
 * totalDivisi = SUM of all items jumlahHarga
 */
export const calculateTotalDivisi = (items: ItemPekerjaan[]): number => {
  return items.reduce((sum, item) => sum + item.jumlahHarga, 0);
};

/**
 * Calculate totalNilaiPekerjaan for entire uraian pekerjaan
 * totalNilaiPekerjaan = SUM of all divisi totalDivisi
 */
export const calculateTotalNilaiPekerjaan = (divisiList: DivisiPekerjaan[]): number => {
  return divisiList.reduce((sum, divisi) => sum + (divisi.totalDivisi || 0), 0);
};

/**
 * Calculate bobot (percentage) for an item
 * bobot = (jumlahHarga / totalNilaiPekerjaan) × 100
 */
export const calculateBobot = (jumlahHarga: number, totalNilaiPekerjaan: number): number => {
  if (totalNilaiPekerjaan === 0) return 0;
  return (jumlahHarga / totalNilaiPekerjaan) * 100;
};

/**
 * Calculate total count of divisi
 */
export const calculateTotalDivisiCount = (divisiList: DivisiPekerjaan[]): number => {
  return divisiList.length;
};

/**
 * Calculate total count of all items across all divisi
 */
export const calculateTotalItemCount = (divisiList: DivisiPekerjaan[]): number => {
  return divisiList.reduce((sum, divisi) => sum + divisi.items.length, 0);
};

/**
 * Validate if nomor divisi is already used in the contract
 * Returns true if valid (not used), false if already exists
 */
export const validateNomorDivisi = (
  nomorDivisi: number,
  existingDivisiList: DivisiPekerjaan[],
  currentDivisiId?: string
): boolean => {
  const exists = existingDivisiList.some(
    divisi => divisi.nomorDivisi === nomorDivisi && divisi.id !== currentDivisiId
  );
  return !exists;
};

/**
 * Get available divisi numbers (1-10) that are not yet used
 */
export const getAvailableDivisiNumbers = (existingDivisiList: DivisiPekerjaan[]): number[] => {
  const usedNumbers = existingDivisiList.map(d => d.nomorDivisi);
  const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return allNumbers.filter(num => !usedNumbers.includes(num));
};

/**
 * Sort divisi list by nomor divisi (ascending)
 */
export const sortDivisiByNumber = (divisiList: DivisiPekerjaan[]): DivisiPekerjaan[] => {
  return [...divisiList].sort((a, b) => a.nomorDivisi - b.nomorDivisi);
};


/**
 * Recalculate all auto fields for uraian pekerjaan
 * This should be called after any change to divisi or items
 */
export const recalculateUraianPekerjaan = (uraianPekerjaan: UraianPekerjaan): UraianPekerjaan => {
  // Step 1: Recalculate jumlahHarga for all items
  const updatedDivisiList = uraianPekerjaan.divisiList.map(divisi => {
    const updatedItems = divisi.items.map(item => ({
      ...item,
      jumlahHarga: calculateJumlahHarga(item.hargaSatuan, item.volume)
    }));

    // Step 2: Calculate totalDivisi
    const totalDivisi = calculateTotalDivisi(updatedItems);

    return {
      ...divisi,
      items: updatedItems,
      totalDivisi
    };
  });

  // Step 3: Calculate totalNilaiPekerjaan
  const totalNilaiPekerjaan = calculateTotalNilaiPekerjaan(updatedDivisiList);

  // Step 4: Recalculate bobot for all items
  const finalDivisiList = updatedDivisiList.map(divisi => ({
    ...divisi,
    items: divisi.items.map(item => ({
      ...item,
      bobot: calculateBobot(item.jumlahHarga, totalNilaiPekerjaan)
    }))
  }));

  // Step 5: Sort divisi by number
  const sortedDivisiList = sortDivisiByNumber(finalDivisiList);

  return {
    ...uraianPekerjaan,
    divisiList: sortedDivisiList,
    totalDivisi: calculateTotalDivisiCount(sortedDivisiList),
    totalItem: calculateTotalItemCount(sortedDivisiList),
    totalNilaiPekerjaan,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Create new empty uraian pekerjaan for a contract
 */
export const createEmptyUraianPekerjaan = (contractId: string): UraianPekerjaan => {
  return {
    id: `URAIAN-${Date.now()}`,
    contractId,
    divisiList: [],
    totalDivisi: 0,
    totalItem: 0,
    totalNilaiPekerjaan: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Add divisi to uraian pekerjaan
 */
export const addDivisi = (
  uraianPekerjaan: UraianPekerjaan,
  nomorDivisi: number,
  namaDivisi: string
): UraianPekerjaan => {
  if (!validateNomorDivisi(nomorDivisi, uraianPekerjaan.divisiList)) {
    throw new Error(`Divisi ${nomorDivisi} sudah digunakan dalam kontrak ini`);
  }

  const newDivisi: DivisiPekerjaan = {
    id: `DIV-${Date.now()}`,
    nomorDivisi,
    namaDivisi,
    items: [],
    totalDivisi: 0
  };

  const updated = {
    ...uraianPekerjaan,
    divisiList: [...uraianPekerjaan.divisiList, newDivisi]
  };

  return recalculateUraianPekerjaan(updated);
};

/**
 * Update divisi name
 */
export const updateDivisi = (
  uraianPekerjaan: UraianPekerjaan,
  divisiId: string,
  namaDivisi: string
): UraianPekerjaan => {
  const updated = {
    ...uraianPekerjaan,
    divisiList: uraianPekerjaan.divisiList.map(divisi =>
      divisi.id === divisiId ? { ...divisi, namaDivisi } : divisi
    )
  };

  return recalculateUraianPekerjaan(updated);
};

/**
 * Delete divisi
 */
export const deleteDivisi = (
  uraianPekerjaan: UraianPekerjaan,
  divisiId: string
): UraianPekerjaan => {
  const updated = {
    ...uraianPekerjaan,
    divisiList: uraianPekerjaan.divisiList.filter(divisi => divisi.id !== divisiId)
  };

  return recalculateUraianPekerjaan(updated);
};

/**
 * Add item to divisi
 */
export const addItem = (
  uraianPekerjaan: UraianPekerjaan,
  divisiId: string,
  item: Omit<ItemPekerjaan, 'id' | 'jumlahHarga' | 'bobot'>
): UraianPekerjaan => {
  const newItem: ItemPekerjaan = {
    ...item,
    id: `ITEM-${Date.now()}`,
    jumlahHarga: calculateJumlahHarga(item.hargaSatuan, item.volume),
    bobot: 0
  };

  const updated = {
    ...uraianPekerjaan,
    divisiList: uraianPekerjaan.divisiList.map(divisi =>
      divisi.id === divisiId
        ? { ...divisi, items: [...divisi.items, newItem] }
        : divisi
    )
  };

  return recalculateUraianPekerjaan(updated);
};

/**
 * Update item
 */
export const updateItem = (
  uraianPekerjaan: UraianPekerjaan,
  divisiId: string,
  itemId: string,
  item: Omit<ItemPekerjaan, 'id' | 'jumlahHarga' | 'bobot'>
): UraianPekerjaan => {
  const updated = {
    ...uraianPekerjaan,
    divisiList: uraianPekerjaan.divisiList.map(divisi =>
      divisi.id === divisiId
        ? {
            ...divisi,
            items: divisi.items.map(existingItem =>
              existingItem.id === itemId
                ? {
                    ...item,
                    id: itemId,
                    jumlahHarga: calculateJumlahHarga(item.hargaSatuan, item.volume),
                    bobot: 0
                  }
                : existingItem
            )
          }
        : divisi
    )
  };

  return recalculateUraianPekerjaan(updated);
};

/**
 * Delete item
 */
export const deleteItem = (
  uraianPekerjaan: UraianPekerjaan,
  divisiId: string,
  itemId: string
): UraianPekerjaan => {
  const updated = {
    ...uraianPekerjaan,
    divisiList: uraianPekerjaan.divisiList.map(divisi =>
      divisi.id === divisiId
        ? { ...divisi, items: divisi.items.filter(item => item.id !== itemId) }
        : divisi
    )
  };

  return recalculateUraianPekerjaan(updated);
};
