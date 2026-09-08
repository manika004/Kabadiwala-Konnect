import React from 'react';
import { PickupStatus } from '../types';

export const StatusBadge: React.FC<{ status: PickupStatus }> = ({ status }) => {
  switch (status) {
    case 'requested':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full animate-pulse"></span>
          Matching Collector
        </span>
      );
    case 'accepted':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full"></span>
          Collector Accepted
        </span>
      );
    case 'on_the_way':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-indigo-500 rounded-full animate-ping"></span>
          On The Way
        </span>
      );
    case 'collected':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-purple-500 rounded-full"></span>
          Weighed & Collected
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};