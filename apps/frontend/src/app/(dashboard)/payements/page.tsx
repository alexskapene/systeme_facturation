'use client';
import React, { useState } from 'react';
import { Payment } from '@/lib/payement.type';
import PaymentTable from '../../../components/payment/PaymentTable';
import PaymentModal from '../../../components/payment/PaymentModal';
import { Button } from '@/components/ui/button';
import { BadgePlus } from 'lucide-react';

const mockData: Payment[] = [
  {
    _id: '1',
    invoice: 'INV001',
    amount: 100,
    method: 'CASH',
    reference: '',
    date: '2024-01-10',
    recordedBy: 'Admin',
  },
];

const PaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>(mockData);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);

  const handleAdd = () => {
    setSelectedPayment(null);
    setIsOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    setPayments((prev) => prev.filter((p) => p._id !== id));
  };

  const handleSubmit = (data: Payment) => {
    if (selectedPayment) {
      // update
      setPayments((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } else {
      // create
      setPayments((prev) => [...prev, { ...data, _id: Date.now().toString() }]);
    }

    setIsOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Paiements</h1>

        <Button variant="default" onClick={handleAdd}>
          <BadgePlus className="mr-2" /> Nouveau paiement
        </Button>
      </div>

      <PaymentTable
        payments={payments}
        onEdit={handleEdit}
        onDelete={(id) => setDeletePaymentId(id)}
      />

      <PaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedPayment}
      />
      {deletePaymentId && (
        <div className="fixed inset-0 bg-secondary-foreground/10  bg-opacity-50 flex items-center justify-center supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0">
          <div className="bg-secondary p-6 rounded shadow  ">
            <p>Êtes-vous sûr de vouloir supprimer ce paiement ?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeletePaymentId(null)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="bg-red-500 hover:bg-red-500/90 text-secondary"
                onClick={() => {
                  handleDelete(deletePaymentId);
                  setDeletePaymentId(null);
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PaymentPage;
