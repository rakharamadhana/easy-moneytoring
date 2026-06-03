import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { supabase } from "../supabaseClient";
import { parseQuickInput, categories } from "../utils/categorizer";

const HomeTab = lazy(() => import("./HomeTab"));
const CashFlowTab = lazy(() => import("./CashFlowTab"));
const HistoryTab = lazy(() => import("./HistoryTab"));
const ProfileTab = lazy(() => import("./ProfileTab"));

// ---------------- Skeleton Placeholders for Lazy Loading ----------------
function HomeTabSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Remaining Budget Card Skeleton */}
      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 h-40 flex flex-col justify-between">
        <div>
          <div className="h-3.5 bg-white/10 rounded-md w-1/3 mb-3" />
          <div className="h-9 bg-white/10 rounded-md w-2/3 mb-2.5" />
          <div className="h-4 bg-white/10 rounded-md w-1/2" />
        </div>
        <div className="h-4 bg-white/10 rounded-full w-full mt-4" style={{ height: "18px" }} />
      </div>

      {/* Category Expenditures Card Skeleton */}
      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 flex flex-col gap-4">
        <div className="h-4 bg-white/10 rounded-md w-1/4 mb-1" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10" />
                  <div className="h-3.5 bg-white/10 rounded-md w-24" />
                </div>
                <div className="h-3.5 bg-white/10 rounded-md w-16" />
              </div>
              <div className="h-1 bg-white/10 rounded-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CashFlowTabSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glassmorphism rounded-2xl p-4 border border-white/5 bg-slate-950/20 h-24 flex flex-col justify-between">
            <div className="h-3 bg-white/10 rounded-md w-2/3" />
            <div className="h-6 bg-white/10 rounded-md w-5/6" />
          </div>
        ))}
      </div>
      
      {/* baseline / fixed card 1 */}
      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 flex flex-col gap-4">
        <div className="h-4 bg-white/10 rounded-md w-1/3 mb-1" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex flex-col gap-1.5 w-1/3">
                <div className="h-3.5 bg-white/10 rounded-md w-full" />
                <div className="h-2.5 bg-white/10 rounded-md w-2/3" />
              </div>
              <div className="h-4 bg-white/10 rounded-md w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* baseline / fixed card 2 */}
      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 flex flex-col gap-4">
        <div className="h-4 bg-white/10 rounded-md w-1/3 mb-1" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex flex-col gap-1.5 w-1/3">
                <div className="h-3.5 bg-white/10 rounded-md w-full" />
                <div className="h-2.5 bg-white/10 rounded-md w-2/3" />
              </div>
              <div className="h-4 bg-white/10 rounded-md w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryTabSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Spending trends chart card skeleton */}
      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col gap-1.5 w-1/3">
            <div className="h-3 bg-white/10 rounded-md w-2/3" />
            <div className="h-5 bg-white/10 rounded-md w-full" />
          </div>
          <div className="w-24 h-6 bg-white/10 rounded-xl" />
        </div>
        {/* Mock Chart Area */}
        <div className="w-full aspect-[500/220] bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
          <div className="h-8 w-2/3 bg-white/5 rounded-full" />
        </div>
        {/* Stats card */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
          <div className="h-8 bg-white/10 rounded-lg" />
          <div className="h-8 bg-white/10 rounded-lg" />
          <div className="h-8 bg-white/10 rounded-lg" />
        </div>
      </div>

      {/* Filter and recent transactions skeleton */}
      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 flex flex-col gap-4">
        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="h-10 bg-white/10 rounded-xl w-full" />
          <div className="h-10 bg-white/10 rounded-xl w-full" />
          <div className="h-10 bg-white/10 rounded-xl w-full" />
        </div>
        {/* Transactions list */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 bg-white/10 rounded-md w-28" />
                  <div className="h-2.5 bg-white/10 rounded-md w-20" />
                </div>
              </div>
              <div className="h-4 bg-white/10 rounded-md w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileTabSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse pb-12">
      {/* Avatar Card */}
      <div className="glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20 flex flex-col items-center justify-center gap-4">
        {/* Big Avatar circle */}
        <div className="w-20 h-20 rounded-full bg-white/10" />
        <div className="space-y-2 flex flex-col items-center w-full">
          <div className="h-3 bg-white/10 rounded-md w-1/4" />
          <div className="h-5 bg-white/10 rounded-md w-1/2" />
        </div>
      </div>

      {/* Buttons list */}
      <div className="flex flex-col gap-3">
        <div className="h-12 bg-white/10 rounded-2xl w-full" />
        <div className="h-12 bg-white/10 rounded-2xl w-full" />
      </div>
    </div>
  );
}
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonModal,
  IonInput,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTabBar,
  IonTabButton,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonToggle,
} from "@ionic/react";
import {
  wallet,
  walletOutline,
  trendingUp,
  trendingUpOutline,
  add,
  addOutline,
  calendar,
  calendarOutline,
  logOut,
  logOutOutline,
  trash,
  trashOutline,
  create,
  createOutline,
  close,
  closeOutline,
  checkmark,
  checkmarkOutline,
  alertCircle,
  alertCircleOutline,
  cart,
  cartOutline,
  cafe,
  cafeOutline,
  shirt,
  shirtOutline,
  car,
  carOutline,
  documentText,
  documentTextOutline,
  helpCircle,
  helpCircleOutline,
  refresh,
  refreshOutline,
  settingsOutline,
  arrowBackOutline,
  gameControllerOutline,
  heartOutline,
  cashOutline,
  bookOutline,
  barbellOutline,
  giftOutline,
  keyOutline,
  arrowUpOutline,
  arrowDownOutline,
} from "ionicons/icons";

const iconMap = {
  cartOutline,
  cafeOutline,
  shirtOutline,
  carOutline,
  documentTextOutline,
  helpCircleOutline,
  gameControllerOutline,
  heartOutline,
  cashOutline,
  bookOutline,
  barbellOutline,
  giftOutline,
  keyOutline,
};

const colorHexMap = {
  emerald: "#10b981",
  indigo: "#6366f1",
  rose: "#f43f5e",
  amber: "#f59e0b",
  sky: "#0ea5e9",
  violet: "#8b5cf6",
  slate: "#94a3b8",
};

