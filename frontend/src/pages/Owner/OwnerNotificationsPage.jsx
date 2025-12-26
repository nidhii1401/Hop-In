import React from 'react';
import { Bell, Clock, Check } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, text: "Rahul Sharma requested to join Room 101", time: "2 hours ago", type: "REQUEST", read: false },
  { id: 2, text: "Rent payment received from Sarah Lee", time: "1 day ago", type: "PAYMENT", read: true },
  { id: 3, text: "New policy update available for hostel owners", time: "3 days ago", type: "SYSTEM", read: true },
];

const OwnerNotificationsPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900">Notifications</h1>
        <button className="text-sm text-orange-700 font-medium hover:underline">Mark all as read</button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100">
        {NOTIFICATIONS.map((notif) => (
          <div key={notif.id} className={`p-4 flex gap-4 hover:bg-stone-50 transition-colors ${!notif.read ? 'bg-orange-50/30' : ''}`}>
            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? 'bg-orange-500' : 'bg-transparent'}`}></div>
            
            <div className={`p-2 rounded-full h-fit shrink-0 ${notif.type === 'PAYMENT' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
              <Bell size={18} />
            </div>
            
            <div className="flex-1">
              <p className={`text-sm ${!notif.read ? 'font-bold text-stone-900' : 'text-stone-600'}`}>
                {notif.text}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-stone-400">
                <Clock size={12} />
                <span>{notif.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerNotificationsPage;
