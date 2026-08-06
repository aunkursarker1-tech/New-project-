import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  KeyRound,
  History,
  Activity,
  Trash2,
  Edit,
  Shield,
  Eye,
  X,
  Phone,
  Mail,
  Lock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Copy,
  ExternalLink,
  Clock
} from 'lucide-react';
import {
  AdminUser,
  AdminRole,
  AdminUserStatus,
  ALL_ROLES,
  ROLE_DESCRIPTIONS,
} from '../../../lib/adminPermissions';

interface AdminUsersSectionProps {
  darkMode: boolean;
  adminUsers: AdminUser[];
  currentAdminRole: AdminRole;
  onAddUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'loginHistory' | 'activityLogs'>) => void;
  onUpdateUser: (updatedUser: AdminUser) => void;
  onDeleteUser: (userId: string) => void;
  onBulkUpdateStatus: (userIds: string[], status: AdminUserStatus) => void;
  onBulkDelete: (userIds: string[]) => void;
  onResetPassword: (userId: string, newPassword?: string) => string;
}

export const AdminUsersSection: React.FC<AdminUsersSectionProps> = ({
  darkMode,
  adminUsers,
  currentAdminRole,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onBulkUpdateStatus,
  onBulkDelete,
  onResetPassword,
}) => {
  // Filtering & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selection state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [loginHistoryUser, setLoginHistoryUser] = useState<AdminUser | null>(null);
  const [activityLogUser, setActivityLogUser] = useState<AdminUser | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<AdminUser | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);
  const [resetGeneratedCode, setResetGeneratedCode] = useState<string | null>(null);

  // Form State for Add / Edit Modal
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin' as AdminRole,
    status: 'Active' as AdminUserStatus,
    avatar: '',
  });

  const isSuperAdmin = currentAdminRole === 'Super Admin';

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Admin',
      status: 'Active',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
    });
  };

  // Submit Add / Edit Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar || editingUser.avatar,
      });
      setEditingUser(null);
    } else {
      onAddUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
        lastLogin: 'Never (Just Created)',
      });
      setIsAddModalOpen(false);
    }
  };

  // Filter Users
  const filteredUsers = adminUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginated Users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(paginatedUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Last Login', 'Created Date'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.phone}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.lastLogin}"`,
      `"${u.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gadgetghor_admin_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Reset Password
  const handleTriggerResetPassword = (user: AdminUser) => {
    setResetPasswordUser(user);
    const code = onResetPassword(user.id);
    setResetGeneratedCode(code);
  };

  // Helpers for Badges
  const getRoleBadgeColor = (role: AdminRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Admin':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Moderator':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Customer Support':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Inventory Manager':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Order Manager':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Marketing Manager':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Delivery Manager':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadge = (status: AdminUserStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
          </span>
        );
      case 'Suspended':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" /> Suspended
          </span>
        );
      case 'Disabled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> Disabled
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  // Stats Counters
  const totalCount = adminUsers.length;
  const activeCount = adminUsers.filter((u) => u.status === 'Active').length;
  const superAdminCount = adminUsers.filter((u) => u.role === 'Super Admin').length;
  const suspendedCount = adminUsers.filter((u) => u.status === 'Suspended' || u.status === 'Disabled').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-black tracking-tight">Admin & Staff Management</h1>
          </div>
          <p className="text-xs text-slate-400">
            Manage administrative personnel, assign granular security roles, audit login trails and enforce access controls.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Add New Admin Account
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Staff Accounts</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2">{totalCount}</div>
        </div>

        <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Accounts</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 text-emerald-400">{activeCount}</div>
        </div>

        <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Super Administrators</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black mt-2 text-purple-400">{superAdminCount}</div>
        </div>

        <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Suspended / Restricted</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black mt-2 text-rose-400">{suspendedCount}</div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Bulk Operations & Export */}
      <div className={`p-4 rounded-3xl border space-y-4 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold border outline-none transition-all ${
                darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
              }`}
            />
          </div>

          {/* Filters & Export */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold border outline-none ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Roles ({adminUsers.length})</option>
              {ALL_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold border outline-none ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Disabled">Disabled</option>
              <option value="Pending">Pending</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 hover:text-emerald-400' : 'bg-slate-100 border-slate-200 text-slate-800 hover:text-emerald-600'
              }`}
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedUserIds.length > 0 && isSuperAdmin && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-bold animate-fadeIn">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {selectedUserIds.length} users selected
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onBulkUpdateStatus(selectedUserIds, 'Active');
                  setSelectedUserIds([]);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black hover:brightness-110"
              >
                Enable Active
              </button>
              <button
                onClick={() => {
                  onBulkUpdateStatus(selectedUserIds, 'Suspended');
                  setSelectedUserIds([]);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black hover:brightness-110"
              >
                Suspend Selected
              </button>
              <button
                onClick={() => {
                  onBulkDelete(selectedUserIds);
                  setSelectedUserIds([]);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-black hover:brightness-110"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Admin Users Table */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-black uppercase tracking-wider ${
                darkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                {isSuperAdmin && (
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-transparent cursor-pointer"
                    />
                  </th>
                )}
                <th className="p-4">Admin Staff Member</th>
                <th className="p-4">Role & Scope</th>
                <th className="p-4">Phone / Contact</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 text-right">Security & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-semibold">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 font-bold">
                    No admin accounts found matching search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition-colors hover:bg-slate-800/20 ${
                      selectedUserIds.includes(user.id) ? (darkMode ? 'bg-emerald-500/5' : 'bg-emerald-50') : ''
                    }`}
                  >
                    {isSuperAdmin && (
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-transparent cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Profile Photo & Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-700/60 shadow-sm"
                        />
                        <div>
                          <div className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                            {user.name}
                            {user.role === 'Super Admin' && (
                              <Shield className="w-3.5 h-3.5 text-purple-400" title="Super Administrator" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-500" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Scope */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] truncate" title={ROLE_DESCRIPTIONS[user.role]}>
                        {ROLE_DESCRIPTIONS[user.role]}
                      </p>
                    </td>

                    {/* Phone */}
                    <td className="p-4 text-slate-300 font-mono">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {user.phone || 'N/A'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {getStatusBadge(user.status)}
                    </td>

                    {/* Last Login */}
                    <td className="p-4 text-slate-400">
                      <div className="font-mono text-[11px]">{user.lastLogin}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Created: {user.createdAt}</div>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Login History */}
                        <button
                          onClick={() => setLoginHistoryUser(user)}
                          title="View Login History Trail"
                          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>

                        {/* Activity Log */}
                        <button
                          onClick={() => setActivityLogUser(user)}
                          title="View Activity Audit Log"
                          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>

                        {isSuperAdmin && (
                          <>
                            {/* Reset Password */}
                            <button
                              onClick={() => handleTriggerResetPassword(user)}
                              title="Reset Password Credentials"
                              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 transition-all"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Admin */}
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              title="Edit User Info & Role"
                              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Admin */}
                            <button
                              onClick={() => setDeleteConfirmUser(user)}
                              title="Delete Admin Account"
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className={`p-4 border-t flex items-center justify-between text-xs font-bold ${
            darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <span>
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} staff members
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-xl border border-slate-800 disabled:opacity-30 hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-xl font-black ${
                    currentPage === idx + 1
                      ? 'bg-emerald-500 text-slate-950'
                      : 'border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-xl border border-slate-800 disabled:opacity-30 hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT USER */}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base">
                  {editingUser ? 'Edit Staff Account & Role' : 'Create New Admin Account'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhan Tanvir"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-3 rounded-2xl border outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="farhan@gadgetghor.bd"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-3 rounded-2xl border outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+880 1700-000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-3 rounded-2xl border outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assign Security Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className={`w-full p-3 rounded-2xl border outline-none font-bold ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                >
                  {ALL_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <p className="text-[10px] text-emerald-400 mt-1 font-normal">
                  {ROLE_DESCRIPTIONS[formData.role]}
                </p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminUserStatus })}
                  className={`w-full p-3 rounded-2xl border outline-none font-bold ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Disabled">Disabled</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className={`w-full p-3 rounded-2xl border outline-none text-xs ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2.5 rounded-2xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black hover:brightness-110"
                >
                  {editingUser ? 'Update Account' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base">Password Reset Issued</h3>
              </div>
              <button onClick={() => setResetPasswordUser(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Temporary password reset code generated for <span className="font-black text-amber-400">{resetPasswordUser.email}</span>.
            </p>

            {resetGeneratedCode && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">One-Time Security Token</span>
                <div className="text-xl font-mono font-black tracking-widest text-white select-all">
                  {resetGeneratedCode}
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              Provide this security key to the staff member to complete their authentication reset on next login.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setResetPasswordUser(null)}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOGIN HISTORY */}
      {loginHistoryUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base">Login Security History - {loginHistoryUser.name}</h3>
              </div>
              <button onClick={() => setLoginHistoryUser(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold pb-2">
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">IP Address</th>
                    <th className="p-2">Device & Browser</th>
                    <th className="p-2">Location</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {loginHistoryUser.loginHistory.map((lh) => (
                    <tr key={lh.id} className="hover:bg-slate-800/20">
                      <td className="p-2 font-mono text-slate-300">{lh.timestamp}</td>
                      <td className="p-2 font-mono text-emerald-400">{lh.ip}</td>
                      <td className="p-2 text-slate-300">{lh.device}</td>
                      <td className="p-2 text-slate-400">{lh.location}</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                          {lh.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setLoginHistoryUser(null)}
                className="px-4 py-2 rounded-2xl border border-slate-800 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ACTIVITY LOGS */}
      {activityLogUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-base">Activity Audit Trail - {activityLogUser.name}</h3>
              </div>
              <button onClick={() => setActivityLogUser(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto max-h-80 space-y-2">
              {activityLogUser.activityLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Category: {log.category}</span>
                    <span>IP: {log.ip}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActivityLogUser(null)}
                className="px-4 py-2 rounded-2xl border border-slate-800 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-sm p-6 rounded-3xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="font-extrabold text-base">Confirm Account Deletion</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently revoke and delete the admin account for{' '}
              <span className="font-bold text-white">{deleteConfirmUser.name}</span> ({deleteConfirmUser.email})?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-2xl border border-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteUser(deleteConfirmUser.id);
                  setDeleteConfirmUser(null);
                }}
                className="px-4 py-2 rounded-2xl bg-rose-500 text-white font-black text-xs hover:bg-rose-600"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
