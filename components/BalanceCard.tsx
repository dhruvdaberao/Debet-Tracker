
import React from 'react';

interface BalanceCardProps {
  label: string;
  amount: number;
  color: string;
  icon: React.ReactNode;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ label, amount, color, icon }) => {
  return (
    <div className={`p-6 bg-white neo-border neo-shadow flex items-center gap-4`}>
      <div className={`p-3 rounded-full ${color} bg-opacity-20 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold font-heading">₹{amount.toLocaleString()}</p>
      </div>
    </div>
  );
};
