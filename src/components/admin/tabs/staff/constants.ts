import { StaffMember } from './types';

export const STAFF_DATA: StaffMember[] = [
  {
    id: '1', staffId: 'STF-001', name: 'Marcus Chen', role: 'BARISTA',
    shiftSchedule: 'Morning (06:00 - 14:00)', shiftDays: 'Mon, Tue, Wed, Fri',
    email: 'marcus.c@brewadmin.com', phone: '+1 (555) 012-3456', status: 'ACTIVE',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjp23fIeh3_yZ_FS6eN7Ac60LuthtozJdSQPNiPUiPXjsEIP1IVSR23y60pW0sVrei2DWAFrZIjgcReeJz76zyRZvHzXBeIvZxipyU8U491HfdMugBPPtXVPPntMTTMQehu9YrV-bM-MgYeaQv_o1aaQgDs37zIH46IWNFwGY_TnPLE3U5kLPNtqzvr2PGpzMYEVEQW2zrhpo-EIZLy_KJdrZNzI8fXqYfoVjbelHzGKHiSkdBu0rYcWeotyc9f47LXAIxDxE9shk',
    initials: 'MC', avatarColor: 'ring-primary/20',
  },
  {
    id: '2', staffId: 'STF-004', name: 'Elena Rodriguez', role: 'CASHIER',
    shiftSchedule: 'Afternoon (14:00 - 22:00)', shiftDays: 'Tue, Wed, Thu, Sat',
    email: 'elena.r@brewadmin.com', phone: '+1 (555) 012-7890', status: 'ACTIVE',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu6G1p1N62jHrQlFpp4G2tuBqnV6_yXLK1N-eGTIndonm7-75JKVqdyZ1fUnFaT5ZgGAx6x0ErThyFjBxaleb1dYlJhAvOlzB_Marf_uiWpDLTRX79W3e4rjRDQKxrJA8W9buGZ7cNdJpU8HbJY8M21--rtlk2WWVDg9cYaCHwNOaAB3wfqOxLc8MlidtZa7RSUpeKBDoYzZFUi_ahurlzeW_N6Pdl3bJVl7GooEsLWSReTSJ4vaSePxNToMyZk6TeCkoH61lWrHM',
    initials: 'ER', avatarColor: 'ring-primary/20',
  },
  {
    id: '3', staffId: 'STF-009', name: 'David Wilson', role: 'BARISTA',
    shiftSchedule: 'N/A', shiftDays: 'Sick Leave',
    email: 'd.wilson@brewadmin.com', phone: '+1 (555) 012-1122', status: 'ON_LEAVE',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuRj2iyEeaixG66z-EpIcw-Po5KPyk48x6hLns4cj5u8P-H8Vd4rG3EuGUgJG2CCxIRK8jL-oQWV7ifS0TLjranXbPlMmmve2y8Nm3Odcd17CRg4mRPhUeii_mU7YZmjO28H8beqhvAGgdxw7V0AVENlWTfbvuEyG0Pa4K5tpW_k0LaIae7zJ_F1R8DxEJaDM1Vg20LiHFNsSHsRMQEr54LVWEmWAxSA_HhjHeKCiWjcjV6HCpSihqVWAV6Bnkl3iYJ98ZhKrRm-c',
    initials: 'DW', avatarColor: 'ring-primary/20',
  },
  {
    id: '4', staffId: 'STF-002', name: 'Sarah Miller', role: 'ADMIN',
    shiftSchedule: 'Full Time (09:00 - 17:00)', shiftDays: 'Mon - Fri',
    email: 's.miller@brewadmin.com', phone: '+1 (555) 012-4455', status: 'ACTIVE',
    initials: 'SM', avatarColor: 'bg-coffee-accent',
  },
  {
    id: '5', staffId: 'STF-005', name: 'James Lee', role: 'CASHIER',
    shiftSchedule: 'Morning (07:00 - 15:00)', shiftDays: '',
    email: 'j.lee@brewadmin.com', status: 'ACTIVE',
    initials: 'JL', avatarColor: 'bg-primary',
  },
  {
    id: '6', staffId: 'STF-008', name: 'Aria Khan', role: 'BARISTA',
    shiftSchedule: 'Weekend (08:00 - 16:00)', shiftDays: '',
    email: 'a.khan@brewadmin.com', status: 'ACTIVE',
    initials: 'AK', avatarColor: 'bg-slate-400',
  },
  {
    id: '7', staffId: 'STF-010', name: 'Tom Holland', role: 'CASHIER',
    shiftSchedule: 'Evening (16:00 - 23:00)', shiftDays: '',
    email: 't.holland@brewadmin.com', status: 'ACTIVE',
    initials: 'TH', avatarColor: 'bg-coffee-accent/40',
  },
  {
    id: '8', staffId: 'STF-011', name: 'Linda Wu', role: 'BARISTA',
    shiftSchedule: 'Morning (06:00 - 14:00)', shiftDays: '',
    email: 'linda.w@brewadmin.com', status: 'ACTIVE',
    initials: 'LW', avatarColor: 'bg-primary/40',
  },
  {
    id: '9', staffId: 'STF-012', name: 'Robert Brown', role: 'ADMIN',
    shiftSchedule: 'Full Time', shiftDays: '',
    email: 'r.brown@brewadmin.com', status: 'ACTIVE',
    initials: 'RB', avatarColor: 'bg-slate-600',
  },
  {
    id: '10', staffId: 'STF-013', name: 'Maya Singh', role: 'CASHIER',
    shiftSchedule: 'Night Shift', shiftDays: '',
    email: 'm.singh@brewadmin.com', status: 'ACTIVE',
    initials: 'MS', avatarColor: 'bg-amber-700',
  },
];
