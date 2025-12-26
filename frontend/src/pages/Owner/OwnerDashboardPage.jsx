import React, { useEffect } from "react";
import { Users, Mail, Building } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OwnerDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate()

  useEffect(() => {
    const handleNavigate = () => {
      if (user) {
        if (user.role === "ADMIN" || user.role === "OWNER") {
          navigate(`/owner/browse`);
        } else {
          navigate(`/hosteller/browse`);
        }
      } else {
        // Optional: redirect to login
        navigate("/login");
      }
    };

    handleNavigate();
  }, []);
  return (
    <div className=" space-y-6">
      <h1 className=" text-2xl font-bold text-stone-900 dark:text-stone-100">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Occupancy Card */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                Total Occupancy
              </p>
              <h3 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-2">
                64%
              </h3>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-500 rounded-lg">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 w-[64%]"></div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                Pending Requests
              </p>
              <h3 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-2">
                2
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500 rounded-lg">
              <Mail size={24} />
            </div>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">
            Requires attention
          </p>
        </div>

        {/* Revenue Requests */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                Total Revenue
              </p>
              <h3 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-2">
                ₹2.4L
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500 rounded-lg">
              <Building size={24} />
            </div>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">
            +12% from last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
