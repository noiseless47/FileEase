"use client";

import { ReactNode } from 'react';

interface CardProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  gradient?: boolean;
}

export default function Card({ title, description, children, icon, gradient = false }: CardProps) {
  return (
    <div className={`rounded-xl border ${
      gradient 
        ? 'border-transparent bg-gradient-to-br from-pink-500/5 to-violet-500/5 dark:from-pink-500/10 dark:to-violet-500/10' 
        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
      } shadow-sm p-6 transition-all hover:shadow-md hover-lift`}>
      <div className="flex items-start gap-4 mb-6">
        {icon && (
          <div className={`p-2.5 rounded-xl ${
            gradient 
              ? 'bg-gradient-to-r from-pink-600 to-violet-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            } shadow-sm`}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-display font-semibold text-xl">{title}</h3>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1.5">{description}</p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
} 