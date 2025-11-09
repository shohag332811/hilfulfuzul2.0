import React, { useState, useMemo, useContext, createContext, useEffect, FC, ReactNode } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LayoutDashboard, Users, ArrowUpCircle, ArrowDownCircle, Briefcase, FileText, Menu, X, Search, DollarSign, ListChecks, Plus, Edit, Trash2, LogIn, LogOut, FileDown, Lock, AlertTriangle, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Member, Transaction, Project, Draft, ProjectItem } from './types';
import { initialMemberList, initialDonationData, initialExpenseData, initialProjectFullData, initialDraftData, PROJECT_GRADIENTS } from './constants';
import { useScript } from './hooks/useScript';
import { exportToPdf } from './services/pdfExporter';


// --- CONTEXTS (Auth & Data) ---

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  error: string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedAuth = localStorage.getItem('hilful_fuzul_admin');
    if (storedAuth === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string) => {
    if (password === 'shohag') {
      setIsAdmin(true);
      setError("");
      localStorage.setItem('hilful_fuzul_admin', 'true');
      return true;
    } else {
      setError("পাসওয়ার্ড সঠিক নয়।");
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setError("");
    localStorage.removeItem('hilful_fuzul_admin');
  };

  return <AuthContext.Provider value={{ isAdmin, login, logout, error }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface DataContextType {
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: number) => void;
  donations: Transaction[];
  addDonation: (donation: Omit<Transaction, 'id'>) => void;
  updateDonation: (donation: Transaction) => void;
  deleteDonation: (id: number) => void;
  expenses: Transaction[];
  addExpense: (expense: Omit<Transaction, 'id'>) => void;
  updateExpense: (expense: Transaction) => void;
  deleteExpense: (id: number) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'incomeList' | 'expenseList'>) => void;
  addProjectItem: (projectId: string, listType: 'incomeList' | 'expenseList', item: Omit<ProjectItem, 'id'>) => void;
  updateProjectItem: (projectId: string, listType: 'incomeList' | 'expenseList', item: ProjectItem) => void;
  deleteProjectItem: (projectId: string, listType: 'incomeList' | 'expenseList', itemId: number) => void;
  drafts: Draft[];
  mainStats: any;
  incomeSourceData: any[];
  expenseCategoryData: any[];
}
const DataContext = createContext<DataContextType | undefined>(undefined);

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    try {
      return JSON.parse(storedValue);
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
      return defaultValue;
    }
  }
  return defaultValue;
};

const saveToLocalStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
};

