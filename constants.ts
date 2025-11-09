
import { Member, Transaction, Project, Draft } from './types';

const defaultMemberInfo = {
  fatherName: "",
  address: "",
  occupation: "",
  joiningDate: "N/A",
};

export const initialMemberList: Member[] = [
  {id: 1, name: "শামীম", role: "সভাপতি", joma: 180.00, phone: "01754762235", ...defaultMemberInfo},
  {id: 2, name: "বাছেদ", role: "সহ সভাপতি", joma: 150.00, phone: "01785571738", ...defaultMemberInfo},
  {id: 3, name: "রাসেল", role: "সাধারণ সম্পাদক", joma: 200.00, phone: "01775977478", ...defaultMemberInfo},
  {id: 4, name: "আশিক", role: "সহ সাধারণ সম্পাদক", joma: 240.00, phone: "01933671116", ...defaultMemberInfo},
  {id: 5, name: "সোহাগ", role: "কোষাধ্যক্ষ", joma: 170.00, phone: "01605620537", ...defaultMemberInfo},
  {id: 6, name: "শাকিল", role: "ক্রীড়া সম্পাদক", joma: 130.00, phone: "01880798163", ...defaultMemberInfo},
  {id: 7, name: "আলম", role: "সাংগঠনিক সম্পাদক", joma: 160.00, phone: "01997110816", ...defaultMemberInfo},
  {id: 8, name: "চঞ্চল", role: "সহকারী কোষাধ্যক্ষ", joma: 60.00, phone: "01934322510", ...defaultMemberInfo},
  {id: 9, name: "সুমন", role: "প্রচার সম্পাদক", joma: 40.00, phone: "01619458196", ...defaultMemberInfo},
  {id: 10, name: "মাসুদ", role: "সাবেক সভাপতি", joma: 150.00, phone: "01784879930", ...defaultMemberInfo},
  {id: 11, name: "আল-আমিন", role: "সদস্য", joma: 135.00, phone: "01910727369", ...defaultMemberInfo},
  {id: 12, name: "ছালমান", role: "সদস্য", joma: 50.00, phone: "01882973798", ...defaultMemberInfo},
  {id: 13, name: "সজীব", role: "সদস্য", joma: 140.00, phone: "01746982469", ...defaultMemberInfo},
  {id: 14, name: "কবির", role: "সদস্য", joma: 260.00, phone: "01403050702", ...defaultMemberInfo},
  {id: 15, name: "রোমান", role: "সদস্য", joma: 50.00, phone: "01937660966", ...defaultMemberInfo},
  {id: 16, name: "নাম নেই (PDF)", role: "সদস্য", joma: 115.00, phone: "01870576792", ...defaultMemberInfo},
  {id: 17, name: "বায়েজিদ", role: "সদস্য", joma: 100.00, phone: "N/A", ...defaultMemberInfo},
  {id: 18, name: "মমিন", role: "সদস্য", joma: 80.00, phone: "01859881230", ...defaultMemberInfo},
  {id: 19, name: "মুন্নাফ", role: "সদস্য", joma: 50.00, phone: "01986634372", ...defaultMemberInfo},
  {id: 20, name: "শাওন", role: "সদস্য", joma: 0.00, phone: "01822512720", ...defaultMemberInfo},
  {id: 21, name: "রাকিব", role: "সদস্য", joma: 0.00, phone: "N/A", ...defaultMemberInfo},
  {id: 22, name: "মামুন", role: "সদস্য", joma: 0.00, phone: "N/A", ...defaultMemberInfo},
  {id: 23, name: "শ্রাবন", role: "সদস্য", joma: 70.00, phone: "N/A", ...defaultMemberInfo},
  {id: 24, name: "রকিব", role: "সদস্য", joma: 10.00, phone: "N/A", ...defaultMemberInfo},
  {id: 25, name: "রাহাত", role: "সদস্য", joma: 0.00, phone: "N/A", ...defaultMemberInfo},
  {id: 26, name: "শিমুল", role: "সদস্য", joma: 0.00, phone: "N/A", ...defaultMemberInfo},
  {id: 27, name: "রাকিবুল", role: "সদস্য", joma: 0.00, phone: "N/A", ...defaultMemberInfo},
];

