import React from 'react';
import { CheckCircle, XCircle, Search, Mail } from 'lucide-react';

const MOCK_REQUESTS = [
  { id: 101, name: "Rahul Sharma", hostel: "Orange Grove", type: "Double Shared", status: "PENDING", date: "2024-03-15", email: "rahul@test.com" },
  { id: 102, name: "Priya Singh", hostel: "Orange Grove", type: "Single", status: "PENDING", date: "2024-03-14", email: "priya@test.com" },
];

const OwnerRequestsPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Invite Section */}
      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-orange-900 dark:text-orange-400">Invite a Resident</h2>
          <p className="text-sm text-orange-700/80 dark:text-orange-300/80">Search by email or phone to send a direct booking invite.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 text-orange-400" size={16} />
            <input 
              type="text" 
              placeholder="student@email.com" 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            />
          </div>
          <button className="bg-orange-700 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-orange-800 transition-colors">
            Send Invite
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Mail size={20} /> Pending Join Requests
        </h2>
        
        <div className="space-y-4">
          {MOCK_REQUESTS.map(req => (
            <div key={req.id} className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center font-bold text-xl text-stone-600">
                  {req.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100">{req.name}</h3>
                  <p className="text-sm text-stone-500">{req.email} • {req.date}</p>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Requested Room</p>
                <p className="font-medium text-stone-800 dark:text-stone-200">{req.type}</p>
                <p className="text-xs text-stone-500">{req.hostel}</p>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-green-200">
                  <CheckCircle size={18} /> Accept
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 px-6 py-2 rounded-lg font-medium transition-colors">
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}

          {MOCK_REQUESTS.length === 0 && (
            <div className="text-center py-16 bg-stone-50 rounded-xl border border-dashed border-stone-300">
              <p className="text-stone-400">No pending requests at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerRequestsPage;
