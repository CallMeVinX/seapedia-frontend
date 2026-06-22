"use client";

import { useState, useEffect } from "react";
import DashboardShell, { SidebarLink } from "@/components/layout/DashboardShell";
import { LayoutDashboard, Package, ShoppingCart, Users, Download, Settings } from "lucide-react";
import Button from "@/components/ui/Button";
import { dashboardService, AdminStatsResponse } from "@/services/dashboardService";

// Dummy Sidebar Links for Admin
const adminSidebarLinks: SidebarLink[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Users", href: "/admin/users" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardShell
      title="Admin Dashboard"
      subtitle="Admin Console"
      sidebarLinks={adminSidebarLinks}
    >
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor key metrics and recent activities.</p>
          </div>
          <Button variant="primary" className="w-auto px-4 py-2" icon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pengguna</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {loading ? "..." : stats?.users.toLocaleString() || "0"}
              </h3>
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                Total terdaftar
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pesanan</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {loading ? "..." : stats?.orders.toLocaleString() || "0"}
              </h3>
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                Total pesanan
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm flex justify-between items-start relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Status Overdue</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {loading ? "..." : stats?.overdue_orders.toLocaleString() || "0"}
              </h3>
              <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                <span className="text-slate-400 font-normal">requires immediate action</span>
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-900">Order Volume Trends</h3>
              <select className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-600 focus:outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            {/* CSS Bar Chart */}
            <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-auto pt-4 relative h-64 border-b border-l border-slate-200 pl-2">
              <span className="absolute left-[-20px] bottom-[50%] text-xs text-slate-400">500</span>
              <span className="absolute left-[-20px] top-0 text-xs text-slate-400">1k</span>
              <span className="absolute left-[-20px] bottom-0 text-xs text-slate-400">0</span>
              
              {/* Dummy Bars */}
              <div className="flex-1 flex flex-col justify-end items-center group">
                <div className="w-full bg-slate-300 group-hover:bg-blue-400 transition-colors rounded-t-sm" style={{ height: "45%" }}></div>
                <span className="text-xs text-slate-500 mt-2">Mon</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group">
                <div className="w-full bg-slate-300 group-hover:bg-blue-400 transition-colors rounded-t-sm" style={{ height: "30%" }}></div>
                <span className="text-xs text-slate-500 mt-2">Tue</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group">
                <div className="w-full bg-slate-400 group-hover:bg-blue-400 transition-colors rounded-t-sm" style={{ height: "55%" }}></div>
                <span className="text-xs text-slate-500 mt-2">Wed</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group">
                <div className="w-full bg-slate-400 group-hover:bg-blue-400 transition-colors rounded-t-sm" style={{ height: "40%" }}></div>
                <span className="text-xs text-slate-500 mt-2">Thu</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group">
                <div className="w-full bg-blue-700 group-hover:bg-blue-600 transition-colors rounded-t-sm" style={{ height: "70%" }}></div>
                <span className="text-xs text-slate-500 mt-2">Fri</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group">
                <div className="w-full bg-blue-900 group-hover:bg-blue-800 transition-colors rounded-t-sm" style={{ height: "60%" }}></div>
                <span className="text-xs text-slate-500 mt-2">Sat</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group">
                <div className="w-full bg-blue-900 group-hover:bg-blue-800 transition-colors rounded-t-sm" style={{ height: "85%" }}></div>
                <span className="text-xs text-slate-500 mt-2">Sun</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">View All</button>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {/* Timeline Item 1 */}
              <div className="relative flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 leading-tight">Order #8492 was dispatched from Jakarta Hub.</p>
                  <p className="text-xs text-slate-500 mt-1">10 minutes ago</p>
                </div>
              </div>
              {/* Timeline Item 2 */}
              <div className="relative flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 leading-tight">Payment failed for Order #8488.</p>
                  <p className="text-xs text-slate-500 mt-1">45 minutes ago</p>
                </div>
              </div>
              {/* Timeline Item 3 */}
              <div className="relative flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 leading-tight">New user registration: PT Maju Bersama.</p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
              {/* Timeline Item 4 */}
              <div className="relative flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                  <Settings className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 leading-tight">System update completed successfully.</p>
                  <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