export const initialDonationData: Transaction[] = [
  {id: 1, date: "অনির্দিষ্ট", desc: "মোঃ দেলোয়ার হোসেন", amount: 100.00, category: 'অন্যান্য অনুদান'},
  {id: 2, date: "অনির্দিষ্ট", desc: "আনোয়ার", amount: 50.00, category: 'অন্যান্য অনুদান'},
  {id: 3, date: "অনির্দিষ্ট", desc: "রিপন", amount: 45.00, category: 'অন্যান্য অনুদান'},
  {id: 4, date: "অনির্দিষ্ট", desc: "শামীম", amount: 300.00, category: 'অন্যান্য অনুদান'},
  {id: 5, date: "অনির্দিষ্ট", desc: "মইফুল", amount: 20.00, category: 'অন্যান্য অনুদান'},
  {id: 6, date: "অনির্দিষ্ট", desc: "শরীফ", amount: 20.00, category: 'অন্যান্য অনুদান'},
  {id: 7, date: "অনির্দিষ্ট", desc: "কবির", amount: 20.00, category: 'অন্যান্য অনুদান'},
  {id: 8, date: "অনির্দিষ্ট", desc: "চঞ্চল", amount: 100.00, category: 'অন্যান্য অনুদান'},
  {id: 9, date: "অনির্দিষ্ট", desc: "জয়নাল", amount: 10.00, category: 'অন্যান্য অনুদান'},
  {id: 10, date: "অনির্দিষ্ট", desc: "কিনু (মথুল)", amount: 50.00, category: 'অন্যান্য অনুদান'},
  {id: 11, date: "অনির্দিষ্ট", desc: "দেলোয়ার হোসেন", amount: 50.00, category: 'অন্যান্য অনুদান'},
  {id: 12, date: "অনির্দিষ্ট", desc: "রফিকুল (কালু)", amount: 100.00, category: 'অন্যান্য অনুদান'},
  {id: 13, date: "অনির্দিষ্ট", desc: "বাছেদ", amount: 20.00, category: 'অন্যান্য অনুদান'},
  {id: 14, date: "অনির্দিষ্ট", desc: "খেলাধুলার জন্য টাকা সংগ্রহ", amount: 4020.00, category: 'প্রকল্প: খেলাধুলা'},
  {id: 15, date: "অনির্দিষ্ট", desc: "ইফতারের চাঁদার পরিমাণ", amount: 606.00, category: 'প্রকল্প: ইফতার/ত্রাণ'},
  {id: 16, date: "অনির্দিষ্ট", desc: "ঈদুল ফিতরের ত্রাণ জন্য অনুদান", amount: 1190.00, category: 'প্রকল্প: ইফতার/ত্রাণ'},
  {id: 17, date: "অনির্দিষ্ট", desc: "মাঠের জন্য চাঁদা সংগ্রহ", amount: 365.00, category: 'অন্যান্য অনুদান'},
  {id: 18, date: "অনির্দিষ্ট", desc: "দান", amount: 20.00, category: 'অন্যান্য অনুদান'},
  {id: 19, date: "অনির্দিষ্ট", desc: "বাঁশ বিক্রি", amount: 80.00, category: 'অন্যান্য অনুদান'},
  {id: 20, date: "27-12-2024", desc: "বাঁশ বিক্রি", amount: 220.00, category: 'অন্যান্য অনুদান'},
  {id: 21, date: "02-03-2025", desc: "ইফতার থেকে আয় (২০২৫)", amount: 1290.00, category: 'প্রকল্প: ইফতার/ত্রাণ'},
];