export default function Dashboard({ session, onSignOut }) {
  const [baselineIncomes, setBaselineIncomes] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [additionalIncome, setAdditionalIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mobile navigation active tab
  const [activeTab, setActiveTab] = useState("home"); // 'home', 'cashflow', 'history', 'profile'
  const [isOpenQuickLog, setIsOpenQuickLog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    () => localStorage.getItem("easy_moneytoring_currency") || "NTD",
  );
  const [profileView, setProfileView] = useState("profile"); // 'profile', 'settings', or 'categories'
  const [selectedDetailCategory, setSelectedDetailCategory] = useState(null);
  const [userCategories, setUserCategories] = useState(categories);

  // Category Edit states
  const [catEditName, setCatEditName] = useState("");
  const [catEditColor, setCatEditColor] = useState("emerald");
  const [catEditIcon, setCatEditIcon] = useState("cashOutline");
  const [catEditKeywords, setCatEditKeywords] = useState("");
  const [editingCatKey, setEditingCatKey] = useState(null);

  // n8n Webhook States
  const [n8nEnabled, setN8nEnabled] = useState(
    () => localStorage.getItem("easy_moneytoring_n8n_enabled") === "true",
  );
  const [n8nUrl, setN8nUrl] = useState(
    () => localStorage.getItem("easy_moneytoring_n8n_url") || "",
  );
  const [n8nNickname, setN8nNickname] = useState(
    () => localStorage.getItem("easy_moneytoring_n8n_nickname") || "",
  );

  const [activeTheme, setActiveTheme] = useState(
    () => localStorage.getItem("easy_moneytoring_theme") || "emerald",
  );

  useEffect(() => {
    const themeColors = {
      emerald: { hex: "#10b981", rgb: "16, 185, 129" },
      indigo: { hex: "#6366f1", rgb: "99, 102, 241" },
      rose: { hex: "#f43f5e", rgb: "244, 63, 94" },
      amber: { hex: "#f59e0b", rgb: "245, 158, 11" },
      sky: { hex: "#0ea5e9", rgb: "14, 165, 233" },
      violet: { hex: "#8b5cf6", rgb: "139, 92, 246" },
    };
    const t = themeColors[activeTheme] || themeColors.emerald;
    document.documentElement.style.setProperty("--theme-color", t.hex);
    document.documentElement.style.setProperty("--theme-color-rgb", t.rgb);
    localStorage.setItem("easy_moneytoring_theme", activeTheme);
  }, [activeTheme]);

  // Expense Editing States
  const [editingExpense, setEditingExpense] = useState(null);
  const [editExpenseDesc, setEditExpenseDesc] = useState("");
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseCategory, setEditExpenseCategory] = useState("Other");
  const [editExpenseDate, setEditExpenseDate] = useState("");
  const [selectedQuickCategory, setSelectedQuickCategory] = useState(null);

  // Local ISO datetime helper YYYY-MM-DDTHH:mm
  const getLocalISODatetime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now - tzOffset).toISOString().slice(0, 16);
  };

  // Quick Expense input
  const [quickInput, setQuickInput] = useState("");
  const [quickLogDate, setQuickLogDate] = useState(getLocalISODatetime());
  const [parsed, setParsed] = useState({
    amount: "",
    description: "",
    category: categories.Other,
  });
  const quickInputRef = useRef(null);

  // Modal alert notification state
  const [modalData, setModalData] = useState(null);
  const showModal = (title, message, type = "info", sqlCode = null) => {
    setModalData({ title, message, type, sqlCode });
  };

  // Current month string
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Get start of the current month
  const getStartOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  // Synchronize browser tab document title with active tab & profile sub-views
  useEffect(() => {
    if (activeTab === "profile") {
      const subViews = {
        profile: "Profile",
        settings: "Settings",
        categories: "Categories",
      };
      const viewName = subViews[profileView] || "Profile";
      document.title = `Easy Moneytoring — ${viewName}`;
    } else {
      const tabNames = {
        home: "Home",
        cashflow: "Cash Flow",
        history: "History",
      };
      const tabName = tabNames[activeTab] || "Dashboard";
      document.title = `Easy Moneytoring — ${tabName}`;
    }
  }, [activeTab, profileView]);

  // Sync quick-input parser in real-time as user types
  useEffect(() => {
    setSelectedQuickCategory(null);
    if (quickInput.trim()) {
      setParsed(parseQuickInput(quickInput, userCategories));
    } else {
      setParsed({
        amount: "",
        description: "",
        category: userCategories.Other || categories.Other,
      });
    }
  }, [quickInput, userCategories]);

  // Category management handlers
  const handleSaveCategory = async (editingKey, catData) => {
    if (!catData.name.trim()) return false;

    const key = catData.name.trim();
    if (key.toLowerCase() === "other") {
      showModal(
        "Action Blocked",
        'You cannot create or overwrite a category named "Other" as it is reserved by the system.',
        "warning",
      );
      return false;
    }

    const cleanKeywords = catData.keywords.map((k) => k.toLowerCase());
    const existingOrder = editingKey ? (userCategories[editingKey]?.display_order || 0) : (Object.keys(userCategories).length * 10);

    const newCatObj = {
      name: key,
      color: catData.color,
      textColor: `text-${catData.color}-400`,
      bgColor: `bg-${catData.color}-400/10`,
      borderColor: `border-${catData.color}-400/20`,
      gradientFrom: `from-${catData.color}-400/20`,
      keywords: cleanKeywords,
      icon: catData.icon,
      display_order: existingOrder,
    };

    try {
      if (editingKey) {
        if (editingKey !== key) {
          const { error: delError } = await supabase
            .from("custom_categories")
            .delete()
            .eq("user_id", session.user.id)
            .eq("name", editingKey);
          if (delError) throw delError;
        }
      }

      const { error: upsertError } = await supabase
        .from("custom_categories")
        .upsert(
          {
            user_id: session.user.id,
            name: key,
            color: catData.color,
            icon: catData.icon,
            keywords: cleanKeywords,
            display_order: existingOrder,
          },
          { onConflict: "user_id,name" }
        );

      if (upsertError) {
        if (
          upsertError.message &&
          upsertError.message.includes(
            'relation "public.custom_categories" does not exist',
          )
        ) {
          triggerMigrationModal();
          return false;
        }
        throw upsertError;
      }

      const updated = { ...userCategories };
      if (editingKey && editingKey !== key) {
        delete updated[editingKey];
      }
      updated[key] = newCatObj;
      setUserCategories(updated);
      return true;
    } catch (err) {
      console.error("Error saving category to Supabase:", err);
      showModal(
        "Error Saving Category",
        "An error occurred while saving your category. Please try again.",
        "error",
      );
      return false;
    }
  };

  const handleDeleteCategory = async (catName) => {
    if (catName === "Other") {
      showModal(
        "Action Blocked",
        'The "Other" category is required by the system as a fallback and cannot be deleted.',
        "warning",
      );
      return;
    }

    try {
      const { error } = await supabase
        .from("custom_categories")
        .delete()
        .eq("user_id", session.user.id)
        .eq("name", catName);

      if (error) throw error;

      const updated = { ...userCategories };
      delete updated[catName];
      setUserCategories(updated);
    } catch (err) {
      console.error("Error deleting category from Supabase:", err);
      showModal(
        "Error Deleting Category",
        "Could not remove your custom category. Please try again.",
        "error",
      );
    }
  };

  const handleReorderCategories = async (newOrderedKeys) => {
    const updatedCategories = { ...userCategories };
    const updates = newOrderedKeys.map((k, i) => {
      const newOrder = i * 10;
      updatedCategories[k] = {
        ...updatedCategories[k],
        display_order: newOrder,
      };
      
      return supabase
        .from("custom_categories")
        .update({ display_order: newOrder })
        .eq("user_id", session.user.id)
        .eq("name", k);
    });

    setUserCategories(updatedCategories);

    try {
      const results = await Promise.all(updates);
      const firstErr = results.find(r => r.error)?.error;
      if (firstErr) {
        console.warn("Failed to sync category order to database.", firstErr);
      }
    } catch (err) {
      console.error("Error updating category display order:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = session.user;
      const startOfMonth = getStartOfMonth();

      // 1. Fetch baseline income sources
      const { data: baselineData, error: baselineError } = await supabase
        .from("baseline_income")
        .select("*")
        .eq("user_id", user.id)
        .order("transfer_day", { ascending: true });

      if (baselineError) {
        if (
          baselineError.message &&
          baselineError.message.includes(
            'relation "public.baseline_income" does not exist',
          )
        ) {
          setBaselineIncomes([]);
          triggerMigrationModal();
        } else {
          throw baselineError;
        }
      } else {
        setBaselineIncomes(baselineData || []);
      }

      // 2. Fetch fixed recurring expenses
      const { data: fixedData, error: fixedError } = await supabase
        .from("fixed_expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("due_day", { ascending: true });

      if (fixedError) {
        if (
          fixedError.message &&
          fixedError.message.includes(
            'relation "public.fixed_expenses" does not exist',
          )
        ) {
          setFixedExpenses([]);
          triggerMigrationModal();
        } else {
          throw fixedError;
        }
      } else {
        setFixedExpenses(fixedData || []);
      }

      // 3. Fetch Expenses for current month
      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startOfMonth)
        .order("created_at", { ascending: false });

      if (expensesError) throw expensesError;
      setExpenses(expensesData || []);

      // 4. Fetch Additional Income for current month
      const { data: incomeData, error: incomeError } = await supabase
        .from("additional_income")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startOfMonth)
        .order("created_at", { ascending: false });

      if (incomeError) throw incomeError;
      setAdditionalIncome(incomeData || []);

      // 5. Fetch Custom Categories from Supabase
      const { data: dbCategories, error: dbCategoriesError } = await supabase
        .from("custom_categories")
        .select("*")
        .eq("user_id", user.id);

      if (dbCategoriesError) {
        if (
          dbCategoriesError.message &&
          dbCategoriesError.message.includes(
            'relation "public.custom_categories" does not exist',
          )
        ) {
          triggerMigrationModal();
        } else {
          throw dbCategoriesError;
        }
      } else {
        if (dbCategories && dbCategories.length > 0) {
          const parsedCats = {};
          const sortedDbCats = [...dbCategories].sort(
            (a, b) => (a.display_order || 0) - (b.display_order || 0)
          );
          sortedDbCats.forEach((row) => {
            parsedCats[row.name] = {
              name: row.name,
              color: row.color,
              textColor: `text-${row.color}-400`,
              bgColor: `bg-${row.color}-400/10`,
              borderColor: `border-${row.color}-400/20`,
              gradientFrom: `from-${row.color}-400/20`,
              keywords: row.keywords || [],
              icon: row.icon,
              display_order: row.display_order || 0,
            };
          });

          // Critical check: If the system-required 'Other' category is missing,
          // it means the database was never seeded with the default categories!
          // We should seed any missing default categories immediately.
          if (!parsedCats["Other"]) {
            const missingDefaults = {};
            Object.keys(categories).forEach((key) => {
              if (!parsedCats[key]) {
                missingDefaults[key] = categories[key];
              }
            });

            const defaultIconMap = {
              Groceries: "cartOutline",
              Luxury: "cafeOutline",
              Shopping: "shirtOutline",
              Transport: "carOutline",
              Utilities: "documentTextOutline",
              "Utilities/Bills": "documentTextOutline",
              Other: "helpCircleOutline",
            };

            const rowsToInsert = Object.keys(missingDefaults).map((key) => {
              const cat = missingDefaults[key];
              return {
                user_id: user.id,
                name: cat.name,
                color: cat.color,
                icon: cat.icon || defaultIconMap[cat.name] || defaultIconMap[key] || "helpCircleOutline",
                keywords: cat.keywords || [],
              };
            });

            const { error: seedErr } = await supabase
              .from("custom_categories")
              .insert(rowsToInsert);

            if (!seedErr) {
              Object.keys(missingDefaults).forEach((key) => {
                const cat = missingDefaults[key];
                parsedCats[key] = {
                  name: cat.name,
                  color: cat.color,
                  textColor: `text-${cat.color}-400`,
                  bgColor: `bg-${cat.color}-400/10`,
                  borderColor: `border-${cat.color}-400/20`,
                  gradientFrom: `from-${cat.color}-400/20`,
                  keywords: cat.keywords || [],
                  icon: cat.icon || defaultIconMap[cat.name] || defaultIconMap[key] || "helpCircleOutline",
                };
              });
            }
          }
          setUserCategories(parsedCats);
        } else {
          // Empty in DB! Check if we have localStorage categories to migrate
          const localStored = localStorage.getItem("easy_moneytoring_custom_categories");
          let initialCats = categories;
          if (localStored) {
            try {
              initialCats = JSON.parse(localStored);
            } catch (e) {
              initialCats = categories;
            }
          }

          const defaultIconMap = {
            Groceries: "cartOutline",
            Luxury: "cafeOutline",
            Shopping: "shirtOutline",
            Transport: "carOutline",
            Utilities: "documentTextOutline",
            "Utilities/Bills": "documentTextOutline",
            Other: "helpCircleOutline",
          };

          // Let's seed / upload these to Supabase!
          const rowsToInsert = Object.keys(initialCats).map((key) => {
            const cat = initialCats[key];
            return {
              user_id: user.id,
              name: cat.name,
              color: cat.color,
              icon: cat.icon || defaultIconMap[cat.name] || defaultIconMap[key] || "helpCircleOutline",
              keywords: cat.keywords || [],
            };
          });

          const { error: insertErr } = await supabase
            .from("custom_categories")
            .insert(rowsToInsert);

          if (insertErr) {
            throw insertErr;
          } else {
            const migratedCats = {};
            Object.keys(initialCats).forEach((key) => {
              const cat = initialCats[key];
              const resolvedIcon = cat.icon || defaultIconMap[cat.name] || defaultIconMap[key] || "helpCircleOutline";
              migratedCats[key] = {
                name: cat.name,
                color: cat.color,
                textColor: cat.textColor || `text-${cat.color}-400`,
                bgColor: cat.bgColor || `bg-${cat.color}-400/10`,
                borderColor: cat.borderColor || `border-${cat.color}-400/20`,
                gradientFrom: cat.gradientFrom || `from-${cat.color}-400/20`,
                keywords: cat.keywords || [],
                icon: resolvedIcon,
              };
            });
            setUserCategories(migratedCats);
            // Clear localStorage so we don't migrate again on subsequent loads
            localStorage.removeItem("easy_moneytoring_custom_categories");
          }
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const triggerMigrationModal = () => {
    showModal(
      "Database Tables Required",
      "To support multi-source incomes, recurring bills, and category synchronization, please run this migration inside your Supabase dashboard SQL editor.",
      "migration",
      `-- BASELINE INCOME TABLE
create table if not exists public.baseline_income (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  transfer_day integer default 1 not null check (transfer_day >= 1 and transfer_day <= 31),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.baseline_income enable row level security;
drop policy if exists "Users can perform all operations on their own baseline income." on public.baseline_income;
create policy "Users can perform all operations on their own baseline income." on public.baseline_income for all using (auth.uid() = user_id);

-- FIXED EXPENSES TABLE
create table if not exists public.fixed_expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  category text not null,
  due_day integer default 1 not null check (due_day >= 1 and due_day <= 31),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.fixed_expenses enable row level security;
drop policy if exists "Users can perform all operations on their own fixed expenses." on public.fixed_expenses;
create policy "Users can perform all operations on their own fixed expenses." on public.fixed_expenses for all using (auth.uid() = user_id);

-- CUSTOM CATEGORIES TABLE
create table if not exists public.custom_categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  color text not null,
  icon text not null,
  keywords text[] default '{}'::text[] not null,
  display_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, name)
);
alter table public.custom_categories enable row level security;
drop policy if exists "Users can perform all operations on their own custom categories." on public.custom_categories;
create policy "Users can perform all operations on their own custom categories." on public.custom_categories for all using (auth.uid() = user_id);

-- ENHANCE EXISTING CUSTOM CATEGORIES TABLE FOR DISPLAY ORDER SORTING
alter table public.custom_categories add column if not exists display_order integer default 0 not null;`,
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Add baseline income source
  const handleAddBaselineIncome = async ({ desc, amount, day }) => {
    const parsedAmount = parseFloat(amount);
    const parsedDay = parseInt(day);
    const parsedDesc = desc.trim();

    if (isNaN(parsedAmount) || parsedAmount <= 0 || !parsedDesc) {
      showModal("Invalid Input", "Please enter a description and a valid amount.", "warning");
      return false;
    }
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      showModal("Invalid Transfer Day", "Transfer day of the month must be between 1 and 31.", "warning");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("baseline_income")
        .insert([{
          user_id: session.user.id,
          amount: parsedAmount,
          description: parsedDesc,
          transfer_day: parsedDay,
        }])
        .select()
        .single();

      if (error) {
        if (error.message && error.message.includes('relation "public.baseline_income" does not exist')) {
          triggerMigrationModal();
          return false;
        }
        throw error;
      }

      setBaselineIncomes((prev) =>
        [...prev, data].sort((a, b) => a.transfer_day - b.transfer_day)
      );
      return true;
    } catch (err) {
      console.error("Error adding baseline income:", err);
      showModal("Error Adding Regular Income", "Could not save the new baseline income source. Please check your database tables.", "error");
      return false;
    }
  };

  const handleSaveEditBaseline = async ({ id, desc, amount, day }) => {
    const parsedAmount = parseFloat(amount);
    const parsedDay = parseInt(day);
    const parsedDesc = desc.trim();

    if (isNaN(parsedAmount) || parsedAmount <= 0 || !parsedDesc) {
      showModal("Invalid Input", "Please enter a description and a valid amount.", "warning");
      return false;
    }
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      showModal("Invalid Transfer Day", "Transfer day of the month must be between 1 and 31.", "warning");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("baseline_income")
        .update({
          amount: parsedAmount,
          description: parsedDesc,
          transfer_day: parsedDay,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setBaselineIncomes((prev) =>
        prev
          .map((item) => (item.id === id ? data : item))
          .sort((a, b) => a.transfer_day - b.transfer_day)
      );
      return true;
    } catch (err) {
      console.error("Error saving regular income edit:", err);
      showModal("Error Saving Edit", "Could not save your changes. Please try again.", "error");
      return false;
    }
  };

  const handleDeleteBaselineIncome = async (id) => {
    try {
      const { error } = await supabase
        .from("baseline_income")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setBaselineIncomes((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting baseline income:", err);
      showModal("Error Deleting Source", "Could not remove the regular income source. Please try again.", "error");
      return false;
    }
  };

  const handleAddFixedExpense = async ({ desc, amount, day, category }) => {
    const parsedAmount = parseFloat(amount);
    const parsedDay = parseInt(day);
    const parsedDesc = desc.trim();

    if (isNaN(parsedAmount) || parsedAmount <= 0 || !parsedDesc) {
      showModal("Invalid Input", "Please enter a description and a valid amount.", "warning");
      return false;
    }
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      showModal("Invalid Due Day", "Due day of the month must be between 1 and 31.", "warning");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("fixed_expenses")
        .insert([{
          user_id: session.user.id,
          amount: parsedAmount,
          description: parsedDesc,
          category,
          due_day: parsedDay,
        }])
        .select()
        .single();

      if (error) {
        if (error.message && error.message.includes('relation "public.fixed_expenses" does not exist')) {
          triggerMigrationModal();
          return false;
        }
        throw error;
      }

      setFixedExpenses((prev) =>
        [...prev, data].sort((a, b) => a.due_day - b.due_day)
      );
      return true;
    } catch (err) {
      console.error("Error adding fixed expense:", err);
      showModal("Error Adding Fixed Bill", "Could not save the new recurring bill. Please check your database tables.", "error");
      return false;
    }
  };

  const handleSaveEditFixed = async ({ id, desc, amount, day, category }) => {
    const parsedAmount = parseFloat(amount);
    const parsedDay = parseInt(day);
    const parsedDesc = desc.trim();

    if (isNaN(parsedAmount) || parsedAmount <= 0 || !parsedDesc) {
      showModal("Invalid Input", "Please enter a description and a valid amount.", "warning");
      return false;
    }
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      showModal("Invalid Due Day", "Due day of the month must be between 1 and 31.", "warning");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("fixed_expenses")
        .update({
          amount: parsedAmount,
          description: parsedDesc,
          due_day: parsedDay,
          category,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setFixedExpenses((prev) =>
        prev
          .map((item) => (item.id === id ? data : item))
          .sort((a, b) => a.due_day - b.due_day)
      );
      return true;
    } catch (err) {
      console.error("Error saving fixed bill edit:", err);
      showModal("Error Saving Edit", "Could not save your changes. Please try again.", "error");
      return false;
    }
  };

  const handleDeleteFixedExpense = async (id) => {
    try {
      const { error } = await supabase
        .from("fixed_expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setFixedExpenses((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting fixed expense:", err);
      showModal("Error Deleting Bill", "Could not remove the recurring bill. Please try again.", "error");
      return false;
    }
  };

  const handleAddAdditionalIncome = async ({ amount, desc, date }) => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return false;

    try {
      const { data, error } = await supabase
        .from("additional_income")
        .insert([{
          user_id: session.user.id,
          amount: parsedAmount,
          description: desc.trim() || "Additional Income",
          date: date || new Date().toISOString().split("T")[0],
        }])
        .select()
        .single();

      if (error) throw error;
      setAdditionalIncome((prev) => [data, ...prev]);
      return true;
    } catch (err) {
      console.error("Error adding additional income:", err);
      showModal("Error Logging Income", "An error occurred while saving your additional income. Please try again.", "error");
      return false;
    }
  };

  const handleDeleteAdditionalIncome = async (id) => {
    try {
      const { error } = await supabase
        .from("additional_income")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      if (error) throw error;
      setAdditionalIncome((prev) => prev.filter((income) => income.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting additional income:", err);
      showModal("Error Deleting Income Entry", "Could not remove the additional income entry. Please try again.", "error");
      return false;
    }
  };

  const handleSaveEditAdditional = async ({ id, desc, amount, date }) => {
    const parsedAmount = parseFloat(amount);
    const parsedDesc = desc.trim();

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showModal("Invalid Input", "Please enter a valid amount.", "warning");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("additional_income")
        .update({
          amount: parsedAmount,
          description: parsedDesc || "Additional Income",
          date: date || new Date().toISOString().split("T")[0],
        })
        .eq("id", id)
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (error) throw error;

      setAdditionalIncome((prev) =>
        prev.map((item) => (item.id === id ? data : item))
      );
      return true;
    } catch (err) {
      console.error("Error saving additional income edit:", err);
      showModal("Error Saving Edit", "Could not save your changes. Please try again.", "error");
      return false;
    }
  };

  const handleStartEditExpense = (expense) => {
    setEditingExpense(expense);
    setEditExpenseDesc(expense.description);
    setEditExpenseAmount(expense.amount.toString());
    setEditExpenseCategory(expense.category);

    // Convert UTC ISO string or YYYY-MM-DD to local YYYY-MM-DDTHH:mm string
    const localDate = new Date(expense.created_at || expense.date);
    const tzOffset = localDate.getTimezoneOffset() * 60000;
    const localIso = new Date(localDate - tzOffset).toISOString().slice(0, 16);
    setEditExpenseDate(localIso);
  };

  // Save edited expense
  const handleSaveEditExpense = async (e) => {
    e.preventDefault();
    const amount = parseFloat(editExpenseAmount);
    const desc = editExpenseDesc.trim();

    if (isNaN(amount) || amount <= 0 || !desc) {
      showModal(
        "Invalid Input",
        "Please enter a description and a valid amount.",
        "warning",
      );
      return;
    }

    try {
      const pureDate = editExpenseDate.split("T")[0];
      const customCreatedAt = new Date(editExpenseDate).toISOString();

      const { data, error } = await supabase
        .from("expenses")
        .update({
          amount,
          description: desc,
          category: editExpenseCategory,
          date: pureDate,
          created_at: customCreatedAt,
        })
        .eq("id", editingExpense.id)
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (error) throw error;

      setExpenses((prev) =>
        prev.map((item) => (item.id === editingExpense.id ? data : item)),
      );
      setEditingExpense(null);
      showModal(
        "Transaction Updated",
        "Your transaction was successfully updated.",
        "success",
      );
    } catch (err) {
      console.error("Error updating expense:", err);
      showModal(
        "Error Updating Expense",
        "An error occurred while saving your changes. Please try again.",
        "error",
      );
    }
  };

  // Add quick-logged expense
  const handleQuickAddExpense = async (e) => {
    e.preventDefault();
    const amount = parseFloat(parsed.amount);
    const desc = parsed.description.trim();
    if (isNaN(amount) || amount <= 0 || !desc) {
      showModal(
        "Invalid Input Format",
        "Please enter a valid expense description and dollar amount (e.g. 'Zara 60' or 'Coffee 8.50').",
        "warning",
      );
      return;
    }

    try {
      // Split date-time local string YYYY-MM-DDTHH:mm to get pure date
      const pureDate = quickLogDate.split("T")[0];
      // Convert date-time local string to standard UTC ISO string for created_at
      const customCreatedAt = new Date(quickLogDate).toISOString();

      const { data, error } = await supabase
        .from("expenses")
        .insert([
          {
            user_id: session.user.id,
            amount,
            description: desc,
            category: selectedQuickCategory ? selectedQuickCategory.name : parsed.category.name,
            date: pureDate,
            created_at: customCreatedAt,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setExpenses((prev) => [data, ...prev]);

      // Adaptive learning: Save description as keyword if category was manually changed/different
      const chosenCategoryName = selectedQuickCategory ? selectedQuickCategory.name : parsed.category.name;
      if (
        chosenCategoryName !== "Other" &&
        parsed.category.name !== chosenCategoryName &&
        userCategories[chosenCategoryName]
      ) {
        const cat = userCategories[chosenCategoryName];
        const existingKeywords = cat.keywords || [];
        const cleanKeyword = desc.toLowerCase().trim();
        const hasKeyword = existingKeywords.some(
          (k) => k.toLowerCase().trim() === cleanKeyword
        );

        if (!hasKeyword) {
          const newKeywords = [...existingKeywords, desc.trim()];
          const updatedCategories = {
            ...userCategories,
            [chosenCategoryName]: {
              ...cat,
              keywords: newKeywords,
            },
          };
          setUserCategories(updatedCategories);

          // Update in DB (fire-and-forget in background)
          supabase
            .from("custom_categories")
            .update({ keywords: newKeywords })
            .eq("user_id", session.user.id)
            .eq("name", chosenCategoryName)
            .then(({ error: kwErr }) => {
              if (kwErr) {
                console.warn("Failed to auto-save learned keyword to category:", kwErr);
              }
            });
        }
      }

      setQuickInput("");
      setQuickLogDate(getLocalISODatetime());
      setSelectedQuickCategory(null);
      setParsed({ amount: "", description: "", category: categories.Other });
      setIsOpenQuickLog(false);

      // Trigger n8n Webhook in background if configured
      if (n8nEnabled && n8nUrl) {
        triggerN8nWebhook(data);
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      showModal(
        "Error Logging Expense",
        "An error occurred while saving your expense. Please try again.",
        "error",
      );
    }
  };

  // Trigger n8n webhook alert in the background
  const triggerN8nWebhook = async (expenseData) => {
    if (!n8nUrl) return;
    try {
      const payload = {
        event: "expense_created",
        expense: {
          id: expenseData.id,
          amount: parseFloat(expenseData.amount),
          description: expenseData.description,
          category: expenseData.category,
          date: expenseData.date,
          created_at: expenseData.created_at,
        },
        user: {
          id: session.user.id,
          email: session.user.email,
          nickname: n8nNickname || session.user.email.split("@")[0],
        },
      };

      await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to trigger n8n webhook:", err);
    }
  };

  // Send a test payload to the n8n webhook URL
  const handleSendTestWebhook = async () => {
    if (!n8nUrl) {
      showModal(
        "Webhook URL Missing",
        "Please enter a valid webhook URL before sending a test.",
        "warning",
      );
      return;
    }

    try {
      const payload = {
        event: "test",
        expense: {
          id: "test-uuid-12345",
          amount: 150,
          description: "Test Coffee",
          category: "Luxury",
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
        },
        user: {
          id: session.user.id,
          email: session.user.email,
          nickname: n8nNickname || session.user.email.split("@")[0],
        },
      };

      const response = await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showModal(
          "Test Webhook Sent",
          "Test webhook payload sent successfully! Check your n8n workspace executions.",
          "success",
        );
      } else {
        showModal(
          "Webhook Error",
          `Server responded with status ${response.status}. Please check your n8n configuration.`,
          "error",
        );
      }
    } catch (err) {
      console.error("Failed to send test webhook:", err);
      showModal(
        "Connection Failed",
        `Could not reach n8n. If n8n is running locally, ensure it is online, the URL is correct, and CORS permits the request. Details: ${err.message}`,
        "error",
      );
    }
  };

  // Delete an expense
  const handleDeleteExpense = async (id) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
      showModal(
        "Error Deleting Transaction",
        "Could not delete the selected transaction. Please try again.",
        "error",
      );
    }
  };

  const handleUpdateExpenseCategory = async (expense, categoryName) => {
    if (!expense || !categoryName || categoryName === expense.category) return;

    try {
      const { data, error } = await supabase
        .from("expenses")
        .update({ category: categoryName })
        .eq("id", expense.id)
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (error) throw error;
      setExpenses((prev) =>
        prev.map((item) => (item.id === expense.id ? data : item)),
      );
    } catch (err) {
      console.error("Error updating transaction category:", err);
      showModal(
        "Error Updating Category",
        "Could not update this transaction category. Please try again.",
        "error",
      );
    }
  };

  // Premium dynamic currency formatter (rounds to nearest integer)
  const currencies = {
    NTD: { symbol: "NT$" },
    USD: { symbol: "$" },
    EUR: { symbol: "€" },
    JPY: { symbol: "¥" },
    GBP: { symbol: "£" },
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    const activeCurrency = currencies[selectedCurrency] || currencies.NTD;
    if (isNaN(num)) return `${activeCurrency.symbol}0`;
    return `${activeCurrency.symbol}${Math.round(num).toLocaleString("en-US")}`;
  };

  // Math Calculations
  const currentDay = new Date().getDate();
  const totalBaselineConfigured = baselineIncomes.reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0,
  );
  const totalBaseline = baselineIncomes
    .filter((curr) => parseInt(curr.transfer_day) <= currentDay)
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalAdditional = additionalIncome.reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0,
  );
  const totalBudget = totalBaseline + totalAdditional;

  // Total Spent combines both logged one-off expenses and recurring fixed expenses
  const totalFixedExpenses = fixedExpenses.reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0,
  );
  const totalVariableSpent = expenses.reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0,
  );
  const totalSpent = totalVariableSpent + totalFixedExpenses;

  const remainingBudget = totalBudget - totalSpent;

  // Calculate percentages
  const spentPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const remainingPercentage = Math.max(0, 100 - spentPercentage);

  // Group expenses by category (combining variable expenses + fixed bills)
  const categoryTotals = expenses.reduce((acc, curr) => {
    const catName = curr.category;
    acc[catName] = (acc[catName] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});

  fixedExpenses.forEach((fe) => {
    const catName = fe.category;
    categoryTotals[catName] =
      (categoryTotals[catName] || 0) + parseFloat(fe.amount);
  });

  const sortedCategoriesList = Object.values(userCategories).sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  const getCategoryConfig = (catName) =>
    sortedCategoriesList.find((cat) => cat.name === catName) ||
    userCategories[catName] ||
    userCategories["Other"] ||
    categories.Other;

  // Category Icons Helper (Ionic-Icons map)
  const getCategoryIcon = (catName, sizeClass = "w-4.5 h-4.5") => {
    const cat = getCategoryConfig(catName);
    const iconRef = iconMap[cat.icon] || helpCircleOutline;
    const textColor = cat.textColor || "text-slate-400";
    return <IonIcon icon={iconRef} className={`${sizeClass} ${textColor}`} />;
  };

  // Category Colors Helper for high-contrast progress bars
  const getCategoryColor = (catName) => {
    const cat = getCategoryConfig(catName);
    return colorHexMap[cat.color] || "#94a3b8";
  };



  const showHeaderBack = activeTab === "profile" && profileView !== "profile";
  const handleHeaderBack = () => {
    if (profileView === "categories") {
      setProfileView("settings");
      handleCancelEditCategory();
      return;
    }

    setProfileView("profile");
  };

  // Category Visual Map helper (colors, order)
  const categoryMap = Object.keys(userCategories)
    .sort((a, b) => (userCategories[a].display_order || 0) - (userCategories[b].display_order || 0))
    .map((key) => ({
      key,
      ...userCategories[key],
    }));

  return (
    <IonPage>
      {/* Sleek & Compact Mobile Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "#080b11",
            "--border-width": "0px",
            "--border-color": "transparent",
            "border-bottom": "none",
            "--min-height": "48px",
          }}
        >
          <div className="flex items-center justify-between px-4 py-2 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2 min-w-0">
              {showHeaderBack ? (
                <button
                  type="button"
                  onClick={handleHeaderBack}
                  className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl rounded-btn-square border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-white active:scale-95"
                  aria-label="Go back"
                >
                  <IonIcon icon={arrowBackOutline} className="h-4.5 w-4.5" />
                </button>
              ) : (
                <img
                  src="/logo.png"
                  className="h-6 w-6 object-contain shrink-0"
                  alt="Logo"
                />
              )}
              <span className="text-[15px] font-extrabold tracking-tight font-['Outfit'] text-white">
                Easy Moneytoring
              </span>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* Main Content Area */}
      <IonContent scrollY={true} style={{ "--background": "#080b11" }}>
        <main className="max-w-4xl mx-auto px-4 pt-6 pb-4 flex flex-col gap-6">
          {loading ? (
            <HomeTabSkeleton />
          ) : (
            <>
              {/* Decorative Blur Blobs */}
              <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
              <div className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

              {/* 1. HOME TAB */}
              {activeTab === "home" && (
                <Suspense fallback={<HomeTabSkeleton />}>
                  <HomeTab
                    remainingBudget={remainingBudget}
                    totalBudget={totalBudget}
                    currentMonthName={currentMonthName}
                    formatCurrency={formatCurrency}
                    totalSpent={totalSpent}
                    categoryMap={categoryMap}
                    categoryTotals={categoryTotals}
                    getCategoryColor={getCategoryColor}
                    getCategoryIcon={getCategoryIcon}
                    setSelectedDetailCategory={setSelectedDetailCategory}
                    remainingPercentage={remainingPercentage}
                    onReorderCategories={handleReorderCategories}
                  />
                </Suspense>
              )}

              {/* 2. CASH FLOW TAB */}
              {activeTab === "cashflow" && (
                <Suspense fallback={<CashFlowTabSkeleton />}>
                  <CashFlowTab
                    baselineIncomes={baselineIncomes}
                    fixedExpenses={fixedExpenses}
                    additionalIncome={additionalIncome}
                    currentDay={currentDay}
                    formatCurrency={formatCurrency}
                    totalBaseline={totalBaseline}
                    totalBaselineConfigured={totalBaselineConfigured}
                    totalFixedExpenses={totalFixedExpenses}
                    totalAdditional={totalAdditional}
                    sortedCategoriesList={sortedCategoriesList}
                    onAddBaselineIncome={handleAddBaselineIncome}
                    onSaveEditBaseline={handleSaveEditBaseline}
                    onDeleteBaselineIncome={handleDeleteBaselineIncome}
                    onAddFixedExpense={handleAddFixedExpense}
                    onSaveEditFixed={handleSaveEditFixed}
                    onDeleteFixedExpense={handleDeleteFixedExpense}
                    onAddAdditionalIncome={handleAddAdditionalIncome}
                    onSaveEditAdditional={handleSaveEditAdditional}
                    onDeleteAdditionalIncome={handleDeleteAdditionalIncome}
                  />
                </Suspense>
              )}

              {/* 3. HISTORY TAB */}
              {activeTab === "history" && (
                <Suspense fallback={<HistoryTabSkeleton />}>
                  <HistoryTab
                    expenses={expenses}
                    formatCurrency={formatCurrency}
                    currentMonthName={currentMonthName}
                    sortedCategoriesList={sortedCategoriesList}
                    getCategoryConfig={getCategoryConfig}
                    getCategoryIcon={getCategoryIcon}
                    onStartEditExpense={handleStartEditExpense}
                    onDeleteExpense={handleDeleteExpense}
                    onUpdateExpenseCategory={handleUpdateExpenseCategory}
                  />
                </Suspense>
              )}

              {/* 4. PROFILE TAB */}
              {activeTab === "profile" && (
                <Suspense fallback={<ProfileTabSkeleton />}>
                  <ProfileTab
                    session={session}
                    onSignOut={onSignOut}
                    selectedCurrency={selectedCurrency}
                    onCurrencyChange={(newCurrency) => {
                      setSelectedCurrency(newCurrency);
                      localStorage.setItem("easy_moneytoring_currency", newCurrency);
                    }}
                    userCategories={userCategories}
                    getCategoryIcon={getCategoryIcon}
                    colorHexMap={colorHexMap}
                    iconMap={iconMap}
                    sortedCategoriesList={sortedCategoriesList}
                    n8nEnabled={n8nEnabled}
                    onN8nToggle={(checked) => {
                      setN8nEnabled(checked);
                      localStorage.setItem("easy_moneytoring_n8n_enabled", String(checked));
                    }}
                    n8nUrl={n8nUrl}
                    onN8nUrlChange={(val) => {
                      setN8nUrl(val);
                      localStorage.setItem("easy_moneytoring_n8n_url", val);
                    }}
                    n8nNickname={n8nNickname}
                    onN8nNicknameChange={(val) => {
                      setN8nNickname(val);
                      localStorage.setItem("easy_moneytoring_n8n_nickname", val);
                    }}
                    onSendTestWebhook={handleSendTestWebhook}
                    onSaveCategory={handleSaveCategory}
                    onReorderCategories={handleReorderCategories}
                    activeTheme={activeTheme}
                    onThemeChange={setActiveTheme}
                  />
                </Suspense>
              )}
            </>
          )}
        </main>

        {/* Premium Native Glassmorphic IonModal for warnings and migrations */}
        {modalData && (
          <IonModal
            isOpen={true}
            onDidDismiss={() => setModalData(null)}
            style={{
              "--background": "rgba(8, 11, 17, 0.65)",
              "--backdrop-opacity": "0.7",
              "--height": "auto",
              "--width": "100%",
              "--max-width": "440px",
              "--border-radius": "24px",
              "--box-shadow": "0 25px 50px -12px rgba(0,0,0,0.5)",
              "align-items": "center",
              "justify-content": "center",
              display: "flex",
            }}
          >
            <div className="glassmorphism rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col gap-4 bg-slate-900/90 max-w-sm w-full mx-auto my-auto animate-scale-up">
              {/* Decorative dynamic blur blob inside modal */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] pointer-events-none opacity-25 ${
                  modalData.type === "error"
                    ? "bg-rose-500"
                    : modalData.type === "warning" ||
                        modalData.type === "migration"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              />

              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 flex ${
                    modalData.type === "error"
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : modalData.type === "warning" ||
                          modalData.type === "migration"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  <IonIcon
                    icon={
                      modalData.type === "error"
                        ? alertCircleOutline
                        : modalData.type === "warning" ||
                            modalData.type === "migration"
                          ? alertCircleOutline
                          : checkmarkOutline
                    }
                    className="w-5 h-5 block"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold text-white tracking-tight font-['Outfit']">
                    {modalData.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-normal font-semibold">
                    {modalData.message}
                  </p>
                </div>
              </div>

              {/* SQL Migration script print block */}
              {modalData.sqlCode && (
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-between text-[8px] text-slate-500 font-extrabold uppercase tracking-widest px-1">
                    <span>SQL Migration Query:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(modalData.sqlCode);
                        const btn = document.getElementById("modal-copy-btn");
                        if (btn) {
                          btn.innerText = "Copied!";
                          setTimeout(() => {
                            btn.innerText = "Copy Query";
                          }, 2000);
                        }
                      }}
                      id="modal-copy-btn"
                      className="text-emerald-400 hover:text-emerald-300 cursor-pointer normal-case"
                    >
                      Copy Query
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-[10px] font-mono text-slate-300 leading-normal select-all break-all whitespace-pre-wrap max-h-28 overflow-y-auto font-semibold">
                    {modalData.sqlCode}
                  </div>
                </div>
              )}

              <button
                onClick={() => setModalData(null)}
                className="mt-1.5 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-extrabold text-[10px] uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer border border-white/5"
              >
                Close Modal
              </button>
            </div>
          </IonModal>
        )}

        {/* Gorgeous Glassmorphic Edit Expense Modal */}
        {editingExpense && (
          <IonModal
            isOpen={true}
            onDidDismiss={() => setEditingExpense(null)}
            style={{
              "--background": "rgba(8, 11, 17, 0.65)",
              "--backdrop-opacity": "0.7",
              "--height": "auto",
              "--width": "100%",
              "--max-width": "440px",
              "--border-radius": "24px",
              "--box-shadow": "0 25px 50px -12px rgba(0,0,0,0.5)",
              "align-items": "center",
              "justify-content": "center",
              display: "flex",
            }}
          >
            <div className="glassmorphism rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col gap-5 bg-slate-900/95 max-w-sm w-full mx-auto my-auto animate-scale-up">
              {/* Glowing indigo blob */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />

              <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-400 text-[9px] font-black tracking-widest uppercase border border-indigo-500/20">
                    Edit Expense
                  </span>
                  <button
                    onClick={() => setEditingExpense(null)}
                    className="p-1.5 rounded-xl rounded-btn-square bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex"
                  >
                    <IonIcon icon={closeOutline} className="w-4 h-4 block" />
                  </button>
                </div>
                <h3 className="text-base font-extrabold text-white tracking-tight font-['Outfit'] mt-1.5">
                  Update Transaction
                </h3>
              </div>

              <form
                onSubmit={handleSaveEditExpense}
                className="flex flex-col gap-4"
              >
                {/* Description Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                    Description
                  </label>
                  <IonItem
                    lines="none"
                    className="rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                    style={{
                      "--background": "transparent",
                      "--inner-padding-end": "0px",
                      "--padding-start": "0px",
                    }}
                  >
                    <IonInput
                      type="text"
                      required
                      placeholder="e.g. Starbucks, Groceries"
                      value={editExpenseDesc}
                      onIonInput={(e) => setEditExpenseDesc(e.detail.value)}
                      className="px-4 py-2 text-white text-xs font-semibold"
                      style={{
                        "--padding-top": "12px",
                        "--padding-bottom": "12px",
                      }}
                    />
                  </IonItem>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                    Amount
                  </label>
                  <IonItem
                    lines="none"
                    className="rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                    style={{
                      "--background": "transparent",
                      "--inner-padding-end": "0px",
                      "--padding-start": "0px",
                    }}
                  >
                    <IonInput
                      type="number"
                      required
                      step="0.01"
                      placeholder="Amount"
                      value={editExpenseAmount}
                      onIonInput={(e) => setEditExpenseAmount(e.detail.value)}
                      className="px-4 py-2 text-white text-xs font-semibold"
                      style={{
                        "--padding-top": "12px",
                        "--padding-bottom": "12px",
                      }}
                    />
                  </IonItem>
                </div>

                {/* Category Select Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                    Category
                  </label>
                  <IonItem
                    fill="none"
                    className="rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                    style={{
                      "--background": "transparent",
                      "--inner-padding-end": "0px",
                      "--padding-start": "0px",
                    }}
                  >
                    <div className="w-full px-4 py-1 font-semibold text-slate-200">
                      <IonSelect
                        value={editExpenseCategory}
                        onIonChange={(e) =>
                          setEditExpenseCategory(e.detail.value)
                        }
                        interface="popover"
                        className="text-white text-xs font-sans"
                        style={{
                          "--padding-top": "6px",
                          "--padding-bottom": "6px",
                        }}
                      >
                        {sortedCategoriesList.map((cat) => (
                          <IonSelectOption key={cat.name} value={cat.name}>
                            {cat.name}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </div>
                  </IonItem>
                </div>

                {/* Date & Time Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                    Transaction Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={editExpenseDate}
                    onChange={(e) => setEditExpenseDate(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-emerald-500/60 focus:outline-none transition-all font-mono text-xs text-white rounded-2xl px-4 py-3 cursor-pointer"
                    style={{
                      colorScheme: "dark",
                      color: "#ffffff",
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingExpense(null)}
                    className="flex-1 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wide font-extrabold text-xs text-slate-300 border border-white/10"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      padding: "12px 20px",
                      borderRadius: "16px",
                      minHeight: "44px",
                    }}
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 uppercase tracking-wide font-extrabold text-xs"
                    style={{
                      background: "linear-gradient(to right, var(--theme-color), var(--color-teal-400))",
                      color: "#022c22",
                      padding: "12px 20px",
                      borderRadius: "16px",
                      border: "none",
                      minHeight: "44px",
                    }}
                  >
                    <IonIcon
                      icon={checkmarkOutline}
                      className="w-4 h-4 stroke-[2.5]"
                      style={{ color: "#022c22" }}
                    />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </IonModal>
        )}

        {/* Gorgeous Glassmorphic Quick Log Modal */}
        {isOpenQuickLog && (
          <IonModal
            isOpen={true}
            onDidDismiss={() => {
              setIsOpenQuickLog(false);
              setQuickInput("");
              setQuickLogDate(getLocalISODatetime());
            }}
            style={{
              "--background": "rgba(8, 11, 17, 0.65)",
              "--backdrop-opacity": "0.7",
              "--height": "auto",
              "--width": "100%",
              "--max-width": "440px",
              "--border-radius": "24px",
              "--box-shadow": "0 25px 50px -12px rgba(0,0,0,0.5)",
              "align-items": "center",
              "justify-content": "center",
              display: "flex",
            }}
          >
            <div className="glassmorphism rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col gap-5 bg-slate-900/95 max-w-sm w-full mx-auto my-auto animate-scale-up">
              {/* Glowing emerald blob */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none" />

              <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-[9px] font-black tracking-widest uppercase border border-emerald-500/20">
                    Speedy Log
                  </span>
                  <button
                    onClick={() => {
                      setIsOpenQuickLog(false);
                      setQuickInput("");
                    }}
                    className="p-1.5 rounded-xl rounded-btn-square bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex"
                  >
                    <IonIcon icon={closeOutline} className="w-4 h-4 block" />
                  </button>
                </div>
                <h3 className="text-base font-extrabold text-white tracking-tight font-['Outfit'] mt-1.5">
                  Quick Expense Logger
                </h3>
              </div>

              <form
                onSubmit={handleQuickAddExpense}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <IonItem
                    lines="none"
                    className="rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                    style={{
                      "--background": "transparent",
                      "--inner-padding-end": "0px",
                      "--padding-start": "0px",
                    }}
                  >
                    <IonInput
                      ref={quickInputRef}
                      type="text"
                      required
                      placeholder="Type e.g., 'Starbucks 120' or 'Gas 500'"
                      value={quickInput}
                      onIonInput={(e) => setQuickInput(e.detail.value)}
                      className="px-4 py-2 text-white text-xs placeholder-slate-500 font-semibold"
                      style={{
                        "--padding-top": "12px",
                        "--padding-bottom": "12px",
                      }}
                    />
                  </IonItem>

                  {/* Dynamic visual preview pill inside form */}
                  {quickInput.trim() && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none select-none z-20">
                      {parsed.amount && (
                        <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold font-mono">
                          {formatCurrency(parsed.amount)}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-lg ${parsed.category.bgColor} ${parsed.category.textColor} border ${parsed.category.borderColor} text-[9px] font-bold`}
                      >
                        {parsed.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Transaction Date & Time Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                    Transaction Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={quickLogDate}
                    onChange={(e) => setQuickLogDate(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-emerald-500/60 focus:outline-none transition-all font-mono text-xs text-white rounded-2xl px-4 py-3 cursor-pointer"
                    style={{
                      colorScheme: "dark",
                      color: "#ffffff",
                    }}
                  />
                </div>

                {/* Manual Category Selection Override */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                    Category (Auto-Detected or Manual Override)
                  </label>
                  <IonItem
                    fill="none"
                    className="rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                    style={{
                      "--background": "transparent",
                      "--inner-padding-end": "0px",
                      "--padding-start": "0px",
                    }}
                  >
                    <div className="w-full px-3 py-0.5 font-semibold text-slate-200">
                      <IonSelect
                        value={selectedQuickCategory ? selectedQuickCategory.name : parsed.category.name}
                        onIonChange={(e) => {
                          const catName = e.detail.value;
                          const chosenCat = sortedCategoriesList.find(c => c.name === catName) || userCategories.Other;
                          setSelectedQuickCategory(chosenCat);
                        }}
                        interface="popover"
                        className="text-white text-xs font-sans"
                        style={{
                          "--padding-top": "6px",
                          "--padding-bottom": "6px",
                        }}
                      >
                        {sortedCategoriesList.map((cat) => (
                          <IonSelectOption key={cat.name} value={cat.name}>
                            {cat.name}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </div>
                  </IonItem>
                </div>

                <button
                  type="submit"
                  className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 uppercase tracking-wide font-extrabold text-xs"
                  style={{
                    background: "linear-gradient(to right, var(--theme-color), var(--color-teal-400))",
                    color: "#022c22",
                    padding: "12px 20px",
                    borderRadius: "16px",
                    border: "none",
                    minHeight: "44px",
                  }}
                >
                  <IonIcon
                    icon={addOutline}
                    className="w-4 h-4 stroke-[2.5]"
                    style={{ color: "#022c22" }}
                  />
                  <span>Log Transaction</span>
                </button>
              </form>

              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Pro-tip: Just type description and price. We'll automatically
                identify categories like{" "}
                <span className="text-violet-400 font-bold">Luxury</span> for
                "Starbucks",{" "}
                <span className="text-amber-400 font-bold">Groceries</span> for
                "Costco", or{" "}
                <span className="text-indigo-400 font-bold">Transport</span> for
                "Gas".
              </p>
            </div>
          </IonModal>
        )}

        {/* Sleek Category Drill-down Modal */}
        {selectedDetailCategory &&
          (() => {
            const catName = selectedDetailCategory;
            const catObj =
              Object.values(categories).find((c) => c.name === catName) ||
              categories.Other;
            const totalSpentInCat = categoryTotals[catName] || 0;
            const percentageOfSpent =
              totalSpent > 0 ? (totalSpentInCat / totalSpent) * 100 : 0;

            // Filter matching variable expenses & fixed bills
            const catExpenses = expenses.filter((e) => e.category === catName);
            const catFixed = fixedExpenses.filter(
              (fe) => fe.category === catName,
            );
            const hasItems = catExpenses.length > 0 || catFixed.length > 0;

            return (
              <IonModal
                isOpen={true}
                onDidDismiss={() => setSelectedDetailCategory(null)}
                style={{
                  "--background": "rgba(8, 11, 17, 0.65)",
                  "--backdrop-opacity": "0.7",
                  "--height": "auto",
                  "--width": "100%",
                  "--max-width": "440px",
                  "--border-radius": "24px",
                  "--box-shadow": "0 25px 50px -12px rgba(0,0,0,0.5)",
                  "align-items": "center",
                  "justify-content": "center",
                  display: "flex",
                }}
              >
                <div className="glassmorphism rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col gap-5 bg-slate-900/95 max-w-sm w-full mx-auto my-auto animate-scale-up">
                  {/* Theme-colored glowing background blob */}
                  <div
                    className={`absolute -top-10 -right-10 w-28 h-28 rounded-full ${
                      catName === "Groceries"
                        ? "bg-amber-500/10 blur-[50px]"
                        : catName === "Luxury"
                          ? "bg-violet-500/10 blur-[50px]"
                          : catName === "Shopping"
                            ? "bg-rose-500/10 blur-[50px]"
                            : catName === "Transport"
                              ? "bg-indigo-500/10 blur-[50px]"
                              : catName === "Utilities/Bills"
                                ? "bg-sky-500/10 blur-[50px]"
                                : "bg-slate-500/10 blur-[50px]"
                    } pointer-events-none`}
                  />

                  {/* Header Row */}
                  <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${catObj.bgColor} border ${catObj.borderColor} flex shrink-0`}
                        >
                          {getCategoryIcon(catName)}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-lg ${catObj.bgColor} ${catObj.textColor} border ${catObj.borderColor} text-[9px] font-black tracking-widest uppercase`}
                        >
                          Category Audit
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedDetailCategory(null)}
                        className="p-1.5 rounded-xl rounded-btn-square bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex"
                      >
                        <IonIcon
                          icon={closeOutline}
                          className="w-4 h-4 block"
                        />
                      </button>
                    </div>
                    <h3 className="text-base font-extrabold text-white tracking-tight font-['Outfit'] mt-1.5">
                      {catName}
                    </h3>
                  </div>

                  {/* Spending Metrics Card */}
                  <div className="rounded-2xl p-4 bg-slate-950/60 border border-white/5 flex flex-col gap-1">
                    <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">
                      Total Monthly Spending
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-white font-['Outfit']">
                        {formatCurrency(totalSpentInCat)}
                      </span>
                      <span
                        className={`text-xs font-black ${catObj.textColor}`}
                      >
                        {percentageOfSpent.toFixed(0)}% of total spent
                      </span>
                    </div>
                  </div>

                  {/* Integrated Items List */}
                  <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                    <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1 mb-1">
                      Logged Transactions
                    </div>

                    {!hasItems ? (
                      <div className="text-center py-8 flex flex-col items-center justify-center gap-2 bg-white/2 border border-white/5 rounded-2xl">
                        <div className="p-2 rounded-xl bg-white/3 border border-white/5 text-slate-600">
                          <IonIcon
                            icon={helpCircleOutline}
                            className="w-6 h-6 block"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          No Transactions Found
                        </p>
                        <p className="text-[9px] text-slate-400 italic px-4 font-semibold">
                          Add variable expenses or recurring bills under this
                          category to audit them here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Fixed Monthly Bills */}
                        {catFixed.map((bill) => (
                          <div
                            key={bill.id}
                            className="flex items-center justify-between bg-slate-950/30 border border-white/5 rounded-xl p-3 hover:border-emerald-500/20 transition-all"
                          >
                            <div>
                              <p className="text-xs font-bold text-white capitalize">
                                {bill.description}
                              </p>
                              <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5 flex items-center gap-1.5 tracking-wide">
                                <span className="px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-400 border border-sky-500/20 text-[8px] font-black uppercase tracking-wider">
                                  Recurring
                                </span>
                                <span>Due Day {bill.due_day}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-extrabold text-rose-400">
                                -{formatCurrency(bill.amount)}
                              </span>
                              <button
                                onClick={() =>
                                  handleDeleteFixedExpense(bill.id)
                                }
                                className="p-1.5 rounded-xl rounded-btn-square bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 active:scale-95 transition-all cursor-pointer flex"
                                title="Delete recurring bill"
                              >
                                <IonIcon
                                  icon={trashOutline}
                                  className="w-3.5 h-3.5 block"
                                />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Variable Daily Expenses */}
                        {catExpenses.map((expense) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between bg-slate-950/30 border border-white/5 rounded-xl p-3 hover:border-emerald-500/20 transition-all"
                          >
                            <div>
                              <p className="text-xs font-bold text-white capitalize">
                                {expense.description}
                              </p>
                              <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wide">
                                {new Date(
                                  expense.created_at || expense.date,
                                ).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                                ,{" "}
                                {new Date(
                                  expense.created_at || expense.date,
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-extrabold text-white">
                                -{formatCurrency(expense.amount)}
                              </span>
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="p-1.5 rounded-xl rounded-btn-square bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 active:scale-95 transition-all cursor-pointer flex"
                                title="Delete transaction"
                              >
                                <IonIcon
                                  icon={trashOutline}
                                  className="w-3.5 h-3.5 block"
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Close Footer Action */}
                  <div className="border-t border-white/5 pt-4 flex flex-col">
                    <button
                      onClick={() => setSelectedDetailCategory(null)}
                      className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10 text-white font-extrabold text-xs uppercase tracking-wide"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "12px 20px",
                        borderRadius: "16px",
                        minHeight: "44px",
                      }}
                    >
                      <span>Close Audit View</span>
                    </button>
                  </div>
                </div>
              </IonModal>
            );
          })()}
      </IonContent>

      {/* Pure Ionic Premium Sticky Bottom Navigation Tab Bar */}
      <IonTabBar
        slot="bottom"
        style={{
          "--background": "#080b11",
          "--border-color": "transparent",
          height: "64px",
          "border-top": "none",
        }}
      >
        <IonTabButton
          tab="home"
          onClick={() => {
            setActiveTab("home");
            setProfileView("profile");
          }}
          selected={activeTab === "home"}
          style={{ "--color-selected": "var(--theme-color)", "--color": "#64748b" }}
          className="transition-all"
        >
          <IonIcon
            icon={activeTab === "home" ? wallet : walletOutline}
            className="w-5 h-5"
          />
          <span className="text-[9px] font-extrabold uppercase tracking-wide mt-0.5">
            Home
          </span>
        </IonTabButton>

        <IonTabButton
          tab="cashflow"
          onClick={() => {
            setActiveTab("cashflow");
            setProfileView("profile");
          }}
          selected={activeTab === "cashflow"}
          style={{ "--color-selected": "var(--theme-color)", "--color": "#64748b" }}
          className="transition-all"
        >
          <IonIcon
            icon={activeTab === "cashflow" ? trendingUp : trendingUpOutline}
            className="w-5 h-5"
          />
          <span className="text-[9px] font-extrabold uppercase tracking-wide mt-0.5">
            Cash Flow
          </span>
        </IonTabButton>

        {/* Central Space Reserver Placeholder */}
        <IonTabButton
          tab="add-quick-log-placeholder"
          onClick={() => setIsOpenQuickLog(true)}
          style={{
            "--color": "transparent",
            "--color-selected": "transparent",
          }}
        >
          <div className="h-5 w-5 pointer-events-none mb-1 opacity-0" />
          <span className="text-[9px] font-extrabold uppercase tracking-wide text-slate-400 select-none">
            Add
          </span>
        </IonTabButton>

        <IonTabButton
          tab="history"
          onClick={() => {
            setActiveTab("history");
            setProfileView("profile");
          }}
          selected={activeTab === "history"}
          style={{ "--color-selected": "var(--theme-color)", "--color": "#64748b" }}
          className="transition-all"
        >
          <IonIcon
            icon={activeTab === "history" ? calendar : calendarOutline}
            className="w-5 h-5"
          />
          <span className="text-[9px] font-extrabold uppercase tracking-wide mt-0.5">
            History
          </span>
        </IonTabButton>

        <IonTabButton
          tab="profile"
          onClick={() => {
            setActiveTab("profile");
            setProfileView("profile");
          }}
          selected={activeTab === "profile"}
          style={{ "--color-selected": "var(--theme-color)", "--color": "#64748b" }}
          className="transition-all"
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] transition-all select-none border ${
              activeTab === "profile"
                ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 border-white/20 shadow-md shadow-emerald-500/20 scale-105"
                : "bg-slate-800 text-slate-400 border-white/5"
            }`}
          >
            {session?.user?.email ? session.user.email[0].toUpperCase() : "U"}
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-wide mt-0.5">
            Profile
          </span>
        </IonTabButton>
      </IonTabBar>

      {/* Real Floating Raised central button rendered outside tab-bar to guarantee NO shadow DOM clipping */}
      <button
        onClick={() => setIsOpenQuickLog(true)}
        className="fixed flex items-center justify-center shadow-lg shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all border border-white/10 z-[999] cursor-pointer"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          bottom: "35px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(to right, var(--theme-color), var(--color-teal-400))",
        }}
      >
        <IonIcon
          icon={add}
          className="w-6.5 h-6.5 text-slate-950 font-black"
          style={{ "--color": "#022c22" }}
        />
      </button>
    </IonPage>
  );
}
