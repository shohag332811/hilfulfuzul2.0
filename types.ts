
export interface Member {
  id: number;
  name: string;
  role: string;
  joma: number;
  phone: string;
  fatherName: string;
  address: string;
  occupation: string;
  joiningDate: string;
}

export interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  category: string;
}

export interface ProjectItem {
  id: number;
  name?: string;
  item?: string;
  amount: number;
}

export interface Project {
  id: string;
  name: string;
  gradient: string;
  incomeList: ProjectItem[];
  expenseList: ProjectItem[];
}

export interface DraftItem {
  id: number;
  name: string;
  amount: number;
}

export interface Draft {
  id: string;
  title: string;
  items: DraftItem[];
}