export const initialExpenseData: Transaction[] = [
  {id: 1, date: "০৪-০৩-২০২০", desc: "ব্যানার ও বাধাইকরণ বাবদ", amount: 435.00, category: 'প্রশাসনিক'},
  {id: 2, date: "০৯-০৩-২০২০", desc: "শান্তি সংঘ উদ্বোধন কাজের খরচ", amount: 90.00, category: 'প্রশাসনিক'},
  {id: 3, date: "০৯-০৩-২০২০", desc: "জিয়াতার", amount: 20.00, category: 'প্রশাসনিক'},
  {id: 4, date: "১০-০৩-২০২০", desc: "রেজিস্টার খাতা", amount: 40.00, category: 'প্রশাসনিক'},
  {id: 5, date: "১০-০৩-২০২০", desc: "ভর্তি ফরম প্রিন্ট", amount: 90.00, category: 'প্রশাসনিক'},
  {id: 6, date: "১১-০৩-২০২০", desc: "মসজিদে গাস্তের দাওয়াত", amount: 20.00, category: 'প্রকল্প: ধর্মীয়/ইফতার'},
  {id: 7, date: "১২-০৩-২০২০", desc: "বেঞ্চ তৈরি বাবদ", amount: 26.00, category: 'প্রশাসনিক'},
  {id: 8, date: "২৪-০৪-২০২০", desc: "ইফতার বাবদ", amount: 1000.00, category: 'প্রকল্প: ধর্মীয়/ইফতার'},
  {id: 9, date: "২০-০৫-২০২০", desc: "শবে কদর পালন", amount: 210.00, category: 'প্রকল্প: ধর্মীয়/ইফতার'},
  {id: 10, date: "২৫-০৫-২০২০", desc: "ঈদের ব্যানার", amount: 60.00, category: 'প্রশাসনিক'},
  {id: 11, date: "N/A", desc: "ট্যাপ", amount: 30.00, category: 'প্রশাসনিক'},
  {id: 12, date: "২১-১২-২০২০", desc: "তবারক", amount: 50.00, category: 'প্রকল্প: ধর্মীয়/ইফতার'},
  {id: 13, date: "N/A", desc: "জিয়াই তার ও লোহা", amount: 60.00, category: 'প্রশাসনিক'},
  {id: 14, date: "১১-০৪-২০২১", desc: "শান্তি সংঘের ব্যানার", amount: 475.00, category: 'প্রশাসনিক'},
  {id: 15, date: "১৪-০৪-২০২১", desc: "ইফতার বাবদ খরচ", amount: 706.00, category: 'প্রকল্প: ধর্মীয়/ইফতার'},
  {id: 16, date: "১১-০৫-২০২১", desc: "বল ক্রয়", amount: 50.00, category: 'প্রকল্প: খেলাধুলা'},
  {id: 17, date: "১২-০৫-২০২১", desc: "ঈদুল ফিতরে ত্রাণ বাবদ খরচ", amount: 1120.00, category: 'প্রকল্প: ত্রাণ'},
  {id: 18, date: "২২-০৭-২০২১", desc: "ঈদুল আজহায় খোলাধুলা বাবদ খরচ", amount: 3135.00, category: 'প্রকল্প: খেলাধুলা'},
  {id: 19, date: "N/A", desc: "কাঠালগাছ ক্রয়", amount: 250.00, category: 'অন্যান্য'},
  {id: 20, date: "০৫-০৩-২০২৫", desc: "মসজিদের জন্য জগ ক্রয় (২ টি)", amount: 200.00, category: 'সামাজিক কাজ'},
  {id: 21, date: "২৭-০৩-২০২৫", desc: "২৭ রমজান আয়োজন", amount: 1100.00, category: 'প্রকল্প: ধর্মীয়/ইফতার'},
  {id: 22, date: "০৩-০৬-২০২৫", desc: "ব্যানার ও বাধাইকরণ বাবদ", amount: 770.00, category: 'প্রশাসনিক'},
  {id: 23, date: "০৪-০৬-২০২৫", desc: "জিয়া তার", amount: 40.00, category: 'প্রশাসনিক'},
];

