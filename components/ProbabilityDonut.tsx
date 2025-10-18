
import React from 'react';
import { Classification } from '../types';

interface ProbabilityDonutProps {
  probability: number;
  classification: Classification;
}

export const ProbabilityDonut: React.FC<ProbabilityDonutProps> = ({ probability, classification }) => {
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - probability * circumference;

  const color = classification === Classification.Spam ? 'text-red-500' : 'text-green-500';

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="absolute -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${color} transition-all duration-500 ease-out`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${color}`}>
          {Math.round(probability * 100)}%
        </span>
        <span className="text-sm text-gray-500">Confidence</span>
      </div>
    </div>
  );
};
