import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Inbox, ArrowRight } from 'lucide-react';

// Mock Data (Replace with API Call)
const MOCK_REQUESTS = [
  {
    id: 1,
    hostelName: "The Grind House",
    roomDetails: "Private Room - #204",
    date: "Oct 26, 2023",
    status: "ACCEPTED",
  },
  {
    id: 2,
    hostelName: "The Daily Bean",
    roomDetails: "4-Bed Female Dorm",
    date: "Oct 24, 2023",
    status: "PENDING",
  },
  {
    id: 3,
    hostelName: "Espresso Towers",
    roomDetails: "6-Bed Mixed Dorm",
    date: "Oct 22, 2023",
    status: "REJECTED",
  },
];

const MyRequests = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  // Filter Logic
  const filteredRequests = MOCK_REQUESTS.filter(req => {
    if (filter === 'ALL') return true;
    return req.status === filter;
  });

  // --- Helper Components ---

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={14} /> Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  const FilterButton = ({ label, value }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        filter === value
          ? 'bg-orange-600 text-white shadow-md'
          : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">My Join Requests</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Track the status of your hostel applications.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        <FilterButton label="All Requests" value="ALL" />
        <FilterButton label="Pending" value="PENDING" />
        <FilterButton label="Accepted" value="ACCEPTED" />
        <FilterButton label="Rejected" value="REJECTED" />
      </div>

      {/* Content Area */}
      {filteredRequests.length > 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-xs uppercase font-semibold">
                  <th className="px-6 py-4">Hostel</th>
                  <th className="px-6 py-4">Room Details</th>
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-900 dark:text-stone-100">
                      {req.hostelName}
                    </td>
                    <td className="px-6 py-4 text-stone-600 dark:text-stone-400">
                      {req.roomDetails}
                    </td>
                    <td className="px-6 py-4 text-stone-500 dark:text-stone-500 text-sm">
                      {req.date}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'ACCEPTED' && (
                        <button 
                          onClick={() => navigate('/hosteller/stay')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                        >
                          View Stay <ArrowRight size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-800">
          <div className="w-20 h-20 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4 text-stone-400">
            <Inbox size={40} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">No Requests Found</h3>
          <p className="text-stone-500 dark:text-stone-400 mb-6 text-center max-w-sm">
            {filter === 'ALL' 
              ? "You haven't made any join requests yet. Browse hostels to get started!" 
              : `You don't have any ${filter.toLowerCase()} requests.`}
          </p>
          {filter === 'ALL' && (
            <button 
              onClick={() => navigate('/hosteller/browse')}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              Browse Hostels
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
