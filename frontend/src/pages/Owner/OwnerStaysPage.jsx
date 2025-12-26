import React, { useState } from 'react';
import { Search, Filter, MoreVertical, LogOut, CheckCircle } from 'lucide-react';

const MOCK_STAYS = [
  { 
    id: 1, 
    hostellerName: "Amit Verma", 
    hostelName: "Orange Grove", 
    roomNumber: "101", 
    startDate: "2024-01-15", 
    status: "ACTIVE", 
    messStatus: "OPTED", 
    dueAmount: 0 
  },
  { 
    id: 2, 
    hostellerName: "Sarah Lee", 
    hostelName: "Orange Grove", 
    roomNumber: "204", 
    startDate: "2024-02-01", 
    status: "LEAVE_REQUESTED", 
    messStatus: "NOT_OPTED", 
    dueAmount: 500 
  },
  { 
    id: 3, 
    hostellerName: "Mike Chen", 
    hostelName: "Blue Sky", 
    roomNumber: "305", 
    startDate: "2023-11-10", 
    status: "LEFT", 
    messStatus: "NONE", 
    dueAmount: 0 
  }
];

const OwnerStaysPage = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'LEAVE_REQUESTED': return 'bg-red-100 text-red-700';
      case 'LEFT': return 'bg-stone-100 text-stone-500';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Resident Stays</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search residents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <button className="p-2 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 text-stone-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-1">
        {['ALL', 'ACTIVE', 'LEAVE_REQUESTED', 'LEFT'].map(status => (
          <button 
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
              filterStatus === status 
                ? 'bg-stone-100 text-stone-900 border-b-2 border-orange-500' 
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 dark:bg-stone-950 border-b border-stone-100 dark:border-stone-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Resident</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Room Info</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Join Date</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_STAYS.map((stay) => (
                <tr key={stay.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-stone-900">{stay.hostellerName}</div>
                    <div className="text-xs text-stone-500">ID: #{stay.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{stay.roomNumber}</div>
                    <div className="text-xs text-stone-500">{stay.hostelName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">{stay.startDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(stay.status)}`}>
                      {stay.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {stay.status === 'LEAVE_REQUESTED' ? (
                      <button className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded hover:bg-stone-800 flex items-center gap-1 ml-auto">
                        <CheckCircle size={14} /> Approve Leave
                      </button>
                    ) : (
                      <button className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100">
                        <MoreVertical size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerStaysPage;
