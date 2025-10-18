
import React from 'react';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const InfoTooltip: React.FC = () => {
  return (
    <div className="group relative flex justify-center">
      <InfoIcon />
      <div className="absolute bottom-full mb-2 w-64 scale-0 transform rounded-lg bg-gray-800 p-3 text-center text-xs text-white transition-all group-hover:scale-100">
        <p className="font-bold">Spam:</p>
        <p className="mb-2">Unsolicited messages, typically advertisements or scams.</p>
        <p className="font-bold">Ham:</p>
        <p>Legitimate, desired messages from known contacts or services.</p>
      </div>
    </div>
  );
};
