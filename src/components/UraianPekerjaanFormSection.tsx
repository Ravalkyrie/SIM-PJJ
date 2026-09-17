/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import { UraianPekerjaan, DivisiPekerjaan, ItemPekerjaan } from '../types';
import {
  addDivisi,
  updateDivisi,
  deleteDivisi,
  addItem,
  updateItem,
  deleteItem,
  getAvailableDivisiNumbers
} from '../lib/uraianPekerjaan';
import DivisiFormModal from './DivisiFormModal';
import ItemFormModal from './ItemFormModal';

interface UraianPekerjaanFormSectionProps {
  uraianPekerjaan: UraianPekerjaan;
  onChange: (uraianPekerjaan: UraianPekerjaan) => void;
}

export default function UraianPekerjaanFormSection({
  uraianPekerjaan,
  onChange
}: UraianPekerjaanFormSectionProps) {
  const [expandedDivisi, setExpandedDivisi] = useState<string[]>([]);
  const [divisiModalOpen, setDivisiModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingDivisi, setEditingDivisi] = useState<DivisiPekerjaan | null>(null);
  const [editingItem, setEditingItem] = useState<{ divisiId: string; item: ItemPekerjaan } | null>(null);
  const [currentDivisiId, setCurrentDivisiId] = useState<string | null>(null);

  const toggleDivisi = (divisiId: string) => {
    setExpandedDivisi(prev =>
      prev.includes(divisiId)
        ? prev.filter(id => id !== divisiId)
        : [...prev, divisiId]
    );
  };

  const handleAddDivisi = () => {
    setEditingDivisi(null);
    setDivisiModalOpen(true);
  };

  const handleEditDivisi = (divisi: DivisiPekerjaan) => {
    setEditingDivisi(divisi);
    setDivisiModalOpen(true);
  };

  const handleSaveDivisi = (nomorDivisi: number, namaDivisi: string) => {
    try {
      if (editingDivisi) {
        const updated = updateDivisi(uraianPekerjaan, editingDivisi.id, namaDivisi);
        onChange(updated);
      } else {
        const updated = addDivisi(uraianPekerjaan, nomorDivisi, namaDivisi);
        onChange(updated);
        const newDivisi = updated.divisiList.find(d => d.nomorDivisi === nomorDivisi);
        if (newDivisi) {
          setExpandedDivisi(prev => [...prev, newDivisi.id]);
        }
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const handleDeleteDivisi = (divisiId: string) => {
    const divisi = uraianPekerjaan.divisiList.find(d => d.id === divisiId);
    if (!divisi) return;

    const itemCount = divisi.items.length;
    const message = itemCount > 0
      ? `Hapus Divisi ${divisi.nomorDivisi} - ${divisi.namaDivisi}?\n\nPeringatan: ${itemCount} item pekerjaan akan ikut terhapus.`
      : `Hapus Divisi ${divisi.nomorDivisi} - ${divisi.namaDivisi}?`;

    if (window.confirm(message)) {
      const updated = deleteDivisi(uraianPekerjaan, divisiId);
      onChange(updated);
    }
  };

  const handleAddItem = (divisiId: string) => {
    setCurrentDivisiId(divisiId);
    setEditingItem(null);
    setItemModalOpen(true);
  };

  const handleEditItem = (divisiId: string, item: ItemPekerjaan) => {
    setCurrentDivisiId(divisiId);
    setEditingItem({ divisiId, item });
    setItemModalOpen(true);
  };

  const handleSaveItem = (item: Omit<ItemPekerjaan, 'id' | 'jumlahHarga' | 'bobot'>) => {
    if (!currentDivisiId) return;

    try {
      if (editingItem) {
        const updated = updateItem(uraianPekerjaan, currentDivisiId, editingItem.item.id, item);
        onChange(updated);
      } else {
        const updated = addItem(uraianPekerjaan, currentDivisiId, item);
        onChange(updated);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const handleDeleteItem = (divisiId: string, itemId: string) => {
    if (window.confirm('Hapus item pekerjaan ini?')) {
      const updated = deleteItem(uraianPekerjaan, divisiId, itemId);
      onChange(updated);
    }
  };

  const availableNumbers = getAvailableDivisiNumbers(uraianPekerjaan.divisiList);



  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Briefcase className="w-4 h-4 text-amber-500" />
          G. Uraian Pekerjaan
        </h3>

        <div className="bg-amber-50 border border-amber-200 rounded p-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-amber-600 font-medium">Total Divisi</p>
            <p className="text-lg font-bold text-amber-900">{uraianPekerjaan.totalDivisi || 0}</p>
          </div>
          <div>
            <p className="text-xs text-amber-600 font-medium">Total Item</p>
            <p className="text-lg font-bold text-amber-900">{uraianPekerjaan.totalItem || 0}</p>
          </div>
          <div>
            <p className="text-xs text-amber-600 font-medium">Total Nilai</p>
            <p className="text-lg font-bold text-amber-900">
              Rp{(uraianPekerjaan.totalNilaiPekerjaan || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddDivisi}
          disabled={availableNumbers.length === 0}
          className="w-full px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {availableNumbers.length === 0 ? 'Semua Divisi Sudah Digunakan' : 'Tambah Divisi'}
        </button>

        <div className="space-y-2">
          {uraianPekerjaan.divisiList.map((divisi) => {
            const isExpanded = expandedDivisi.includes(divisi.id);
            return (
              <div key={divisi.id} className="border border-slate-200 rounded overflow-hidden">
                <div className="bg-slate-50 p-3">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDivisi(divisi.id)}
                      className="text-slate-600 hover:text-slate-800 transition mt-0.5"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        DIVISI {divisi.nomorDivisi} — {divisi.namaDivisi}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {divisi.items.length} item | Total: Rp{(divisi.totalDivisi || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditDivisi(divisi)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit Divisi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDivisi(divisi.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                        title="Hapus Divisi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>


                {isExpanded && (
                  <div className="p-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleAddItem(divisi.id)}
                      className="w-full px-3 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Item
                    </button>

                    {divisi.items.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-3">
                        Belum ada item pekerjaan
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {divisi.items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white border border-slate-200 rounded p-2.5 hover:border-amber-300 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800">
                                  {item.kodeItem} {item.uraian}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">
                                  {item.satuan} | Vol: {item.volume} × Rp{item.hargaSatuan.toLocaleString('id-ID')}
                                </p>
                                <p className="text-xs font-medium text-amber-700 mt-1">
                                  Total: Rp{item.jumlahHarga.toLocaleString('id-ID')} ({item.bobot.toFixed(2)}%)
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditItem(divisi.id, item)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(divisi.id, item.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {uraianPekerjaan.divisiList.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-6">
            Belum ada divisi. Klik "Tambah Divisi" untuk mulai menambahkan uraian pekerjaan.
          </p>
        )}
      </div>

      <DivisiFormModal
        isOpen={divisiModalOpen}
        onClose={() => setDivisiModalOpen(false)}
        onSave={handleSaveDivisi}
        availableNumbers={availableNumbers}
        editMode={!!editingDivisi}
        initialData={editingDivisi || undefined}
      />

      <ItemFormModal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSave={handleSaveItem}
        editMode={!!editingItem}
        initialData={editingItem?.item}
      />
    </>
  );
}