const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState(() => loadFromLocalStorage('hf_members', initialMemberList));
  const [donations, setDonations] = useState(() => loadFromLocalStorage('hf_donations', initialDonationData));
  const [expenses, setExpenses] = useState(() => loadFromLocalStorage('hf_expenses', initialExpenseData));
  const [projects, setProjects] = useState(() => loadFromLocalStorage('hf_projects', initialProjectFullData));
  const [drafts, setDrafts] = useState(() => loadFromLocalStorage('hf_drafts', initialDraftData));

  useEffect(() => { saveToLocalStorage('hf_members', members); }, [members]);
  useEffect(() => { saveToLocalStorage('hf_donations', donations); }, [donations]);
  useEffect(() => { saveToLocalStorage('hf_expenses', expenses); }, [expenses]);
  useEffect(() => { saveToLocalStorage('hf_projects', projects); }, [projects]);
  useEffect(() => { saveToLocalStorage('hf_drafts', drafts); }, [drafts]);

  const addMember = (member: Omit<Member, 'id'>) => setMembers(prev => [...prev, { ...member, id: Date.now(), joma: Number(member.joma) || 0 }]);
  const updateMember = (updatedMember: Member) => setMembers(prev => prev.map(m => m.id === updatedMember.id ? {...updatedMember, joma: Number(updatedMember.joma) || 0} : m));
  const deleteMember = (id: number) => setMembers(prev => prev.filter(m => m.id !== id));

  const addDonation = (donation: Omit<Transaction, 'id'>) => setDonations(prev => [...prev, { ...donation, id: Date.now(), amount: Number(donation.amount) || 0 }]);
  const updateDonation = (updatedDonation: Transaction) => setDonations(prev => prev.map(d => d.id === updatedDonation.id ? {...updatedDonation, amount: Number(updatedDonation.amount) || 0} : d));
  const deleteDonation = (id: number) => setDonations(prev => prev.filter(d => d.id !== id));

  const addExpense = (expense: Omit<Transaction, 'id'>) => setExpenses(prev => [...prev, { ...expense, id: Date.now(), amount: Number(expense.amount) || 0 }]);
  const updateExpense = (updatedExpense: Transaction) => setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? {...updatedExpense, amount: Number(updatedExpense.amount) || 0} : e));
  const deleteExpense = (id: number) => setExpenses(prev => prev.filter(e => e.id !== id));
  
  const addProject = (project: Omit<Project, 'id' | 'incomeList' | 'expenseList'>) => {
    const newProject = {
      ...project,
      id: `${project.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      incomeList: [],
      expenseList: [],
    };
    setProjects(prev => [...prev, newProject]);
  };
  const addProjectItem = (projectId: string, listType: 'incomeList' | 'expenseList', item: Omit<ProjectItem, 'id'>) => {
    const newItem = { ...item, id: Date.now(), amount: Number(item.amount) || 0 };
    setProjects(p => p.map(proj => proj.id === projectId ? { ...proj, [listType]: [...proj[listType], newItem] } : proj));
  };
  const updateProjectItem = (projectId: string, listType: 'incomeList' | 'expenseList', updatedItem: ProjectItem) => {
    setProjects(p => p.map(proj => proj.id === projectId ? { ...proj, [listType]: proj[listType].map(i => i.id === updatedItem.id ? {...updatedItem, amount: Number(updatedItem.amount) || 0} : i) } : proj));
  };
  const deleteProjectItem = (projectId: string, listType: 'incomeList' | 'expenseList', itemId: number) => {
    setProjects(p => p.map(proj => proj.id === projectId ? { ...proj, [listType]: proj[listType].filter(i => i.id !== itemId) } : proj));
  };

  const mainStats = useMemo(() => {
    const totalJoma = members.reduce((acc, curr) => acc + (Number(curr.joma) || 0), 0);
    const totalOnudan = donations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalIncome = totalJoma + totalOnudan;
    const currentBalance = totalIncome - totalExpense;
    return { totalJoma, totalOnudan, totalExpense, totalIncome, currentBalance };
  }, [members, donations, expenses]);

  const incomeSourceData = useMemo(() => {
    const totalJoma = mainStats.totalJoma;
    const projectIncome = donations.filter(d => d.category?.startsWith('প্রকল্প:')).reduce((acc, curr) => { const cat = curr.category.split(':')[1]?.trim() || 'অন্যান্য'; acc[cat] = (acc[cat] || 0) + (Number(curr.amount) || 0); return acc; }, {} as Record<string, number>);
    const otherDonations = donations.filter(d => !d.category?.startsWith('প্রকল্প:')).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    let data = [{ name: 'সদস্যদের চাঁদা', value: totalJoma, fill: '#3b82f6' }, { name: 'অন্যান্য অনুদান', value: otherDonations, fill: '#a855f7' }];
    Object.keys(projectIncome).forEach((key, index) => {
      const colors = ['#10b981', '#f97316', '#ef4444'];
      data.push({ name: `প্রকল্প: ${key}`, value: projectIncome[key], fill: colors[index % colors.length] });
    });
    return data.filter(d => d.value > 0);
  }, [mainStats.totalJoma, donations]);

  const expenseCategoryData = useMemo(() => {
    const categories = expenses.reduce((acc, curr) => { const cat = curr.category || 'অন্যান্য'; acc[cat] = (acc[cat] || 0) + (Number(curr.amount) || 0); return acc; }, {} as Record<string, number>);
    const colors: Record<string, string> = { 'প্রকল্প: খেলাধুলা': '#3b82f6', 'প্রকল্প: ধর্মীয়/ইফতার': '#10b981', 'প্রশাসনিক': '#f97316', 'প্রকল্প: ত্রাণ': '#a855f7', 'সামাজিক কাজ': '#ef4444', 'অন্যান্য': '#64748b' };
    return Object.keys(categories).map(key => ({ name: key, value: categories[key], fill: colors[key] || colors['অন্যান্য'] })).filter(d => d.value > 0);
  }, [expenses]);

  return (
    <DataContext.Provider value={{ members, addMember, updateMember, deleteMember, donations, addDonation, updateDonation, deleteDonation, expenses, addExpense, updateExpense, deleteExpense, projects, addProject, addProjectItem, updateProjectItem, deleteProjectItem, drafts, mainStats, incomeSourceData, expenseCategoryData }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

// --- REUSABLE COMPONENTS ---

const StatCard: FC<{ title: string; value: string; icon: ReactNode; colorClass: string; smallText?: string }> = ({ title, value, icon, colorClass, smallText }) => (
  <motion.div className="bg-white p-5 rounded-2xl shadow-lg flex items-center space-x-4 border-l-4" style={{ borderColor: colorClass }} whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
    <div className="p-3 rounded-full" style={{ backgroundColor: `${colorClass}1A`, color: colorClass }}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {smallText && <p className="text-xs text-slate-400">{smallText}</p>}
    </div>
  </motion.div>
);

const CustomTooltip: FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200">
        <p className="font-semibold">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill }}>{`পরিমাণ: ${payload[0].value.toLocaleString('bn-BD')} ৳ (${(payload[0].percent * 100).toFixed(0)}%)`}</p>
      </div>
    );
  }
  return null;
};

const ChartContainer: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <motion.div className="bg-white p-6 rounded-2xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <h3 className="text-xl font-semibold text-slate-700 mb-6">{title}</h3>
    <div style={{ width: '100%', height: 350 }}>{children}</div>
  </motion.div>
);

const Modal: FC<{ children: ReactNode; closeModal: () => void }> = ({ children, closeModal }) => (
  <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
    <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} onClick={(e) => e.stopPropagation()}>
      <div className="relative p-8">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"><X size={24} /></button>
        {children}
      </div>
    </motion.div>
  </motion.div>
);

const LoginModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      closeModal();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <motion.div className="w-full" animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={shake ? { duration: 0.3 } : {}}>
        <div className="flex flex-col items-center">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full"><Lock size={32} /></div>
          <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-2">অ্যাডমিন লগইন</h2>
          <p className="text-slate-500 text-center mb-6">পরিবর্তন করার জন্য অনুগ্রহ করে লগইন করুন।</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block" htmlFor="password">পাসওয়ার্ড</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full p-3 border rounded-lg ${error ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
          </div>
          {error && <motion.p className="text-sm text-red-600 flex items-center space-x-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><AlertTriangle size={16} /><span>{error}</span></motion.p>}
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-indigo-300"><LogIn size={20} /><span>লগইন করুন</span></button>
        </form>
      </motion.div>
    </Modal>
  );
};

// --- FORMS ---

const MemberForm: FC<{ itemToEdit?: Member | null; closeModal: () => void, isPage?: boolean, isAdmin: boolean }> = ({ itemToEdit, closeModal, isPage = false, isAdmin }) => {
  const { addMember, updateMember } = useData();
  const [formData, setFormData] = useState<Omit<Member, 'id'>>(
    itemToEdit || { name: '', role: '', phone: '', joma: 0, fatherName: '', address: '', occupation: '', joiningDate: new Date().toLocaleDateString('bn-BD')}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (itemToEdit) {
      updateMember({ ...formData, id: itemToEdit.id });
    } else {
      addMember(formData);
    }
    closeModal();
  };
  
  const formFields = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">নাম</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" required disabled={!isAdmin} />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">পিতার নাম</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" disabled={!isAdmin} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-600 mb-1 block">ঠিকানা</label>
        <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" disabled={!isAdmin}></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">মোবাইল নং</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" disabled={!isAdmin} />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">পেশা</label>
          <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" disabled={!isAdmin} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">পদবী</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" disabled={!isAdmin} />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">জমা (৳)</label>
          <input type="number" step="0.01" name="joma" value={formData.joma} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" required disabled={!isAdmin} />
        </div>
        <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">যোগদানের তারিখ</label>
            <input type="text" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100" disabled={!isAdmin} />
        </div>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-800">{itemToEdit ? 'সদস্য এডিট করুন' : 'নতুন সদস্য যোগ করুন'}</h2>
      {formFields}
      <div className={`flex ${isPage ? 'justify-start' : 'justify-end'} space-x-3 pt-4`}>
        {!isPage && <button type="button" onClick={closeModal} className="py-2 px-5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors">বাতিল</button>}
        <button type="submit" disabled={!isAdmin} className="py-2 px-5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed">
          {isAdmin ? (itemToEdit ? 'আপডেট করুন' : 'সংরক্ষণ করুন') : 'সংরক্ষণ করতে লগইন করুন'}
        </button>
      </div>
    </form>
  );
};


const TransactionForm: FC<{ type: 'donation' | 'expense'; itemToEdit?: Transaction | null; closeModal: () => void }> = ({ type, itemToEdit, closeModal }) => {
  const { addDonation, updateDonation, addExpense, updateExpense } = useData();
  const [formData, setFormData] = useState(itemToEdit || { date: new Date().toLocaleDateString('bn-BD'), desc: '', amount: '', category: '' });
  const isDonation = type === 'donation';
  const categories = isDonation ? ['প্রকল্প: খেলাধুলা', 'প্রকল্প: ইফতার/ত্রাণ', 'অন্যান্য অনুদান'] : ['প্রশাসনিক', 'প্রকল্প: ধর্মীয়/ইফতার', 'প্রকল্প: খেলাধুলা', 'প্রকল্প: ত্রাণ', 'সামাজিক কাজ', 'অন্যান্য'];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, amount: Number(formData.amount) || 0 };
    if (isDonation) {
      itemToEdit ? updateDonation({ ...dataToSubmit, id: itemToEdit.id }) : addDonation(dataToSubmit);
    } else {
      itemToEdit ? updateExpense({ ...dataToSubmit, id: itemToEdit.id }) : addExpense(dataToSubmit);
    }
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{itemToEdit ? (isDonation ? 'অনুদান এডিট' : 'ব্যয় এডিট') : (isDonation ? 'নতুন অনুদান' : 'নতুন ব্যয়')}</h2>
      <div><label className="text-sm font-medium text-slate-600 mb-1 block">তারিখ</label><input type="text" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required /></div>
      <div><label className="text-sm font-medium text-slate-600 mb-1 block">বিবরণ</label><input type="text" name="desc" value={formData.desc} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required /></div>
      <div>
        <label className="text-sm font-medium text-slate-600 mb-1 block">ক্যাটাগরি</label>
        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg bg-white" required>
          <option value="">ক্যাটাগরি নির্বাচন করুন</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div><label className="text-sm font-medium text-slate-600 mb-1 block">পরিমাণ (৳)</label><input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required /></div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={closeModal} className="py-2 px-5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300">বাতিল</button>
        <button type="submit" className="py-2 px-5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">{itemToEdit ? 'আপডেট' : 'যোগ'}</button>
      </div>
    </form>
  );
};

const ProjectForm: FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const { addProject } = useData();
    const [name, setName] = useState('');
    const [gradient, setGradient] = useState(PROJECT_GRADIENTS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            addProject({ name, gradient });
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">নতুন প্রকল্প যোগ করুন</h2>
            <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">প্রকল্পের নাম</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg" required />
            </div>
            <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">রং নির্বাচন করুন</label>
                <div className="grid grid-cols-3 gap-2">
                    {PROJECT_GRADIENTS.map(g => (
                        <div key={g} onClick={() => setGradient(g)} className={`h-12 rounded-lg cursor-pointer bg-gradient-to-r ${g} ${gradient === g ? 'ring-4 ring-indigo-500 ring-offset-2' : ''}`}></div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="py-2 px-5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300">বাতিল</button>
                <button type="submit" className="py-2 px-5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">তৈরি করুন</button>
            </div>
        </form>
    );
};


// --- PAGE COMPONENTS (defined outside main App component) ---

const DashboardPage = () => {
  const { mainStats, incomeSourceData, expenseCategoryData, members } = useData();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">ড্যাশবোর্ড</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="বর্তমান ব্যালেন্স" value={`${mainStats.currentBalance.toLocaleString('bn-BD')} ৳`} icon={<DollarSign size={24} />} colorClass={mainStats.currentBalance >= 0 ? "#0ea5e9" : "#ef4444"} />
        <StatCard title="সর্বমোট আয়" value={`${mainStats.totalIncome.toLocaleString('bn-BD')} ৳`} icon={<ArrowUpCircle size={24} />} colorClass="#22c55e" smallText={`সদস্য: ${mainStats.totalJoma.toLocaleString('bn-BD')} + অনুদান: ${mainStats.totalOnudan.toLocaleString('bn-BD')}`} />
        <StatCard title="সর্বমোট ব্যয়" value={`${mainStats.totalExpense.toLocaleString('bn-BD')} ৳`} icon={<ArrowDownCircle size={24} />} colorClass="#ef4444" />
        <StatCard title="মোট সদস্য" value={`${members.length.toLocaleString('bn-BD')} জন`} icon={<Users size={24} />} colorClass="#f59e0b" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer title="আয়ের উৎসসমূহ">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={incomeSourceData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="value" nameKey="name" paddingAngle={5}>{incomeSourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Pie>
              <Tooltip content={<CustomTooltip />} /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ChartContainer title="ব্যয়ের খাতসমূহ">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={expenseCategoryData} cx="50%" cy="50%" outerRadius={120} dataKey="value" nameKey="name" paddingAngle={5}>{expenseCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Pie>
              <Tooltip content={<CustomTooltip />} /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </motion.div>
  );
};

const AdmissionPage = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { isAdmin } = useAuth();
    const closeModal = () => {
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000); // Reset after 3 seconds
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center space-x-4">
                <UserPlus size={32} className="text-indigo-600"/>
                <h2 className="text-3xl font-bold text-slate-800">নতুন সদস্য ভর্তি ফরম</h2>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                 {!isAdmin && (
                    <div className="text-center p-4 mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg" role="alert">
                        <p>নতুন সদস্য যোগ করার জন্য আপনাকে অবশ্যই <span className="font-bold">অ্যাডমিন</span> হিসেবে লগইন করতে হবে।</p>
                    </div>
                )}
                {formSubmitted ? (
                    <div className="text-center py-10">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <ListChecks size={32}/>
                        </motion.div>
                        <h3 className="text-2xl font-bold text-slate-800 mt-4">সদস্য সফলভাবে যোগ করা হয়েছে!</h3>
                        <p className="text-slate-500 mt-2">আপনি এখন সদস্য তালিকায় নতুন সদস্যকে দেখতে পারেন।</p>
                    </div>
                ) : (
                    <MemberForm closeModal={closeModal} isPage={true} isAdmin={isAdmin} />
                )}
            </div>
        </motion.div>
    );
};

const SearchableTablePage: FC<{ title: string; data: any[]; columns: any[]; searchKeys: string[]; totalAmount?: number; type: 'member' | 'donation' | 'expense'; }> = ({ title, data, columns, searchKeys, totalAmount, type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const { isAdmin } = useAuth();
  const { deleteMember, deleteDonation, deleteExpense } = useData();
  
  const pdfLibStatus = useScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  const autoTableStatus = useScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.js');
  const fontStatus = useScript('https://cdn.jsdelivr.net/gh/s-shubham-k/jsPDF-CustomFonts-VFS/NotoSansBengali.js');
  const pdfReady = pdfLibStatus === 'ready' && autoTableStatus === 'ready' && fontStatus === 'ready';

  const filteredData = useMemo(() => data.filter(item => searchKeys.some(key => item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))), [searchTerm, data, searchKeys]);

  const handleAddNew = () => { setItemToEdit(null); setIsModalOpen(true); };
  const handleEdit = (item: any) => { setItemToEdit(item); setIsModalOpen(true); };
  const handleDelete = (id: number) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই আইটেমটি মুছে ফেলতে চান?")) {
      if (type === 'member') deleteMember(id);
      else if (type === 'donation') deleteDonation(id);
      else if (type === 'expense') deleteExpense(id);
    }
  };

  const renderForm = () => {
    if (!isModalOpen) return null;
    const props = { itemToEdit, closeModal: () => setIsModalOpen(false) };
    if (type === 'member') return <MemberForm {...props} isAdmin={isAdmin} />;
    return <TransactionForm type={type} {...props} />;
  };
  
  const allColumns = [...columns];
  if (isAdmin) {
    allColumns.push({
      key: 'actions', header: 'ক্রিয়া', align: 'right',
      render: (row: any) => (
        <div className="flex justify-end space-x-2">
          <button onClick={() => handleEdit(row)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"><Edit size={16} /></button>
          <button onClick={() => handleDelete(row.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
        </div>
      )
    });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AnimatePresence>{isModalOpen && <Modal closeModal={() => setIsModalOpen(false)}>{renderForm()}</Modal>}</AnimatePresence>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={() => exportToPdf(columns, filteredData, title)} disabled={!pdfReady} className={`flex-1 md:flex-none flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 ${!pdfReady ? 'opacity-50 cursor-not-allowed' : ''}`}><FileDown size={18} /><span>{pdfReady ? 'PDF ডাউনলোড' : 'লোড হচ্ছে...'}</span></button>
          {isAdmin && <button onClick={handleAddNew} className="flex-1 md:flex-none flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"><Plus size={18} /><span>নতুন যোগ</span></button>}
        </div>
      </div>
      <div className="relative"><input type="text" placeholder="এখানে সার্চ করুন..." className="w-full p-4 pl-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /></div>
      <div className="bg-white rounded-2xl shadow-lg"><div className="overflow-x-auto p-2">
        <table className="w-full min-w-max">
          <thead><tr className="border-b-2 border-slate-200">{allColumns.map((col) => <th key={col.key} className={`p-4 text-left text-sm font-semibold text-slate-500 ${col.align === 'right' ? 'text-right' : ''}`}>{col.header}</th>)}</tr></thead>
          <tbody>
            <AnimatePresence>
              {filteredData.map((row) => (
                <motion.tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {allColumns.map((col) => (
                    <td key={col.key} className={`p-4 text-slate-700 ${col.align === 'right' ? 'text-right' : ''} ${col.className ? col.className(row) : ''}`}>
                      {col.render ? col.render(row) : ((col.key === 'joma' || col.key === 'amount') ? `${(Number(row[col.key]) || 0).toLocaleString('bn-BD')} ৳` : (row[col.key] || 'N/A'))}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
          {totalAmount !== undefined && (
            <tfoot className="border-t-2 border-slate-300"><tr className="font-bold bg-slate-50">
              <td colSpan={columns.length} className="p-4 text-right text-slate-800">মোট:</td>
              <td className={`p-4 text-right text-lg ${Number(totalAmount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Number(totalAmount).toLocaleString('bn-BD')} ৳</td>
              {isAdmin && <td className="p-4"></td>}
            </tr></tfoot>
          )}
        </table>
        {filteredData.length === 0 && <p className="text-center p-8 text-slate-500">কোনো তথ্য পাওয়া যায় নি।</p>}
      </div></div>
    </motion.div>
  );
};