export const initialProjectFullData: Project[] = [
  { 
    id: "iftar-2025",
    name: "ইফতার আয়োজন ২০২৫", 
    gradient: "from-teal-500 to-cyan-600",
    incomeList: [
      { id: 1, name: 'আশিক', amount: 500 }, { id: 2, name: 'রিপন ভাই', amount: 500 }, { id: 3, name: 'সোহেল', amount: 500 },
      { id: 4, name: 'সজীব', amount: 300 }, { id: 5, name: 'ময়ফুল (উঃ)', amount: 300 }, { id: 6, name: 'মিলন', amount: 300 },
      { id: 7, name: 'আলম', amount: 300 }, { id: 8, name: 'রাসেল', amount: 200 }, { id: 9, name: 'হেলাল', amount: 200 },
      { id: 10, name: 'আনোয়ার', amount: 200 }, { id: 11, name: 'কবির', amount: 200 }, { id: 12, name: 'মাসুদ', amount: 200 },
      { id: 13, name: 'লেবু', amount: 200 }, { id: 14, name: 'আলামিন', amount: 200 }, { id: 15, name: 'শামীম', amount: 100 },
      { id: 16, name: 'সোহাগ', amount: 100 }, { id: 17, name: 'মইফুল', amount: 100 }, { id: 18, name: 'শফিকুল', amount: 100 },
      { id: 19, name: 'মনির ভাই', amount: 100 }, { id: 20, name: 'সম্পদ', amount: 100 }, { id: 21, name: 'শাকিল', amount: 100 },
      { id: 22, name: 'চঞ্চল', amount: 100 }, { id: 23, name: 'সুলতান', amount: 100 }, { id: 24, name: 'নাঈম (মাতার পাড়া)', amount: 100 },
      { id: 25, name: 'রাকিব', amount: 100 }, { id: 26, name: 'আরিফ', amount: 50 }, { id: 27, name: 'শ্রাবণ', amount: 50 },
      { id: 28, name: 'সুজন', amount: 100 }, { id: 29, name: 'মোঃ খোরশেদ', amount: 50 }, { id: 30, name: 'মনির', amount: 50 },
      { id: 31, name: 'সৈয়দ আলী', amount: 50 }, { id: 32, name: 'ময়নাল', amount: 50 }, { id: 33, name: 'আসিফ', amount: 100 },
      { id: 34, name: 'মুরসালিন', amount: 50 }, { id: 35, name: 'মহর', amount: 40 }, { id: 36, name: 'জয়নাল', amount: 10 },
      { id: 37, name: 'ফারুক', amount: 100 }
    ],
    expenseList: [
      { id: 1, item: 'পেঁয়াজ (২ কেজি)', amount: 70 }, { id: 2, item: 'আধা (৫০০ গ্রাম)', amount: 60 }, { id: 3, item: 'রসুন (২৫০ গ্রাম)', amount: 60 },
      { id: 4, item: 'রাঁধুনি মসলা (৩ টি)', amount: 180 }, { id: 5, item: 'চাউল (৮ কেজি)', amount: 630 }, { id: 6, item: 'টেস্টি সল্ট (১ প্যাকেট)', amount: 20 },
      { id: 7, item: 'মরিচ গুঁড়া (১ প্যাকেট)', amount: 35 }, { id: 8, item: 'গরম মসলা (১ প্যাকেট)', amount: 35 }, { id: 9, item: 'ধনিয়া গুড়া (১ প্যাকেট)', amount: 30 },
      { id: 10, item: 'ঘি (১ টি)', amount: 110 }, { id: 11, item: 'টমেটো সস', amount: 30 }, { id: 12, item: 'কিসমিস (১০০ গ্রাম)', amount: 80 },
      { id: 13, item: 'দারুচিনি', amount: 35 }, { id: 14, item: 'জিরা (২৫ গ্রাম)', amount: 20 }, { id: 15, item: 'সাদা এলাচ (১২ গ্রাম)', amount: 70 },
      { id: 16, item: 'লবণ (১ কেজি)', amount: 35 }, { id: 17, item: 'টক দই (৫০০ গ্রাম)', amount: 120 }, { id: 18, item: 'খেজুর (১ কেজি)', amount: 160 },
      { id: 19, item: 'মুরগি (৭ কেজি)', amount: 1300 }, { id: 20, item: 'শসা (২ কেজি)', amount: 80 }, { id: 21, item: 'কাঁচামরিচ (৫০০ গ্রাম)', amount: 20 },
      { id: 22, item: 'গাজর (১ কেজি)', amount: 20 }, { id: 23, item: 'তেল (২.৫ কেজি)', amount: 490 }, { id: 24, item: 'চিনি (১ কেজি)', amount: 120 },
      { id: 25, item: 'সিপো ট্যাঙ্ক (১ বক্স)', amount: 110 }, { id: 26, item: 'কলা (২১ হালি)', amount: 200 }, { id: 27, item: 'খেজুর (৫০০ গ্রাম)', amount: 100 },
      { id: 28, item: 'গাড়ি ভাড়া', amount: 70 }, { id: 29, item: 'দুধ (১ কেজি)', amount: 80 }, { id: 30, item: 'ট্যাঙ্ক (১ বক্স)', amount: 140 },
      { id: 31, item: 'প্লেট', amount: 100 }
    ]
  },
  { 
    id: "iftar-2024",
    name: "ইফতার আয়োজন ২০২৪", 
    gradient: "from-sky-500 to-blue-600",
    incomeList: [
      { id: 1, name: 'শাকিল', amount: 100 }, { id: 2, name: 'মনোয়ারা', amount: 50 }, { id: 3, name: 'শামীম', amount: 50 }, { id: 4, name: 'সয়ন (১)', amount: 10 },
      { id: 5, name: 'আক্তার', amount: 20 }, { id: 6, name: 'বিজয়', amount: 25 }, { id: 7, name: 'মনির', amount: 20 }, { id: 8, name: 'ময়নাল', amount: 20 },
      { id: 9, name: 'সোহাগ', amount: 50 }, { id: 10, name: 'রাসেল', amount: 50 }, { id: 11, name: 'চঞ্চল', amount: 50 }, { id: 12, name: 'সয়ন (২)', amount: 20 },
      { id: 13, name: 'ফারুক', amount: 50 }, { id: 14, name: 'শফিকুল', amount: 20 }, { id: 15, name: 'মেরাজ', amount: 20 }, { id: 16, name: 'ইব্রাহিম', amount: 15 },
      { id: 17, name: 'সজীব', amount: 200 }, { id: 18, name: 'সাগর', amount: 10 }, { id: 19, name: 'সুজন', amount: 100 }, { id: 20, name: 'সাকিব', amount: 10 },
      { id: 21, name: 'সৈকত', amount: 20 }, { id: 22, name: 'সিরাজ', amount: 200 }, { id: 23, name: 'মুরছালিন', amount: 50 }, { id: 24, name: 'সুলতান', amount: 250 },
      { id: 25, name: 'রাকিব', amount: 100 }, { id: 26, name: 'সৈয়দ আলী', amount: 20 }, { id: 27, name: 'আলামিন', amount: 220 }, { id: 28, name: 'হেলাল', amount: 200 },
      { id: 29, name: 'সম্পদ', amount: 50 }, { id: 30, name: 'ওবাইদুল (হুজুর)', amount: 100 }, { id: 31, name: 'শামীম', amount: 20 }, { id: 32, name: 'মমিন', amount: 30 }
    ],
    expenseList: [
      { id: 1, item: 'ছোলা', amount: 360 }, { id: 2, item: 'পিয়াজি', amount: 100 }, { id: 3, item: 'বুন্দি', amount: 120 },
      { id: 4, item: 'খেজুর', amount: 180 }, { id: 5, item: 'পেঁয়াজ', amount: 35 }, { id: 6, item: 'কাঁচা মরিচ', amount: 20 },
      { id: 7, item: 'শসা', amount: 80 }, { id: 8, item: 'ধনে পাতা', amount: 10 }, { id: 9, item: 'লেবু', amount: 100 },
      { id: 10, item: 'চিনি', amount: 140 }, { id: 11, item: 'আপেল', amount: 240 }, { id: 12, item: 'কলা', amount: 140 },
      { id: 13, item: 'ট্যাংক', amount: 130 }, { id: 14, item: 'বেগুনী, চপ', amount: 60 }, { id: 15, item: 'তরমুজ', amount: 130 },
      { id: 16, item: 'তৈল', amount: 25 }, { id: 17, item: 'তার', amount: 25 }, { id: 18, item: 'ক্যাশ আউট চার্জ', amount: 10 },
      { id: 19, item: 'গাড়ি ভাড়া', amount: 40 }
    ]
  },
  { 
    id: "khela-2021",
    name: "ঈদুল আজহা খেলাধুলা ২০২১", 
    gradient: "from-amber-500 to-orange-600",
    incomeList: [{ id: 1, name: 'খেলাধুলার জন্য টাকা সংগ্রহ', amount: 4020 }],
    expenseList: [{ id: 1, item: 'ঈদুল আজহায় খোলাধুলা বাবদ খরচ', amount: 3135 }]
  },
  { 
    id: "tran-2021",
    name: "ঈদুল ফিতর ত্রাণ ২০২১", 
    gradient: "from-indigo-500 to-purple-600",
    incomeList: [{ id: 1, name: 'ঈদুল ফিতরের ত্রাণ জন্য অনুদান', amount: 1190 }],
    expenseList: [{ id: 1, item: 'ঈদুল ফিতরে ত্রাণ বাবদ খরচ', amount: 1120 }]
  }
];

