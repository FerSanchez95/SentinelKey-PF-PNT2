import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-600" />,
  error: <XCircle className="w-5 h-5 text-red-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  info: <Info className="w-5 h-5 text-blue-600" />,
};

const styleMap = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
};

export default function Tag({ type = 'info', children }) {
  return (
    <div className={`inline-flex justify-center items-center gap-2 px-3 py-1 rounded-full text-sm border ${styleMap[type]}`}>
      {iconMap[type]}
      <span>{children}</span>
    </div>
  );
}
