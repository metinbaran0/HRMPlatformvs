import React, { useState } from 'react';

interface ExpenseFormProps {
  onSubmit: (description: string, amount: number, date: string) => void; // onSubmit fonksiyonu parametre olarak form verilerini alacak
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit fonksiyonuna form verilerini gönderiyoruz
    onSubmit(description, amount, date);
    // Formu temizliyoruz
    setDescription('');
    setAmount(0);
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        className='expense-form-input'
        type="text"
        placeholder="Masraf Açıklaması"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Tutar"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Masraf Ekle</button>
    </form>
  );
};

export default ExpenseForm;