export const initialDraftData: Draft[] = [
  {
    id: 'draft-page-2',
    title: "খসড়া হিসাব (পৃষ্ঠা ২)",
    items: [
      {id: 1, name: "মহর", amount: 100}, {id: 2, name: "শাওন", amount: 100}, {id: 3, name: "שয়ন", amount: 100},
      {id: 4, name: "রকিব", amount: 100}, {id: 5, name: "মমিন", amount: 200}, {id: 6, name: "সোহাগ", amount: 50},
      {id: 7, name: "আরিফ", amount: 50}, {id: 8, name: "চঞ্চল", amount: 50}, {id: 9, name: "মেরাজ", amount: 30},
      {id: 10, name: "সম্পদ", amount: 70},
    ]
  },
  {
    id: 'draft-page-10',
    title: "খসড়া হিসাব (পৃষ্ঠা ১০)",
    items: [
      {id: 1, name: "শাকিল", amount: 50}, {id: 2, name: "এরশাদ", amount: 500}, {id: 3, name: "সম্পদ", amount: 50},
      {id: 4, name: "চঞ্চল", amount: 50}, {id: 5, name: "সজীব", amount: 100}, {id: 6, name: "হাসান", amount: 100},
      {id: 7, name: "মহর", amount: 100}, {id: 8, name: "রুকন", amount: 100}, {id: 9, name: "শফিকুলের মা", amount: 500},
      {id: 10, name: "মসজিদ থেকে (আসিফ)", amount: 1000}, {id: 11, name: "আয়নাল", amount: 500}, {id: 12, name: "হবি", amount: 100},
      {id: 13, name: "ফরমান", amount: 100}, {id: 14, name: "মীম", amount: 20}, {id: 15, name: "সম্পদের দুলাভাই", amount: 500},
    ]
  }
];

export const PROJECT_GRADIENTS = [
  "from-teal-500 to-cyan-600",
  "from-sky-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-purple-600",
  "from-lime-500 to-green-600",
  "from-rose-500 to-pink-600",
];
