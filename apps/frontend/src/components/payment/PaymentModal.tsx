'use client';
import React, { useEffect, useState } from 'react';
import { Payment, PaymentMethod } from '@/lib/payement.type';
import { Button } from '../ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Payment) => void;
  initialData: Payment | null;
}

const PaymentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<Payment>({
    _id: '',
    invoice: '',
    amount: 0,
    method: PaymentMethod.CASH,
    reference: '',
    date: new Date().toISOString().slice(0, 10),
    recordedBy: 'Admin',
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  // ) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  //   const { name, value } = e.target;

  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: name === 'amount' ? Number(value) : value,
  //   }));
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-secondary-foreground/10   bg-opacity-50 flex justify-center items-center supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0">
      <div className="bg-white p-6 rounded w-full md:w-1/3">
        <h2 className="text-lg mb-4">
          {initialData ? 'Modifier' : 'Nouveau paiement'}
        </h2>

        <div className="w-full my-b-4 text-secondary-foreground/90">
          <label htmlFor="invoice">Facture</label>
          <select
            name="invoice"
            value={form.invoice}
            onChange={handleChange}
            className="w-full my-2 p-2 border"
          >
            <option value="" className="bg-primary">
              Sélectionner une facture
            </option>
            <option value="INV001">INV001</option>
            <option value="INV002">INV002</option>
          </select>
        </div>

        <div className="w-full my-b-4 text-secondary-foreground/90">
          <label htmlFor="amount">Montant</label>
          <input
            name="amount"
            type="number"
            placeholder="Montant"
            value={form.amount}
            onChange={handleChange}
            className="w-full my-2 p-2 border"
          />
        </div>

        <div className="w-full my-b-4 text-secondary-foreground/90">
          <label htmlFor="method">Méthode de paiement</label>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="w-full my-2 p-2 border"
          >
            {Object.values(PaymentMethod).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full my-b-4 text-secondary-foreground/90">
          <label htmlFor="reference">Référence du paiement</label>
          <input
            name="reference"
            placeholder="Référence"
            value={form.reference}
            onChange={handleChange}
            className="w-full my-2 p-2 border"
          />
        </div>

        <div className="w-full my-b-4 text-secondary-foreground/90">
          <label htmlFor="date">Date du paiement</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full my-4 p-2 border"
          />
        </div>

        <div className="flex justify-end space-x-2 ">
          <Button variant={'outline'} onClick={onClose}>
            Annuler
          </Button>
          <Button variant={'default'} onClick={() => onSubmit(form)}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