const ProjectSummaryCard: FC<{ project: any, onClick: () => void }> = ({ project, onClick }) => (
    <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} layoutId={`project-card-${project.id}`}>
      <div className={`p-6 text-white bg-gradient-to-r ${project.gradient}`}><h3 className="text-2xl font-bold truncate">{project.name}</h3></div>
      <div className="p-6 space-y-3 flex-1">
        <div className="flex justify-between text-lg"><span className="text-slate-500">মোট আয়:</span><span className="font-semibold text-green-600">+{project.totalIncome.toLocaleString('bn-BD')} ৳</span></div>
        <div className="flex justify-between text-lg"><span className="text-slate-500">মোট ব্যয়:</span><span className="font-semibold text-red-600">-{project.totalExpense.toLocaleString('bn-BD')} ৳</span></div>
        <div className="flex justify-between text-xl pt-3 border-t mt-3"><span className="font-bold text-slate-700">অবশিষ্ট:</span><span className={`font-bold ${project.totalProfit >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>{project.totalProfit.toLocaleString('bn-BD')} ৳</span></div>
      </div>
      <div className="p-6 bg-slate-50"><button onClick={onClick} className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700"><ListChecks size={20} /><span>সম্পূর্ণ হিসাব দেখুন</span></button></div>
    </motion.div>
);

const ProjectsPage: FC = () => {
    const { projects } = useData();
    const { isAdmin } = useAuth();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isProjectModalOpen, setProjectModalOpen] = useState(false);

    const calculatedProjects = projects.map(p => {
      const totalIncome = p.incomeList.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
      const totalExpense = p.expenseList.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
      return { ...p, totalIncome, totalExpense, totalProfit: totalIncome - totalExpense };
    });

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-slate-800">প্রকল্প হিসাব</h2>
          {isAdmin && <button onClick={() => setProjectModalOpen(true)} className="flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 w-full md:w-auto"><Plus size={18} /><span>নতুন প্রকল্প যোগ</span></button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {calculatedProjects.map((p) => <ProjectSummaryCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />)}
        </div>
        <AnimatePresence>
            {isProjectModalOpen && <Modal closeModal={() => setProjectModalOpen(false)}><ProjectForm closeModal={() => setProjectModalOpen(false)} /></Modal>}
            {selectedProject && <ProjectModal project={projects.find(p => p.id === selectedProject.id)!} closeModal={() => setSelectedProject(null)} />}
        </AnimatePresence>
      </motion.div>
    );
};
  
const DraftsPage: FC = () => {
    const { drafts } = useData();
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <h2 className="text-3xl font-bold text-slate-800">খসড়া হিসাব</h2>
        <p className="text-slate-600">পিডিএফ থেকে পাওয়া অন্যান্য খসড়া হিসাবসমূহ। (এই পাতাটি শুধু দেখার জন্য)</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {drafts.map((draft) => (
            <div key={draft.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">{draft.title}</h3>
                <div className="overflow-y-auto max-h-64 pr-2">
                <table className="w-full">
                    <tbody>{draft.items.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="p-2 text-slate-600">{item.name}</td><td className="p-2 text-right font-medium text-slate-700">{item.amount.toLocaleString('bn-BD')} ৳</td></tr>)}</tbody>
                </table>
                </div>
                <div className="border-t-2 border-slate-200 mt-4 pt-4 flex justify-between text-lg font-bold"><span>মোট:</span><span>{draft.items.reduce((acc, i) => acc + i.amount, 0).toLocaleString('bn-BD')} ৳</span></div>
            </div>
            ))}
        </div>
        </motion.div>
    );
};

const ProjectModal: FC<{ project: Project; closeModal: () => void }> = ({ project, closeModal }) => {
  const { isAdmin } = useAuth();
  const { deleteProjectItem } = useData();
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ listType: 'incomeList' | 'expenseList'; itemToEdit: ProjectItem | null }>({ listType: 'incomeList', itemToEdit: null });

  const totalIncome = project.incomeList.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const totalExpense = project.expenseList.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const totalProfit = totalIncome - totalExpense;

  const handleOpenForm = (listType: 'incomeList' | 'expenseList', itemToEdit: ProjectItem | null = null) => {
    setModalConfig({ listType, itemToEdit });
    setFormModalOpen(true);
  };
  const handleDelete = (listType: 'incomeList' | 'expenseList', itemId: number) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই আইটেমটি মুছে ফেলতে চান?")) {
      deleteProjectItem(project.id, listType, itemId);
    }
  };
  
  const ProjectItemForm: FC<{ closeModal: () => void }> = ({ closeModal }) => {
      const { addProjectItem, updateProjectItem } = useData();
      const [formData, setFormData] = useState(modalConfig.itemToEdit ? { ...modalConfig.itemToEdit, name: modalConfig.itemToEdit.name || modalConfig.itemToEdit.item } : { name: '', amount: '' });
      const isIncome = modalConfig.listType === 'incomeList';
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

      const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          const itemData = { id: modalConfig.itemToEdit?.id, [isIncome ? 'name' : 'item']: formData.name, amount: Number(formData.amount) };
          modalConfig.itemToEdit ? updateProjectItem(project.id, modalConfig.listType, itemData as ProjectItem) : addProjectItem(project.id, modalConfig.listType, itemData);
          closeModal();
      };
      
      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">{modalConfig.itemToEdit ? 'আইটেম এডিট' : (isIncome ? 'নতুন আয় যোগ' : 'নতুন ব্যয় যোগ')}</h2>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">{isIncome ? 'নাম/বিবরণ' : 'খরচের বিবরণ'}</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">পরিমাণ (৳)</label>
            <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="py-2 px-5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300">বাতিল</button>
            <button type="submit" className="py-2 px-5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">{modalConfig.itemToEdit ? 'আপডেট' : 'যোগ'}</button>
          </div>
        </form>
      );
  };

  const renderList = (title: string, list: ProjectItem[], listType: 'incomeList' | 'expenseList', colorClass: string) => (
    <div>
      <div className="flex justify-between items-center mb-4 pb-2 border-b-2" style={{ borderColor: colorClass }}>
        <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
        {isAdmin && <button onClick={() => handleOpenForm(listType)} className="p-1.5 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"><Plus size={16} /></button>}
      </div>
      <div className="space-y-2 pr-2 overflow-y-auto" style={{maxHeight: '400px'}}>
        {list.map((item) => (
          <motion.div key={item.id} className="flex justify-between items-center text-sm p-2 rounded hover:bg-slate-50">
            <span className="text-slate-600 break-all pr-2">{item.name || item.item}</span>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className={`font-medium ${listType === 'incomeList' ? 'text-green-700' : 'text-red-700'}`}>{listType === 'incomeList' ? '+' : '-'}{item.amount.toLocaleString('bn-BD')} ৳</span>
              {isAdmin && <>
                <button onClick={() => handleOpenForm(listType, item)} className="p-1 text-indigo-600 hover:bg-indigo-100 rounded-full"><Edit size={14} /></button>
                <button onClick={() => handleDelete(listType, item.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={14} /></button>
              </>}
            </div>
          </motion.div>
        ))}
        {list.length === 0 && <p className="p-2 text-slate-400 text-sm">কোনো আইটেম নেই।</p>}
      </div>
    </div>
  );

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
      <AnimatePresence>{isFormModalOpen && <Modal closeModal={() => setFormModalOpen(false)}><ProjectItemForm closeModal={() => setFormModalOpen(false)} /></Modal>}</AnimatePresence>
      <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" layoutId={`project-card-${project.id}`} onClick={(e) => e.stopPropagation()}>
        <div className={`p-6 text-white bg-gradient-to-r ${project.gradient} flex justify-between items-center`}>
          <h2 className="text-3xl font-bold">{project.name}</h2>
          <motion.button onClick={closeModal} className="p-2 rounded-full hover:bg-black/20"><X size={24} /></motion.button>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4 bg-slate-50 border-b">
          <div className="text-center"><div className="text-sm text-slate-500">মোট আয়</div><div className="text-2xl font-bold text-green-600">+{totalIncome.toLocaleString('bn-BD')} ৳</div></div>
          <div className="text-center"><div className="text-sm text-slate-500">মোট ব্যয়</div><div className="text-2xl font-bold text-red-600">-{totalExpense.toLocaleString('bn-BD')} ৳</div></div>
          <div className="text-center"><div className="text-sm text-slate-500">অবশিষ্ট</div><div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>{totalProfit.toLocaleString('bn-BD')} ৳</div></div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {renderList('আয়ের তালিকা (চাঁদা)', project.incomeList, 'incomeList', '#22c55e')}
          {renderList('খরচের তালিকা', project.expenseList, 'expenseList', '#ef4444')}
        </div>
      </motion.div>
    </motion.div>
  );
};


// --- Main App Component ---
function AppInternal() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const NavItem: FC<{ icon: any; label: string; page: string }> = ({ icon: Icon, label, page }) => (
    <button onClick={() => { setCurrentPage(page); setSidebarOpen(false); }} className={`flex items-center w-full px-6 py-4 text-left rounded-lg transition-all ${currentPage === page ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md' : 'text-indigo-100 hover:bg-indigo-700/50'}`}><Icon size={20} className="mr-4" /><span>{label}</span></button>
  );

  const renderPage = () => {
    const { members, mainStats, donations, expenses } = useData();
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'admission': return <AdmissionPage />;
      case 'members': return <SearchableTablePage title="সদস্য তালিকা" data={members} columns={[{ key: 'name', header: 'নাম' }, { key: 'role', header: 'পদবী' }, { key: 'phone', header: 'মোবাইল' }, { key: 'joma', header: 'জমা (৳)', align: 'right', className: () => 'font-medium' }]} searchKeys={['name', 'role', 'phone']} totalAmount={mainStats.totalJoma} type="member" />;
      case 'donations': return <SearchableTablePage title="অনুদান লগ" data={donations} columns={[{ key: 'date', header: 'তারিখ' }, { key: 'desc', header: 'বিবরণ' }, { key: 'category', header: 'ক্যাটাগরি' }, { key: 'amount', header: 'পরিমাণ (৳)', align: 'right', className: () => 'font-semibold text-green-600' }]} searchKeys={['date', 'desc', 'category']} totalAmount={mainStats.totalOnudan} type="donation" />;
      case 'expenses': return <SearchableTablePage title="ব্যয় লগ" data={expenses} columns={[{ key: 'date', header: 'তারিখ' }, { key: 'desc', header: 'বিবরণ' }, { key: 'category', header: 'ক্যাটাগরি' }, { key: 'amount', header: 'পরিমাণ (৳)', align: 'right', className: () => 'font-semibold text-red-600' }]} searchKeys={['date', 'desc', 'category']} totalAmount={mainStats.totalExpense} type="expense" />;
      case 'projects': return <ProjectsPage />;
      case 'drafts': return <DraftsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <AnimatePresence>{sidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{isLoginModalOpen && <LoginModal closeModal={() => setLoginModalOpen(false)} />}</AnimatePresence>
      
      <motion.div className="fixed inset-y-0 left-0 z-30 w-72 bg-indigo-900 text-white shadow-lg lg:relative lg:translate-x-0 flex flex-col" animate={{ x: isDesktop ? '0%' : (sidebarOpen ? '0%' : '-100%') }} transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}>
        <div className="flex items-center justify-between p-6 mb-4"><h1 className="text-2xl font-bold text-center text-yellow-300">হিলফুল ফুযুল</h1><button onClick={() => setSidebarOpen(false)} className="lg:hidden text-indigo-200 hover:text-white"><X size={24} /></button></div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem icon={LayoutDashboard} label="ড্যাশবোর্ড" page="dashboard" />
            <NavItem icon={UserPlus} label="সদস্য ভর্তি" page="admission" />
            <NavItem icon={Users} label="সদস্য তালিকা" page="members" />
            <NavItem icon={ArrowUpCircle} label="অনুদান লগ" page="donations" />
            <NavItem icon={ArrowDownCircle} label="ব্যয় লগ" page="expenses" />
            <NavItem icon={Briefcase} label="প্রকল্প হিসাব" page="projects" />
            <NavItem icon={FileText} label="খসড়া হিসাব" page="drafts" />
        </nav>
        <div className="p-6 border-t border-indigo-700">
            {isAdmin ? (
                <button onClick={logout} className="flex items-center w-full px-4 py-3 text-left rounded-lg text-indigo-100 hover:bg-red-700/50 transition-all"><LogOut size={20} className="mr-3" /><span>লগআউট</span></button>
            ) : (
                <button onClick={() => setLoginModalOpen(true)} className="flex items-center w-full px-4 py-3 text-left rounded-lg text-indigo-100 hover:bg-indigo-700/50 transition-all"><LogIn size={20} className="mr-3" /><span>অ্যাডমিন লগইন</span></button>
            )}
        </div>
      </motion.div>

      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-10"><h1 className="text-xl font-bold text-indigo-800">হিলফুল ফুযুল</h1><button onClick={() => setSidebarOpen(true)} className="text-slate-700"><Menu size={24} /></button></div>
        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait"><motion.div key={currentPage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>{renderPage()}</motion.div></AnimatePresence>
        </div>
      </main>
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppInternal />
      </DataProvider>
    </AuthProvider>
  );
}
