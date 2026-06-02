import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { parseQuickInput, categories } from "../utils/categorizer";
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
  amber: "#fbbf24",
  violet: "#a78bfa",
  rose: "#f43f5e",
  indigo: "#818cf8",
  sky: "#38bdf8",
  emerald: "#34d399",
  slate: "#94a3b8",
};

function DailyConsumptionChart({ expenses, formatCurrency, currentMonthName }) {
  const [chartMode, setChartMode] = useState("daily"); // 'daily' or 'cumulative'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 1. Calculate active year & month dynamically
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // 2. Compute daily variable spending values
  const dailyValues = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const totalForDay = expenses
      .filter((exp) => {
        if (!exp.date) return false;
        // Parse date string safe from timezone shifts
        const parts = exp.date.split("-");
        if (parts.length < 3) return false;
        const expYear = parseInt(parts[0]);
        const expMonth = parseInt(parts[1]) - 1; // 0-indexed
        const expDay = parseInt(parts[2]);
        return expDay === day && expMonth === month && expYear === year;
      })
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    return { day, amount: totalForDay };
  });

  // 3. Compute cumulative values
  let runningSum = 0;
  const cumulativeValues = dailyValues.map((item) => {
    runningSum += item.amount;
    return { day: item.day, amount: runningSum };
  });

  const activeData = chartMode === "daily" ? dailyValues : cumulativeValues;

  // 4. SVG Dimensions & Padding
  const width = 500;
  const height = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;

  const gridWidth = width - paddingLeft - paddingRight;
  const gridHeight = height - paddingTop - paddingBottom;

  // 5. Scaling calculations
  const maxAmount = Math.max(...activeData.map((d) => d.amount), 100);

  // Grid coordinates for points
  const points = activeData.map((d, i) => {
    const x = paddingLeft + (i / (totalDays - 1)) * gridWidth;
    const y = paddingTop + gridHeight - (d.amount / maxAmount) * gridHeight;
    return { x, y, day: d.day, amount: d.amount };
  });

  // Construct SVG Line Path
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath =
      `M ${points[0].x} ${points[0].y} ` +
      points
        .slice(1)
        .map((p) => `L ${p.x} ${p.y}`)
        .join(" ");
    areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + gridHeight} L ${points[0].x} ${paddingTop + gridHeight} Z`;
  }

  // Generate gridline levels
  const gridLinesCount = 3;
  const gridLineHeights = Array.from({ length: gridLinesCount }, (_, i) => {
    const ratio = i / (gridLinesCount - 1);
    const y = paddingTop + ratio * gridHeight;
    const value = maxAmount - ratio * maxAmount;
    return { y, value };
  });

  // X Axis markers (say every 5 days: 1, 5, 10, 15, 20, 25, 30/31)
  const xMarkers = [];
  const step = 5;
  for (let i = 1; i <= totalDays; i += step) {
    xMarkers.push(i);
  }
  if (xMarkers[xMarkers.length - 1] !== totalDays) {
    xMarkers.push(totalDays);
  }

  // Month names for labels
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const displayMonth = monthNames[month];

  return (
    <IonCard className="glassmorphism rounded-3xl p-5 mx-0 border border-white/5 bg-slate-950/20 shadow-xl relative overflow-hidden flex flex-col gap-4">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-3">
        <div>
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            Spending Trends
          </div>
          <h3 className="text-base font-extrabold text-white tracking-tight font-['Outfit'] mt-0.5">
            {chartMode === "daily"
              ? "Daily Variable Consumption"
              : "Cumulative Spending Over Month"}
          </h3>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/5 self-start shrink-0">
          <button
            onClick={() => {
              setChartMode("daily");
              setHoveredIndex(null);
            }}
            className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              chartMode === "daily"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => {
              setChartMode("cumulative");
              setHoveredIndex(null);
            }}
            className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              chartMode === "cumulative"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cumulative
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[500/220] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Emerald Fill Gradient */}
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            {/* Glow Filter for Active Nodes */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Horizontal Y-Axis Gridlines and Labels */}
          {gridLineHeights.map((line, idx) => (
            <g key={idx} className="opacity-40">
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={width - paddingRight}
                y2={line.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={line.y + 3.5}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="700"
                fontFamily="'Outfit', sans-serif"
                textAnchor="end"
              >
                {formatCurrency(line.value)}
              </text>
            </g>
          ))}

          {/* 2. X-Axis Gridlines and Markers */}
          {xMarkers.map((day, idx) => {
            const x = paddingLeft + ((day - 1) / (totalDays - 1)) * gridWidth;
            return (
              <g key={idx}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + gridHeight}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={paddingTop + gridHeight + 16}
                  fill="#64748b"
                  fontSize="9"
                  fontWeight="800"
                  fontFamily="'Outfit', sans-serif"
                  textAnchor="middle"
                >
                  {day}
                </text>
              </g>
            );
          })}

          {/* 3. Render Area Path */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#chartAreaGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* 4. Render Stroke Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* 5. Hover pointer vertical dashed line and glowing dot */}
          {hoveredIndex !== null &&
            points[hoveredIndex] &&
            (() => {
              const p = points[hoveredIndex];
              return (
                <g className="animate-fade-in pointer-events-none">
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={paddingTop + gridHeight}
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  {/* Glowing Outer Node */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="6"
                    fill="#10b981"
                    opacity="0.4"
                    filter="url(#neonGlow)"
                  />
                  {/* Core White/Green Node */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    fill="#ffffff"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                </g>
              );
            })()}

          {/* 6. Transparent interactive hover rectangles for perfect responsive cursor tracking */}
          {points.map((p, idx) => {
            const stepWidth = gridWidth / (totalDays - 1);
            const clickWidth = Math.max(stepWidth, 12);
            return (
              <rect
                key={idx}
                x={p.x - clickWidth / 2}
                y={paddingTop}
                width={clickWidth}
                height={gridHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(idx)}
              />
            );
          })}
        </svg>

        {/* 7. Float Glassmorphism Tooltip Card */}
        {hoveredIndex !== null &&
          points[hoveredIndex] &&
          (() => {
            const p = points[hoveredIndex];

            // Tooltip position offsets
            const tooltipLeft = `${(p.x / width) * 100}%`;
            const tooltipY = `${(p.y / height) * 100}%`;

            return (
              <div
                className="absolute -translate-x-1/2 -translate-y-full bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-xl shadow-2xl flex flex-col gap-0.5 pointer-events-none select-none z-50 text-[10px] glassmorphism"
                style={{
                  left: tooltipLeft,
                  top: `calc(${tooltipY} - 12px)`,
                  minWidth: "92px",
                }}
              >
                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest">
                  {displayMonth} {p.day}
                </span>
                <span className="text-white font-extrabold font-['Outfit'] text-xs">
                  {formatCurrency(p.amount)}
                </span>
                <span className="text-[7px] text-emerald-400 font-black uppercase tracking-wider">
                  {chartMode === "daily" ? "Daily Variable" : "Running Total"}
                </span>
              </div>
            );
          })()}
      </div>

      {/* Footer statistics summary card */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-3 rounded-2xl border border-white/5 text-[10px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-400 font-extrabold uppercase tracking-wider">
            Total Month Spending
          </span>
          <span className="text-sm font-extrabold text-white font-['Outfit']">
            {formatCurrency(
              expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
            )}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span className="text-slate-400 font-extrabold uppercase tracking-wider">
            Peak Daily Expense
          </span>
          <span className="text-sm font-extrabold text-emerald-400 font-['Outfit']">
            {formatCurrency(Math.max(...dailyValues.map((v) => v.amount), 0))}
          </span>
        </div>
      </div>
    </IonCard>
  );
}

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

  // Expense Editing States
  const [editingExpense, setEditingExpense] = useState(null);
  const [editExpenseDesc, setEditExpenseDesc] = useState("");
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseCategory, setEditExpenseCategory] = useState("Other");
  const [editExpenseDate, setEditExpenseDate] = useState("");
  const [selectedQuickCategory, setSelectedQuickCategory] = useState(null);

  // Regular Income editors
  const [isAddingBaseline, setIsAddingBaseline] = useState(false);
  const [newBaselineDesc, setNewBaselineDesc] = useState("");
  const [newBaselineAmount, setNewBaselineAmount] = useState("");
  const [newBaselineDay, setNewBaselineDay] = useState("1");

  // Inline Baseline Income editing states
  const [editingBaselineId, setEditingBaselineId] = useState(null);
  const [editBaselineDesc, setEditBaselineDesc] = useState("");
  const [editBaselineAmount, setEditBaselineAmount] = useState("");
  const [editBaselineDay, setEditBaselineDay] = useState("1");

  // Fixed Monthly Bills editors
  const [isAddingFixed, setIsAddingFixed] = useState(false);
  const [newFixedDesc, setNewFixedDesc] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");
  const [newFixedDay, setNewFixedDay] = useState("1");
  const [newFixedCategory, setNewFixedCategory] = useState("Utilities/Bills");

  // Inline Fixed Bill editing states
  const [editingFixedId, setEditingFixedId] = useState(null);
  const [editFixedDesc, setEditFixedDesc] = useState("");
  const [editFixedAmount, setEditFixedAmount] = useState("");
  const [editFixedDay, setEditFixedDay] = useState("1");
  const [editFixedCategory, setEditFixedCategory] = useState("Utilities/Bills");

  // Local ISO datetime helper YYYY-MM-DDTHH:mm
  const getLocalISODatetime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now - tzOffset).toISOString().slice(0, 16);
  };

  // Additional Income editors
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [additionalAmount, setAdditionalAmount] = useState("");
  const [additionalDesc, setAdditionalDesc] = useState("");
  const [additionalDate, setAdditionalDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Quick Expense input
  const [quickInput, setQuickInput] = useState("");
  const [quickLogDate, setQuickLogDate] = useState(getLocalISODatetime());
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionCategoryFilter, setTransactionCategoryFilter] =
    useState("all");
  const [transactionDateFilter, setTransactionDateFilter] = useState("all");
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
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catEditName.trim()) return;

    const key = catEditName.trim();
    if (key.toLowerCase() === "other") {
      showModal(
        "Action Blocked",
        'You cannot create or overwrite a category named "Other" as it is reserved by the system.',
        "warning",
      );
      return;
    }

    const cleanKeywords = catEditKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);

    const existingOrder = editingCatKey ? (userCategories[editingCatKey]?.display_order || 0) : (Object.keys(userCategories).length * 10);

    const newCatObj = {
      name: key,
      color: catEditColor,
      textColor: `text-${catEditColor}-400`,
      bgColor: `bg-${catEditColor}-400/10`,
      borderColor: `border-${catEditColor}-400/20`,
      gradientFrom: `from-${catEditColor}-400/20`,
      keywords: cleanKeywords,
      icon: catEditIcon,
      display_order: existingOrder,
    };

    try {
      if (editingCatKey) {
        // If they renamed it, delete the old one first
        if (editingCatKey !== key) {
          const { error: delError } = await supabase
            .from("custom_categories")
            .delete()
            .eq("user_id", session.user.id)
            .eq("name", editingCatKey);
          if (delError) throw delError;
        }
      }

      // Upsert the new one
      const { error: upsertError } = await supabase
        .from("custom_categories")
        .upsert({
          user_id: session.user.id,
          name: key,
          color: catEditColor,
          icon: catEditIcon,
          keywords: cleanKeywords,
          display_order: existingOrder,
        });

      if (upsertError) {
        if (
          upsertError.message &&
          upsertError.message.includes(
            'relation "public.custom_categories" does not exist',
          )
        ) {
          triggerMigrationModal();
          return;
        }
        throw upsertError;
      }

      const updated = { ...userCategories };
      if (editingCatKey && editingCatKey !== key) {
        delete updated[editingCatKey];
      }
      updated[key] = newCatObj;
      setUserCategories(updated);

      // Reset Form
      setCatEditName("");
      setCatEditColor("emerald");
      setCatEditIcon("cashOutline");
      setCatEditKeywords("");
      setEditingCatKey(null);
    } catch (err) {
      console.error("Error saving category to Supabase:", err);
      showModal(
        "Error Saving Category",
        "An error occurred while saving your category. Please try again.",
        "error",
      );
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

      // If we were editing this deleted category, reset edit form
      if (editingCatKey === catName) {
        setCatEditName("");
        setCatEditColor("emerald");
        setCatEditIcon("cashOutline");
        setCatEditKeywords("");
        setEditingCatKey(null);
      }
    } catch (err) {
      console.error("Error deleting category from Supabase:", err);
      showModal(
        "Error Deleting Category",
        "Could not remove your custom category. Please try again.",
        "error",
      );
    }
  };

  const handleStartEditCategory = (catName) => {
    const cat = userCategories[catName];
    if (!cat) return;
    setEditingCatKey(catName);
    setCatEditName(cat.name);
    setCatEditColor(cat.color || "emerald");
    setCatEditIcon(cat.icon || "cashOutline");
    setCatEditKeywords(cat.keywords ? cat.keywords.join(", ") : "");
  };

  const handleCancelEditCategory = () => {
    setCatEditName("");
    setCatEditColor("emerald");
    setCatEditIcon("cashOutline");
    setCatEditKeywords("");
    setEditingCatKey(null);
  };

  const handleMoveCategory = async (key, direction) => {
    const orderedKeys = Object.keys(userCategories).sort(
      (a, b) => (userCategories[a].display_order || 0) - (userCategories[b].display_order || 0)
    );

    const index = orderedKeys.indexOf(key);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedKeys.length) return;

    const newOrderedKeys = [...orderedKeys];
    newOrderedKeys[index] = orderedKeys[targetIndex];
    newOrderedKeys[targetIndex] = orderedKeys[index];

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
  const handleAddBaselineIncome = async (e) => {
    e.preventDefault();
    const amount = parseFloat(newBaselineAmount);
    const day = parseInt(newBaselineDay);
    const desc = newBaselineDesc.trim();

    if (isNaN(amount) || amount <= 0 || !desc) {
      showModal(
        "Invalid Input",
        "Please enter a description and a valid amount.",
        "warning",
      );
      return;
    }
    if (isNaN(day) || day < 1 || day > 31) {
      showModal(
        "Invalid Transfer Day",
        "Transfer day of the month must be between 1 and 31.",
        "warning",
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from("baseline_income")
        .insert([
          {
            user_id: session.user.id,
            amount,
            description: desc,
            transfer_day: day,
          },
        ])
        .select()
        .single();

      if (error) {
        if (
          error.message &&
          error.message.includes(
            'relation "public.baseline_income" does not exist',
          )
        ) {
          triggerMigrationModal();
        } else {
          throw error;
        }
      } else {
        setBaselineIncomes((prev) =>
          [...prev, data].sort((a, b) => a.transfer_day - b.transfer_day),
        );
        setNewBaselineDesc("");
        setNewBaselineAmount("");
        setNewBaselineDay("1");
        setIsAddingBaseline(false);
      }
    } catch (err) {
      console.error("Error adding baseline income:", err);
      showModal(
        "Error Adding Regular Income",
        "Could not save the new baseline income source. Please check your database tables.",
        "error",
      );
    }
  };

  // Start editing baseline income source
  const handleStartEditBaseline = (income) => {
    setEditingBaselineId(income.id);
    setEditBaselineDesc(income.description);
    setEditBaselineAmount(income.amount.toString());
    setEditBaselineDay(income.transfer_day.toString());
  };

  // Save baseline income source edit
  const handleSaveEditBaseline = async (e, id) => {
    e.preventDefault();
    const amount = parseFloat(editBaselineAmount);
    const day = parseInt(editBaselineDay);
    const desc = editBaselineDesc.trim();

    if (isNaN(amount) || amount <= 0 || !desc) {
      showModal(
        "Invalid Input",
        "Please enter a description and a valid amount.",
        "warning",
      );
      return;
    }
    if (isNaN(day) || day < 1 || day > 31) {
      showModal(
        "Invalid Transfer Day",
        "Transfer day of the month must be between 1 and 31.",
        "warning",
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from("baseline_income")
        .update({
          amount,
          description: desc,
          transfer_day: day,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setBaselineIncomes((prev) =>
        prev
          .map((item) => (item.id === id ? data : item))
          .sort((a, b) => a.transfer_day - b.transfer_day),
      );
      setEditingBaselineId(null);
    } catch (err) {
      console.error("Error saving regular income edit:", err);
      showModal(
        "Error Saving Edit",
        "Could not save your changes. Please try again.",
        "error",
      );
    }
  };

  // Delete baseline income source
  const handleDeleteBaselineIncome = async (id) => {
    try {
      const { error } = await supabase
        .from("baseline_income")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setBaselineIncomes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting baseline income:", err);
      showModal(
        "Error Deleting Source",
        "Could not remove the regular income source. Please try again.",
        "error",
      );
    }
  };

  // Add Fixed monthly expense
  const handleAddFixedExpense = async (e) => {
    e.preventDefault();
    const amount = parseFloat(newFixedAmount);
    const day = parseInt(newFixedDay);
    const desc = newFixedDesc.trim();

    if (isNaN(amount) || amount <= 0 || !desc) {
      showModal(
        "Invalid Input",
        "Please enter a description and a valid amount.",
        "warning",
      );
      return;
    }
    if (isNaN(day) || day < 1 || day > 31) {
      showModal(
        "Invalid Due Day",
        "Due day of the month must be between 1 and 31.",
        "warning",
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from("fixed_expenses")
        .insert([
          {
            user_id: session.user.id,
            amount,
            description: desc,
            category: newFixedCategory,
            due_day: day,
          },
        ])
        .select()
        .single();

      if (error) {
        if (
          error.message &&
          error.message.includes(
            'relation "public.fixed_expenses" does not exist',
          )
        ) {
          triggerMigrationModal();
        } else {
          throw error;
        }
      } else {
        setFixedExpenses((prev) =>
          [...prev, data].sort((a, b) => a.due_day - b.due_day),
        );
        setNewFixedDesc("");
        setNewFixedAmount("");
        setNewFixedDay("1");
        setIsAddingFixed(false);
      }
    } catch (err) {
      console.error("Error adding fixed expense:", err);
      showModal(
        "Error Adding Fixed Bill",
        "Could not save the new recurring bill. Please check your database tables.",
        "error",
      );
    }
  };

  // Start editing fixed monthly bill
  const handleStartEditFixed = (bill) => {
    setEditingFixedId(bill.id);
    setEditFixedDesc(bill.description);
    setEditFixedAmount(bill.amount.toString());
    setEditFixedDay(bill.due_day.toString());
    setEditFixedCategory(bill.category);
  };

  // Save fixed monthly bill edit
  const handleSaveEditFixed = async (e, id) => {
    e.preventDefault();
    const amount = parseFloat(editFixedAmount);
    const day = parseInt(editFixedDay);
    const desc = editFixedDesc.trim();

    if (isNaN(amount) || amount <= 0 || !desc) {
      showModal(
        "Invalid Input",
        "Please enter a description and a valid amount.",
        "warning",
      );
      return;
    }
    if (isNaN(day) || day < 1 || day > 31) {
      showModal(
        "Invalid Due Day",
        "Due day of the month must be between 1 and 31.",
        "warning",
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from("fixed_expenses")
        .update({
          amount,
          description: desc,
          due_day: day,
          category: editFixedCategory,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setFixedExpenses((prev) =>
        prev
          .map((item) => (item.id === id ? data : item))
          .sort((a, b) => a.due_day - b.due_day),
      );
      setEditingFixedId(null);
    } catch (err) {
      console.error("Error saving fixed bill edit:", err);
      showModal(
        "Error Saving Edit",
        "Could not save your changes. Please try again.",
        "error",
      );
    }
  };

  // Delete fixed expense source
  const handleDeleteFixedExpense = async (id) => {
    try {
      const { error } = await supabase
        .from("fixed_expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setFixedExpenses((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting fixed expense:", err);
      showModal(
        "Error Deleting Bill",
        "Could not remove the recurring bill. Please try again.",
        "error",
      );
    }
  };

  // Add additional income
  const handleAddAdditionalIncome = async (e) => {
    e.preventDefault();
    const amount = parseFloat(additionalAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      const { data, error } = await supabase
        .from("additional_income")
        .insert([
          {
            user_id: session.user.id,
            amount,
            description: additionalDesc.trim() || "Additional Income",
            date: additionalDate || new Date().toISOString().split("T")[0],
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setAdditionalIncome((prev) => [data, ...prev]);
      setAdditionalAmount("");
      setAdditionalDesc("");
      setIsAddingIncome(false);
    } catch (err) {
      console.error("Error adding additional income:", err);
      showModal(
        "Error Logging Income",
        "An error occurred while saving your additional income. Please try again.",
        "error",
      );
    }
  };

  // Delete additional income
  const handleDeleteAdditionalIncome = async (id) => {
    try {
      const { error } = await supabase
        .from("additional_income")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      if (error) throw error;
      setAdditionalIncome((prev) => prev.filter((income) => income.id !== id));
    } catch (err) {
      console.error("Error deleting additional income:", err);
      showModal(
        "Error Deleting Income",
        "Could not delete the selected income entry. Please try again.",
        "error",
      );
    }
  };

  // Start editing expense
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

  const filteredExpenses = expenses.filter((expense) => {
    const query = transactionSearch.trim().toLowerCase();
    const expenseDate = new Date(expense.created_at || expense.date);
    const now = new Date();

    const matchesSearch =
      !query ||
      expense.description?.toLowerCase().includes(query) ||
      expense.category?.toLowerCase().includes(query) ||
      String(expense.amount).includes(query);

    const matchesCategory =
      transactionCategoryFilter === "all" ||
      expense.category === transactionCategoryFilter;

    let matchesDate = true;
    if (transactionDateFilter === "today") {
      matchesDate = expenseDate.toDateString() === now.toDateString();
    } else if (transactionDateFilter === "week") {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      matchesDate = expenseDate >= sevenDaysAgo;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const hasTransactionFilters =
    transactionSearch.trim() ||
    transactionCategoryFilter !== "all" ||
    transactionDateFilter !== "all";

  const resetTransactionFilters = () => {
    setTransactionSearch("");
    setTransactionCategoryFilter("all");
    setTransactionDateFilter("all");
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
                  className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-white active:scale-95"
                  aria-label="Go back"
                >
                  <IonIcon icon={arrowBackOutline} className="h-4.5 w-4.5" />
                </button>
              ) : (
                <IonIcon
                  icon={walletOutline}
                  className="h-5 w-5 shrink-0 text-emerald-400"
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
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <IonSpinner
                name="crescent"
                className="w-8 h-8 text-emerald-400"
              />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Retrieving Accounts...
              </p>
            </div>
          ) : (
            <>
              {/* Decorative Blur Blobs */}
              <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
              <div className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

              {/* 1. HOME TAB */}
              {activeTab === "home" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Remaining Budget card */}
                  <IonCard className="glassmorphism rounded-3xl p-5 mx-0 relative overflow-hidden shadow-xl border border-white/5 bg-slate-950/20">
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] pointer-events-none opacity-20 transition-all ${
                        remainingBudget > totalBudget * 0.5
                          ? "bg-emerald-500"
                          : remainingBudget > totalBudget * 0.2
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }`}
                    />

                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-200 text-[10px] font-bold tracking-wider uppercase mb-1">
                          <IonIcon
                            icon={calendarOutline}
                            className="w-3.5 h-3.5"
                          />
                          <span>Remaining Budget — {currentMonthName}</span>
                        </div>
                        <div
                          className={`text-4xl font-extrabold tracking-tight font-['Outfit'] transition-all ${
                            remainingBudget < 0 ? "text-rose-400" : "text-white"
                          }`}
                        >
                          {formatCurrency(remainingBudget)}
                        </div>
                        <div className="mt-2 text-[11px] text-slate-200 flex items-center gap-1.5 font-medium">
                          <span>Spent</span>
                          <span className="text-white font-semibold">
                            {formatCurrency(totalSpent)}
                          </span>
                          <span>of</span>
                          <span className="text-emerald-400 font-semibold">
                            {formatCurrency(totalBudget)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`self-start px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          remainingBudget > totalBudget * 0.5
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : remainingBudget > totalBudget * 0.2
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {remainingBudget > totalBudget * 0.5
                          ? "Healthy Budget"
                          : remainingBudget > totalBudget * 0.2
                            ? "Caution Alert"
                            : remainingBudget > 0
                              ? "Critically Low"
                              : "Budget Overdrawn"}
                      </div>
                    </div>

                    {/* Stacked indicator bars */}
                    <div className="mt-5 space-y-2">
                      <div
                        className="w-full bg-slate-950/90 rounded-full overflow-hidden flex border border-white/10 p-0.5"
                        style={{ height: "18px" }}
                      >
                        {categoryMap.map((cat) => {
                          const amount = categoryTotals[cat.name] || 0;
                          if (amount === 0 || totalBudget === 0) return null;
                          const widthPercent = (amount / totalBudget) * 100;
                          return (
                            <div
                              key={cat.key}
                              style={{
                                width: `${widthPercent}%`,
                                backgroundColor: getCategoryColor(cat.name),
                                borderRadius: "9999px",
                              }}
                              className="h-full transition-all"
                              title={`${cat.name}: ${formatCurrency(amount)} (${widthPercent.toFixed(1)}%)`}
                            />
                          );
                        })}
                        {remainingBudget > 0 && totalBudget > 0 && (
                          <div
                            style={{
                              width: `${remainingPercentage}%`,
                              background:
                                "repeating-linear-gradient(-45deg, rgba(16, 185, 129, 0.45), rgba(16, 185, 129, 0.45) 6px, rgba(16, 185, 129, 0.18) 6px, rgba(16, 185, 129, 0.18) 12px)",
                              borderRadius: "9999px",
                              marginLeft: "2px",
                            }}
                            className="h-full transition-all"
                            title={`Remaining: ${formatCurrency(remainingBudget)} (${remainingPercentage.toFixed(1)}%)`}
                          />
                        )}
                      </div>
                    </div>
                  </IonCard>

                  {/* Category Breakdown list */}
                  <IonCard className="glassmorphism rounded-3xl p-5 mx-0 border border-white/5 bg-slate-950/20">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                      Category Expenditures
                    </h3>
                    <div className="space-y-1">
                      {categoryMap.map((cat) => {
                        const amount = categoryTotals[cat.name] || 0;
                        const percent =
                          totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                        return (
                          <div
                            key={cat.key}
                            onClick={() => setSelectedDetailCategory(cat.name)}
                            className="group relative cursor-pointer hover:bg-white/3 active:scale-[0.99] py-1 px-2.5 -mx-2.5 rounded-2xl transition-all border border-transparent hover:border-white/5"
                            title={`Audit ${cat.name} expenses`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-1 rounded-lg ${cat.bgColor || "bg-slate-500/10"} border ${cat.borderColor || "border-slate-500/20"} flex`}
                                >
                                  {getCategoryIcon(cat.name)}
                                </div>
                                <span className="font-semibold text-slate-200">
                                  {cat.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-white">
                                  {formatCurrency(amount)}
                                </span>
                                <span className="text-[9px] text-slate-300 font-bold ml-1.5">
                                  ({percent.toFixed(0)}%)
                                </span>
                              </div>
                            </div>
                            <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                              <div
                                style={{ width: `${percent}%` }}
                                className={`h-full ${cat.bgColor ? "bg-" + cat.color + "-400" : "bg-slate-400"} rounded-full transition-all`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </IonCard>
                </div>
              )}

              {/* 2. CASH FLOW TAB */}
              {activeTab === "cashflow" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Baseline Income (Regular Monthly Incomes) */}
                  <IonCard className="glassmorphism rounded-3xl p-5 mx-0 border border-white/5 bg-slate-950/20">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <div className="text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                          Baseline Income (Regular)
                        </div>
                        <span className="text-2xl font-extrabold text-white mt-0.5 block font-['Outfit']">
                          {formatCurrency(totalBaseline)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase mt-1 block tracking-wider">
                          {formatCurrency(totalBaselineConfigured)} configured
                          monthly
                        </span>
                      </div>
                      <button
                        onClick={() => setIsAddingBaseline(!isAddingBaseline)}
                        className="flex items-center justify-center border border-white/5 shadow-md hover:scale-105 active:scale-95 transition-all select-none cursor-pointer"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background: isAddingBaseline
                            ? "linear-gradient(to top right, #f43f5e, #fb7185)"
                            : "linear-gradient(to top right, #10b981, #2dd4bf)",
                          boxShadow: isAddingBaseline
                            ? "0 4px 6px -1px rgba(244, 63, 94, 0.15)"
                            : "0 4px 6px -1px rgba(16, 185, 129, 0.15)",
                        }}
                      >
                        <IonIcon
                          icon={isAddingBaseline ? closeOutline : addOutline}
                          className="w-4 h-4 block"
                          style={{
                            color: isAddingBaseline ? "#4c0519" : "#022c22",
                          }}
                        />
                      </button>
                    </div>

                    {isAddingBaseline && (
                      <form
                        onSubmit={handleAddBaselineIncome}
                        className="space-y-3 pt-3 border-b border-white/5 pb-4 animate-fade-in"
                      >
                        <IonItem
                          fill="none"
                          className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                          style={{
                            "--background": "transparent",
                            "--inner-padding-end": "0px",
                            "--padding-start": "0px",
                          }}
                        >
                          <IonInput
                            type="text"
                            required
                            placeholder="Source Description (e.g. PT Programming)"
                            value={newBaselineDesc}
                            onIonInput={(e) =>
                              setNewBaselineDesc(e.detail.value)
                            }
                            className="px-3 text-white text-xs placeholder-slate-500"
                            style={{
                              "--padding-top": "10px",
                              "--padding-bottom": "10px",
                            }}
                          />
                        </IonItem>

                        <div className="grid grid-cols-2 gap-2">
                          <IonItem
                            fill="none"
                            className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                            style={{
                              "--background": "transparent",
                              "--inner-padding-end": "0px",
                              "--padding-start": "0px",
                            }}
                          >
                            <IonInput
                              type="number"
                              required
                              placeholder="Amount (NTD)"
                              value={newBaselineAmount}
                              onIonInput={(e) =>
                                setNewBaselineAmount(e.detail.value)
                              }
                              className="px-3 text-white text-xs placeholder-slate-500"
                              style={{
                                "--padding-top": "10px",
                                "--padding-bottom": "10px",
                              }}
                            />
                          </IonItem>

                          <IonItem
                            fill="none"
                            className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                            style={{
                              "--background": "transparent",
                              "--inner-padding-end": "0px",
                              "--padding-start": "0px",
                            }}
                          >
                            <IonInput
                              type="number"
                              min="1"
                              max="31"
                              required
                              placeholder="Transfer Day (1-31)"
                              value={newBaselineDay}
                              onIonInput={(e) =>
                                setNewBaselineDay(e.detail.value)
                              }
                              className="px-3 text-white text-xs placeholder-slate-500 font-mono"
                              style={{
                                "--padding-top": "10px",
                                "--padding-bottom": "10px",
                              }}
                            />
                          </IonItem>
                        </div>

                        <button
                          type="submit"
                          className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 uppercase tracking-wide font-extrabold text-xs"
                          style={{
                            background:
                              "linear-gradient(to right, #10b981, #14b8a6)",
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
                          <span>Add Baseline Income</span>
                        </button>
                      </form>
                    )}

                    {baselineIncomes.length === 0 ? (
                      <p className="text-[11px] text-slate-500 font-semibold leading-normal italic text-center py-4">
                        No baseline income sources configured. Click add to
                        setup.
                      </p>
                    ) : (
                      <div className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1">
                        {baselineIncomes.map((income) => (
                          <div key={income.id}>
                            {editingBaselineId === income.id ? (
                              <form
                                onSubmit={(e) =>
                                  handleSaveEditBaseline(e, income.id)
                                }
                                className="space-y-2.5 bg-slate-950/50 border border-emerald-500/20 rounded-2xl p-3 animate-fade-in"
                              >
                                <IonItem
                                  fill="none"
                                  className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-xs text-white"
                                  style={{
                                    "--background": "transparent",
                                    "--inner-padding-end": "0px",
                                    "--padding-start": "0px",
                                  }}
                                >
                                  <IonInput
                                    type="text"
                                    required
                                    value={editBaselineDesc}
                                    onIonInput={(e) =>
                                      setEditBaselineDesc(e.detail.value)
                                    }
                                    className="px-2.5 text-white text-xs"
                                    style={{
                                      "--padding-top": "8px",
                                      "--padding-bottom": "8px",
                                    }}
                                  />
                                </IonItem>
                                <div className="grid grid-cols-2 gap-2">
                                  <IonItem
                                    fill="none"
                                    className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-xs text-white"
                                    style={{
                                      "--background": "transparent",
                                      "--inner-padding-end": "0px",
                                      "--padding-start": "0px",
                                    }}
                                  >
                                    <IonInput
                                      type="number"
                                      required
                                      value={editBaselineAmount}
                                      onIonInput={(e) =>
                                        setEditBaselineAmount(e.detail.value)
                                      }
                                      className="px-2.5 text-white text-xs"
                                      style={{
                                        "--padding-top": "8px",
                                        "--padding-bottom": "8px",
                                      }}
                                    />
                                  </IonItem>
                                  <IonItem
                                    fill="none"
                                    className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-xs text-white"
                                    style={{
                                      "--background": "transparent",
                                      "--inner-padding-end": "0px",
                                      "--padding-start": "0px",
                                    }}
                                  >
                                    <IonInput
                                      type="number"
                                      min="1"
                                      max="31"
                                      required
                                      value={editBaselineDay}
                                      onIonInput={(e) =>
                                        setEditBaselineDay(e.detail.value)
                                      }
                                      className="px-2.5 text-white text-xs font-mono"
                                      style={{
                                        "--padding-top": "8px",
                                        "--padding-bottom": "8px",
                                      }}
                                    />
                                  </IonItem>
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingBaselineId(null)}
                                    className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                                  >
                                    <IonIcon
                                      icon={closeOutline}
                                      className="w-4 h-4"
                                    />
                                  </button>
                                  <button
                                    type="submit"
                                    className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold"
                                  >
                                    <IonIcon
                                      icon={checkmarkOutline}
                                      className="w-4 h-4 stroke-[2.5]"
                                    />
                                  </button>
                                </div>
                              </form>
                            ) : (
                              (() => {
                                const isReceived =
                                  parseInt(income.transfer_day) <= currentDay;
                                return (
                                  <div className="flex items-center justify-between group bg-white/2 border border-white/5 rounded-xl p-3 hover:border-emerald-500/20 transition-all">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-white capitalize">
                                          {income.description}
                                        </p>
                                        {isReceived ? (
                                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black uppercase tracking-wider">
                                            Received
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.2 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[8px] font-black uppercase tracking-wider">
                                            Pending
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[9px] text-slate-300 font-extrabold uppercase mt-1 tracking-wide">
                                        Transfers Day {income.transfer_day} of
                                        month
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`text-xs font-extrabold ${isReceived ? "text-emerald-400" : "text-slate-400"}`}
                                      >
                                        {formatCurrency(income.amount)}
                                      </span>
                                      <div className="flex items-center gap-1 transition-all">
                                        <button
                                          onClick={() =>
                                            handleStartEditBaseline(income)
                                          }
                                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-white active:scale-95"
                                          aria-label={`Edit ${income.description}`}
                                          title="Edit"
                                        >
                                          <IonIcon
                                            icon={createOutline}
                                            className="h-3.5 w-3.5"
                                          />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteBaselineIncome(
                                              income.id,
                                            )
                                          }
                                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-rose-400 active:scale-95"
                                          aria-label={`Delete ${income.description}`}
                                          title="Delete"
                                        >
                                          <IonIcon
                                            icon={trashOutline}
                                            className="h-3.5 w-3.5"
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </IonCard>

                  {/* Fixed Monthly Bills */}
                  <IonCard className="glassmorphism rounded-3xl p-5 mx-0 border border-white/5 bg-slate-950/20">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <div className="text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                          Fixed Monthly Bills
                        </div>
                        <span className="text-2xl font-extrabold text-white mt-0.5 block font-['Outfit']">
                          {formatCurrency(totalFixedExpenses)}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsAddingFixed(!isAddingFixed)}
                        className="flex items-center justify-center border border-white/5 shadow-md hover:scale-105 active:scale-95 transition-all select-none cursor-pointer"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background: isAddingFixed
                            ? "linear-gradient(to top right, #f43f5e, #fb7185)"
                            : "linear-gradient(to top right, #10b981, #2dd4bf)",
                          boxShadow: isAddingFixed
                            ? "0 4px 6px -1px rgba(244, 63, 94, 0.15)"
                            : "0 4px 6px -1px rgba(16, 185, 129, 0.15)",
                        }}
                      >
                        <IonIcon
                          icon={isAddingFixed ? closeOutline : addOutline}
                          className="w-4 h-4 block"
                          style={{
                            color: isAddingFixed ? "#4c0519" : "#022c22",
                          }}
                        />
                      </button>
                    </div>

                    {isAddingFixed && (
                      <form
                        onSubmit={handleAddFixedExpense}
                        className="space-y-3 pt-3 border-b border-white/5 pb-4 animate-fade-in"
                      >
                        <IonItem
                          fill="none"
                          className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                          style={{
                            "--background": "transparent",
                            "--inner-padding-end": "0px",
                            "--padding-start": "0px",
                          }}
                        >
                          <IonInput
                            type="text"
                            required
                            placeholder="Bill Description (e.g. Rent, Electricity)"
                            value={newFixedDesc}
                            onIonInput={(e) => setNewFixedDesc(e.detail.value)}
                            className="px-3 text-white text-xs placeholder-slate-500"
                            style={{
                              "--padding-top": "10px",
                              "--padding-bottom": "10px",
                            }}
                          />
                        </IonItem>

                        <div className="grid grid-cols-2 gap-2">
                          <IonItem
                            fill="none"
                            className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                            style={{
                              "--background": "transparent",
                              "--inner-padding-end": "0px",
                              "--padding-start": "0px",
                            }}
                          >
                            <IonInput
                              type="number"
                              required
                              placeholder="Amount (NTD)"
                              value={newFixedAmount}
                              onIonInput={(e) =>
                                setNewFixedAmount(e.detail.value)
                              }
                              className="px-3 text-white text-xs placeholder-slate-500"
                              style={{
                                "--padding-top": "10px",
                                "--padding-bottom": "10px",
                              }}
                            />
                          </IonItem>

                          <IonItem
                            fill="none"
                            className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                            style={{
                              "--background": "transparent",
                              "--inner-padding-end": "0px",
                              "--padding-start": "0px",
                            }}
                          >
                            <IonInput
                              type="number"
                              min="1"
                              max="31"
                              required
                              placeholder="Due Day (1-31)"
                              value={newFixedDay}
                              onIonInput={(e) => setNewFixedDay(e.detail.value)}
                              className="px-3 text-white text-xs placeholder-slate-500 font-mono"
                              style={{
                                "--padding-top": "10px",
                                "--padding-bottom": "10px",
                              }}
                            />
                          </IonItem>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                            Category Group
                          </label>
                          <IonItem
                            fill="none"
                            className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                            style={{
                              "--background": "transparent",
                              "--padding-start": "0px",
                              "--inner-padding-end": "0px",
                            }}
                          >
                            <div className="w-full px-3 py-1 font-semibold text-slate-200">
                              <IonSelect
                                value={newFixedCategory}
                                onIonChange={(e) =>
                                  setNewFixedCategory(e.detail.value)
                                }
                                interface="popover"
                                className="text-white text-xs font-sans"
                                style={{
                                  "--padding-top": "6px",
                                  "--padding-bottom": "6px",
                                }}
                              >
                                {sortedCategoriesList.map((cat) => (
                                  <IonSelectOption
                                    key={cat.name}
                                    value={cat.name}
                                  >
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
                            background:
                              "linear-gradient(to right, #10b981, #14b8a6)",
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
                          <span>Add Recurring Bill</span>
                        </button>
                      </form>
                    )}

                    {fixedExpenses.length === 0 ? (
                      <p className="text-[11px] text-slate-500 font-semibold leading-normal italic text-center py-4">
                        No recurring bills configured. Click add to setup.
                      </p>
                    ) : (
                      <div className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1">
                        {fixedExpenses.map((bill) => {
                          const catObj =
                            Object.values(categories).find(
                              (c) => c.name === bill.category,
                            ) || categories.Other;
                          return (
                            <div key={bill.id}>
                              {editingFixedId === bill.id ? (
                                <form
                                  onSubmit={(e) =>
                                    handleSaveEditFixed(e, bill.id)
                                  }
                                  className="space-y-2.5 bg-slate-950/50 border border-rose-500/20 rounded-2xl p-3 animate-fade-in"
                                >
                                  <IonItem
                                    fill="none"
                                    className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-xs text-white"
                                    style={{
                                      "--background": "transparent",
                                      "--inner-padding-end": "0px",
                                      "--padding-start": "0px",
                                    }}
                                  >
                                    <IonInput
                                      type="text"
                                      required
                                      value={editFixedDesc}
                                      onIonInput={(e) =>
                                        setEditFixedDesc(e.detail.value)
                                      }
                                      className="px-2.5 text-white text-xs"
                                      style={{
                                        "--padding-top": "8px",
                                        "--padding-bottom": "8px",
                                      }}
                                    />
                                  </IonItem>
                                  <div className="grid grid-cols-2 gap-2">
                                    <IonItem
                                      fill="none"
                                      className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-xs text-white"
                                      style={{
                                        "--background": "transparent",
                                        "--inner-padding-end": "0px",
                                        "--padding-start": "0px",
                                      }}
                                    >
                                      <IonInput
                                        type="number"
                                        required
                                        value={editFixedAmount}
                                        onIonInput={(e) =>
                                          setEditFixedAmount(e.detail.value)
                                        }
                                        className="px-2.5 text-white text-xs"
                                        style={{
                                          "--padding-top": "8px",
                                          "--padding-bottom": "8px",
                                        }}
                                      />
                                    </IonItem>
                                    <IonItem
                                      fill="none"
                                      className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-xs text-white"
                                      style={{
                                        "--background": "transparent",
                                        "--inner-padding-end": "0px",
                                        "--padding-start": "0px",
                                      }}
                                    >
                                      <IonInput
                                        type="number"
                                        min="1"
                                        max="31"
                                        required
                                        value={editFixedDay}
                                        onIonInput={(e) =>
                                          setEditFixedDay(e.detail.value)
                                        }
                                        className="px-2.5 text-white text-xs font-mono"
                                        style={{
                                          "--padding-top": "8px",
                                          "--padding-bottom": "8px",
                                        }}
                                      />
                                    </IonItem>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                                      Category
                                    </label>
                                    <IonItem
                                      fill="none"
                                      className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-xs text-white"
                                      style={{
                                        "--background": "transparent",
                                        "--padding-start": "0px",
                                        "--inner-padding-end": "0px",
                                      }}
                                    >
                                      <div className="w-full px-2.5 py-0.5">
                                        <IonSelect
                                          value={editFixedCategory}
                                          onIonChange={(e) =>
                                            setEditFixedCategory(e.detail.value)
                                          }
                                          interface="popover"
                                          className="text-white text-xs font-sans"
                                        >
                                          {sortedCategoriesList.map(
                                            (cat) => (
                                              <IonSelectOption
                                                key={cat.name}
                                                value={cat.name}
                                              >
                                                {cat.name}
                                              </IonSelectOption>
                                            ),
                                          )}
                                        </IonSelect>
                                      </div>
                                    </IonItem>
                                  </div>
                                  <div className="flex justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditingFixedId(null)}
                                      className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                                    >
                                      <IonIcon
                                        icon={closeOutline}
                                        className="w-4 h-4"
                                      />
                                    </button>
                                    <button
                                      type="submit"
                                      className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold"
                                    >
                                      <IonIcon
                                        icon={checkmarkOutline}
                                        className="w-4 h-4 stroke-[2.5]"
                                      />
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <div className="flex items-center justify-between group bg-white/2 border border-white/5 rounded-xl p-3 hover:border-emerald-500/20 transition-all">
                                  <div>
                                    <p className="text-xs font-bold text-white capitalize">
                                      {bill.description}
                                    </p>
                                    <p className="text-[9px] text-slate-300 font-extrabold uppercase mt-0.5 flex items-center gap-1.5 tracking-wide">
                                      <span
                                        className={`inline-block w-1.5 h-1.5 rounded-full ${catObj.textColor ? catObj.bgColor + " " + catObj.textColor : "bg-slate-500"}`}
                                      />
                                      <span>
                                        Due Day {bill.due_day} • {bill.category}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-extrabold text-rose-400">
                                      {formatCurrency(bill.amount)}
                                    </span>
                                    <div className="flex items-center gap-1 transition-all">
                                      <button
                                        onClick={() =>
                                          handleStartEditFixed(bill)
                                        }
                                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-white active:scale-95"
                                        aria-label={`Edit ${bill.description}`}
                                        title="Edit"
                                      >
                                        <IonIcon
                                          icon={createOutline}
                                          className="h-3.5 w-3.5"
                                        />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteFixedExpense(bill.id)
                                        }
                                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-rose-400 active:scale-95"
                                        aria-label={`Delete ${bill.description}`}
                                        title="Delete"
                                      >
                                        <IonIcon
                                          icon={trashOutline}
                                          className="h-3.5 w-3.5"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </IonCard>

                  {/* Additional Income */}
                  <IonCard className="glassmorphism rounded-3xl p-5 mx-0 border border-white/5 bg-slate-950/20 shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          Additional Income (This Month)
                        </div>
                        <div className="text-xl font-extrabold text-white mt-0.5 font-['Outfit']">
                          +{formatCurrency(totalAdditional)}
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAddingIncome(!isAddingIncome)}
                        className="flex items-center justify-center border border-white/5 shadow-md hover:scale-105 active:scale-95 transition-all select-none cursor-pointer"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background: isAddingIncome
                            ? "linear-gradient(to top right, #f43f5e, #fb7185)"
                            : "linear-gradient(to top right, #10b981, #2dd4bf)",
                          boxShadow: isAddingIncome
                            ? "0 4px 6px -1px rgba(244, 63, 94, 0.15)"
                            : "0 4px 6px -1px rgba(16, 185, 129, 0.15)",
                        }}
                      >
                        <IonIcon
                          icon={isAddingIncome ? closeOutline : addOutline}
                          className="w-4 h-4 block"
                          style={{
                            color: isAddingIncome ? "#4c0519" : "#022c22",
                          }}
                        />
                      </button>
                    </div>

                    {isAddingIncome && (
                      <form
                        onSubmit={handleAddAdditionalIncome}
                        className="space-y-3 mt-3 pt-3 border-t border-white/5"
                      >
                        <IonItem
                          fill="none"
                          className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                          style={{
                            "--background": "transparent",
                            "--inner-padding-end": "0px",
                            "--padding-start": "0px",
                          }}
                        >
                          <IonInput
                            type="number"
                            step="0.01"
                            required
                            placeholder="Amount (NTD)"
                            value={additionalAmount}
                            onIonInput={(e) =>
                              setAdditionalAmount(e.detail.value)
                            }
                            className="px-3 text-white text-xs placeholder-slate-500"
                            style={{
                              "--padding-top": "10px",
                              "--padding-bottom": "10px",
                            }}
                          />
                        </IonItem>

                        <IonItem
                          fill="none"
                          className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                          style={{
                            "--background": "transparent",
                            "--inner-padding-end": "0px",
                            "--padding-start": "0px",
                          }}
                        >
                          <IonInput
                            type="text"
                            placeholder="Description (e.g. Freelance project)"
                            value={additionalDesc}
                            onIonInput={(e) =>
                              setAdditionalDesc(e.detail.value)
                            }
                            className="px-3 text-white text-xs placeholder-slate-500"
                            style={{
                              "--padding-top": "10px",
                              "--padding-bottom": "10px",
                            }}
                          />
                        </IonItem>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                            Transfer Date
                          </label>
                          <IonItem
                            fill="none"
                            className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                            style={{
                              "--background": "transparent",
                              "--inner-padding-end": "0px",
                              "--padding-start": "0px",
                            }}
                          >
                            <IonInput
                              type="date"
                              required
                              value={additionalDate}
                              onIonInput={(e) =>
                                setAdditionalDate(e.detail.value)
                              }
                              className="px-3 text-white text-xs placeholder-slate-500 font-mono"
                              style={{
                                "--padding-top": "10px",
                                "--padding-bottom": "10px",
                              }}
                            />
                          </IonItem>
                        </div>

                        <button
                          type="submit"
                          className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 uppercase tracking-wide font-extrabold text-xs"
                          style={{
                            background:
                              "linear-gradient(to right, #10b981, #14b8a6)",
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
                          <span>Add One-Off Income</span>
                        </button>
                      </form>
                    )}

                    {/* Logged Additional Incomes List */}
                    {additionalIncome.length > 0 && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                        <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1 mb-1">
                          Logged One-Off Income History
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {additionalIncome.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between bg-slate-950/40 border border-white/5 rounded-xl p-3 hover:border-emerald-500/20 transition-all"
                            >
                              <div>
                                <p className="text-xs font-bold text-white capitalize">
                                  {item.description}
                                </p>
                                <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wide">
                                  {new Date(item.date).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-extrabold text-emerald-400">
                                  +{formatCurrency(item.amount)}
                                </span>
                                <button
                                  onClick={() => handleDeleteAdditionalIncome(item.id)}
                                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 active:scale-95 transition-all cursor-pointer flex"
                                  title="Delete income entry"
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
                      </div>
                    )}
                  </IonCard>
                </div>
              )}

              {/* 4. HISTORY TAB (With sliding swipe gestures) */}
              {activeTab === "history" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <DailyConsumptionChart
                    expenses={expenses}
                    formatCurrency={formatCurrency}
                    currentMonthName={currentMonthName}
                  />

                  <IonCard className="glassmorphism rounded-3xl p-5 mx-0 border border-white/5 bg-slate-950/20 shadow-xl">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Recent Transactions
                      </h3>
                      <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wide">
                        {filteredExpenses.length} of {expenses.length} item(s)
                      </span>
                    </div>

                    {expenses.length === 0 ? (
                      <div className="text-center py-12 flex flex-col items-center justify-center gap-2">
                        <div className="p-3 rounded-2xl bg-white/3 border border-white/5 text-slate-600">
                          <IonIcon
                            icon={helpCircleOutline}
                            style={{ fontSize: "32px" }}
                          />
                        </div>
                        <p className="text-xs text-slate-200 font-bold uppercase tracking-wider">
                          No Variable Expenses Logged
                        </p>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          Add expenses in "Quick Log" to populate transaction
                          history.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
                          <IonSearchbar
                            value={transactionSearch}
                            onIonInput={(e) =>
                              setTransactionSearch(e.detail.value || "")
                            }
                            placeholder="Search transactions"
                            debounce={150}
                            className="p-0 text-xs"
                            style={{
                              "--background": "#0e1320",
                              "--border-radius": "12px",
                              "--box-shadow": "none",
                              "--color": "#f8fafc",
                              "--icon-color": "#94a3b8",
                              "--placeholder-color": "#64748b",
                              "--clear-button-color": "#94a3b8",
                              minHeight: "42px",
                            }}
                          />

                          <div className="rounded-xl border border-white/5 bg-slate-950/40 px-2">
                            <IonSelect
                              value={transactionCategoryFilter}
                              onIonChange={(e) =>
                                setTransactionCategoryFilter(e.detail.value)
                              }
                              interface="popover"
                              aria-label="Filter transactions by category"
                              className="min-h-[42px] min-w-[135px] text-xs font-extrabold uppercase tracking-wide text-slate-200"
                            >
                              <IonSelectOption value="all">
                                All Categories
                              </IonSelectOption>
                              {sortedCategoriesList.map((cat) => (
                                <IonSelectOption
                                  key={cat.name}
                                  value={cat.name}
                                >
                                  {cat.name}
                                </IonSelectOption>
                              ))}
                            </IonSelect>
                          </div>

                          <div className="rounded-xl border border-white/5 bg-slate-950/40 px-2">
                            <IonSelect
                              value={transactionDateFilter}
                              onIonChange={(e) =>
                                setTransactionDateFilter(e.detail.value)
                              }
                              interface="popover"
                              aria-label="Filter transactions by date"
                              className="min-h-[42px] min-w-[105px] text-xs font-extrabold uppercase tracking-wide text-slate-200"
                            >
                              <IonSelectOption value="all">
                                This Month
                              </IonSelectOption>
                              <IonSelectOption value="week">
                                Last 7 Days
                              </IonSelectOption>
                              <IonSelectOption value="today">
                                Today
                              </IonSelectOption>
                            </IonSelect>
                          </div>
                        </div>

                        {hasTransactionFilters && (
                          <button
                            type="button"
                            onClick={resetTransactionFilters}
                            className="self-end text-[9px] font-black uppercase tracking-wider text-slate-400 transition-all hover:text-white"
                          >
                            Clear filters
                          </button>
                        )}

                        {filteredExpenses.length === 0 ? (
                          <div className="rounded-2xl border border-white/5 bg-slate-950/30 px-4 py-10 text-center">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                              No Matching Transactions
                            </p>
                            <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-400">
                              Try a different search, category, or date filter.
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-2xl overflow-hidden bg-transparent max-h-[420px] overflow-y-auto pr-1">
                            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest text-right mb-2 pr-1 opacity-70">
                              ← Swipe Left to delete
                            </p>

                            <IonList
                              className="bg-transparent p-0 m-0 space-y-2"
                              style={{ background: "transparent" }}
                            >
                              {filteredExpenses.map((expense) => {
                                const catObj = getCategoryConfig(
                                  expense.category,
                                );
                                return (
                                  <IonItemSliding
                                    key={expense.id}
                                    className="rounded-xl overflow-hidden"
                                  >
                                    <IonItem
                                      className="bg-transparent border border-white/5 rounded-xl hover:border-emerald-500/20 transition-all"
                                      style={{
                                        "--background": "#0e1320",
                                        "--padding-start": "10px",
                                        "--inner-padding-end": "10px",
                                        "--border-style": "none",
                                        "--min-height": "62px",
                                      }}
                                    >
                                      <div className="flex items-center gap-3.5 w-full py-1.5">
                                        <div
                                          className={`p-2 rounded-xl ${catObj.bgColor} border ${catObj.borderColor} shrink-0 flex`}
                                        >
                                          {getCategoryIcon(expense.category)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-bold text-white capitalize truncate">
                                            {expense.description}
                                          </p>
                                          <div className="text-[9px] text-slate-400 font-extrabold uppercase flex items-center gap-1.5 mt-0.5 tracking-wide">
                                            <IonSelect
                                              value={expense.category}
                                              onIonChange={(e) =>
                                                handleUpdateExpenseCategory(
                                                  expense,
                                                  e.detail.value,
                                                )
                                              }
                                              interface="popover"
                                              aria-label={`Change category for ${expense.description}`}
                                              className="min-w-[82px] max-w-[132px] rounded-md border border-white/5 bg-white/3 px-1 text-[9px] font-extrabold uppercase tracking-wide text-slate-300"
                                              style={{
                                                "--padding-start": "0px",
                                                "--padding-end": "0px",
                                                "--padding-top": "0px",
                                                "--padding-bottom": "0px",
                                              }}
                                            >
                                              {sortedCategoriesList.map(
                                                (cat) => (
                                                  <IonSelectOption
                                                    key={cat.name}
                                                    value={cat.name}
                                                  >
                                                    {cat.name}
                                                  </IonSelectOption>
                                                ),
                                              )}
                                            </IonSelect>
                                            <span>•</span>
                                            <span>
                                              {new Date(
                                                expense.created_at ||
                                                  expense.date,
                                              ).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                              })}
                                              ,{" "}
                                              {new Date(
                                                expense.created_at ||
                                                  expense.date,
                                              ).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                              })}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                          <span className="font-extrabold text-white text-xs">
                                            -{formatCurrency(expense.amount)}
                                          </span>
                                          <button
                                            onClick={() => handleStartEditExpense(expense)}
                                            className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-white transition-all active:scale-90 cursor-pointer"
                                            title="Edit transaction"
                                          >
                                            <IonIcon
                                              icon={createOutline}
                                              className="h-3 w-3"
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    </IonItem>

                                    <IonItemOptions
                                      side="start"
                                      className="h-full"
                                    >
                                      <IonItemOption
                                        color="primary"
                                        onClick={() =>
                                          handleStartEditExpense(expense)
                                        }
                                        className="px-4"
                                        style={{
                                          "--background": "#3b82f6",
                                          "font-weight": "bold",
                                          "font-size": "11px",
                                          "text-transform": "uppercase",
                                          "letter-spacing": "0.05em",
                                        }}
                                      >
                                        <IonIcon
                                          icon={createOutline}
                                          slot="icon-only"
                                          className="w-5 h-5 block"
                                        />
                                      </IonItemOption>
                                    </IonItemOptions>

                                    <IonItemOptions
                                      side="end"
                                      className="h-full"
                                    >
                                      <IonItemOption
                                        color="danger"
                                        onClick={() =>
                                          handleDeleteExpense(expense.id)
                                        }
                                        className="px-4"
                                        style={{
                                          "--background": "#ef4444",
                                          "font-weight": "bold",
                                          "font-size": "11px",
                                          "text-transform": "uppercase",
                                          "letter-spacing": "0.05em",
                                        }}
                                      >
                                        <IonIcon
                                          icon={trashOutline}
                                          slot="icon-only"
                                          className="w-5 h-5 block"
                                        />
                                      </IonItemOption>
                                    </IonItemOptions>
                                  </IonItemSliding>
                                );
                              })}
                            </IonList>
                          </div>
                        )}
                      </div>
                    )}
                  </IonCard>
                </div>
              )}

              {/* 5. PROFILE TAB (Inline Full Screen Page) */}
              {activeTab === "profile" && (
                <div className="flex flex-col gap-6 animate-fade-in pb-12">
                  {profileView === "profile" ? (
                    <>
                      {/* Active Profile Overview Card */}
                      <div className="glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center gap-4">
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none" />

                        {/* Big Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-white/10 select-none">
                          {session?.user?.email
                            ? session.user.email[0].toUpperCase()
                            : "U"}
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                            Active Session
                          </div>
                          <h4 className="text-base font-extrabold text-white tracking-tight font-['Outfit'] select-all">
                            {session?.user?.email || "User Account"}
                          </h4>
                        </div>
                      </div>

                      {/* Action buttons list */}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => setProfileView("settings")}
                          className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10 text-white font-extrabold text-xs uppercase tracking-wide glassmorphism"
                          style={{
                            padding: "14px 20px",
                            borderRadius: "16px",
                            minHeight: "48px",
                          }}
                        >
                          <IonIcon
                            icon={settingsOutline}
                            className="w-4.5 h-4.5 text-slate-300"
                          />
                          <span>Settings & Currency</span>
                        </button>

                        <button
                          onClick={onSignOut}
                          className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-500/10 uppercase tracking-wide font-extrabold text-xs"
                          style={{
                            background:
                              "linear-gradient(to right, #f43f5e, #e11d48)",
                            color: "#fff",
                            padding: "14px 20px",
                            borderRadius: "16px",
                            border: "none",
                            minHeight: "48px",
                          }}
                        >
                          <IonIcon
                            icon={logOutOutline}
                            className="w-4.5 h-4.5"
                          />
                          <span>Log Out of Account</span>
                        </button>
                      </div>
                    </>
                  ) : profileView === "settings" ? (
                    <>
                      {/* Page Title */}
                      <div className="flex items-center justify-end border-b border-white/5 pb-3">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                          Application Settings
                        </h4>
                      </div>

                      {/* Primary Currency Card */}
                      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 shadow-xl relative overflow-hidden flex flex-col gap-4">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                          Primary Currency
                        </label>

                        <div className="w-full px-3 py-1.5 font-semibold text-slate-200 rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs">
                          <IonSelect
                            value={selectedCurrency}
                            onIonChange={(e) => {
                              const newCurrency = e.detail.value;
                              setSelectedCurrency(newCurrency);
                              localStorage.setItem(
                                "easy_moneytoring_currency",
                                newCurrency,
                              );
                            }}
                            interface="popover"
                            className="text-white text-xs font-sans w-full"
                            style={{
                              "--padding-top": "8px",
                              "--padding-bottom": "8px",
                            }}
                          >
                            <IonSelectOption value="NTD">
                              New Taiwan Dollar (NT$)
                            </IonSelectOption>
                            <IonSelectOption value="USD">
                              US Dollar ($)
                            </IonSelectOption>
                            <IonSelectOption value="EUR">
                              Euro (€)
                            </IonSelectOption>
                            <IonSelectOption value="JPY">
                              Japanese Yen (¥)
                            </IonSelectOption>
                            <IonSelectOption value="GBP">
                              British Pound (£)
                            </IonSelectOption>
                          </IonSelect>
                        </div>

                        <p className="text-[9px] text-slate-400 font-semibold leading-normal italic px-1">
                          All cash flows, budgets, expenditures, and logged
                          history will format automatically to your chosen
                          currency.
                        </p>
                      </div>

                      {/* Custom Categories Trigger Card */}
                      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 shadow-xl relative overflow-hidden flex flex-col gap-4">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                          Custom Categories & Keywords
                        </label>

                        <button
                          onClick={() => setProfileView("categories")}
                          className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between border border-white/10 text-white font-extrabold text-xs uppercase tracking-wide glassmorphism"
                          style={{
                            padding: "14px 16px",
                            borderRadius: "16px",
                            minHeight: "48px",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <IonIcon
                              icon={settingsOutline}
                              className="w-4 h-4 text-emerald-400"
                            />
                            <span>Manage Categories</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                            Configure →
                          </span>
                        </button>
                      </div>

                      {/* n8n Webhook Alerts Integration Card */}
                      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 shadow-xl relative overflow-hidden flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                            n8n Webhook Alerts
                          </label>
                          <IonToggle
                            checked={n8nEnabled}
                            onIonChange={(e) => {
                              const checked = e.detail.checked;
                              setN8nEnabled(checked);
                              localStorage.setItem("easy_moneytoring_n8n_enabled", String(checked));
                            }}
                            style={{
                              "--background": "rgba(255,255,255,0.05)",
                              "--background-checked": "#10b981",
                              "--handle-background-checked": "#022c22",
                            }}
                          />
                        </div>

                        {n8nEnabled && (
                          <div className="space-y-4 animate-fade-in">
                            {/* Webhook URL Input */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                                Webhook Endpoint URL
                              </label>
                              <IonItem
                                fill="none"
                                className="rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                                style={{
                                  "--background": "transparent",
                                  "--inner-padding-end": "0px",
                                  "--padding-start": "0px",
                                }}
                              >
                                <IonInput
                                  type="url"
                                  placeholder="e.g. http://localhost:5678/webhook/expense-added"
                                  value={n8nUrl}
                                  onIonInput={(e) => {
                                    const val = e.detail.value;
                                    setN8nUrl(val);
                                    localStorage.setItem("easy_moneytoring_n8n_url", val);
                                  }}
                                  className="px-3 text-white text-xs placeholder-slate-500"
                                  style={{
                                    "--padding-top": "10px",
                                    "--padding-bottom": "10px",
                                  }}
                                />
                              </IonItem>
                            </div>

                            {/* Nickname Input */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                                Who Spent (Nickname)
                              </label>
                              <IonItem
                                fill="none"
                                className="rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                                style={{
                                  "--background": "transparent",
                                  "--inner-padding-end": "0px",
                                  "--padding-start": "0px",
                                }}
                              >
                                <IonInput
                                  type="text"
                                  placeholder="e.g. Dad, Mom, Brother"
                                  value={n8nNickname}
                                  onIonInput={(e) => {
                                    const val = e.detail.value;
                                    setN8nNickname(val);
                                    localStorage.setItem("easy_moneytoring_n8n_nickname", val);
                                  }}
                                  className="px-3 text-white text-xs placeholder-slate-500"
                                  style={{
                                    "--padding-top": "10px",
                                    "--padding-bottom": "10px",
                                  }}
                                />
                              </IonItem>
                            </div>

                            {/* Send Test Webhook Button */}
                            <button
                              type="button"
                              onClick={handleSendTestWebhook}
                              disabled={!n8nUrl}
                              className="w-full hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg uppercase tracking-wide font-extrabold text-[10px] text-white border border-white/10"
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                padding: "10px 16px",
                                borderRadius: "12px",
                                minHeight: "38px",
                              }}
                            >
                              <span>Send Test Webhook</span>
                            </button>
                          </div>
                        )}

                        <p className="text-[9px] text-slate-400 font-semibold leading-normal italic px-1">
                          Sends expense logs in real-time to your local n8n workflows for broadcast notifications in your family chat.
                        </p>
                      </div>

                      <button
                        onClick={() => setProfileView("profile")}
                        className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-500/20 text-emerald-300 font-extrabold text-xs uppercase tracking-wide"
                        style={{
                          background: "rgba(16, 185, 129, 0.1)",
                          padding: "14px 20px",
                          borderRadius: "16px",
                          minHeight: "48px",
                        }}
                      >
                        <span>Save & Return to Profile</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Page Title */}
                      <div className="flex items-center justify-end border-b border-white/5 pb-3">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                          Category Customizer
                        </h4>
                      </div>

                      {/* Active Categories List Card */}
                      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 shadow-xl relative overflow-hidden flex flex-col gap-4">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                          Active Categories
                        </label>

                        <div className="space-y-3 pr-1">
                          {Object.keys(userCategories)
                            .sort((a, b) => (userCategories[a].display_order || 0) - (userCategories[b].display_order || 0))
                            .map((key, index, sortedKeys) => {
                              const cat = userCategories[key];
                              const isOther = key === "Other";
                              return (
                                <div
                                  key={key}
                                  className="flex items-center justify-between bg-slate-950/40 border border-white/5 rounded-2xl p-4 transition-all hover:border-white/10"
                                >
                                  <div className="flex items-center gap-4 min-w-0 flex-1 pr-2">
                                    <div
                                      className={`p-3 rounded-2xl ${cat.bgColor} border ${cat.borderColor} flex shrink-0 shadow-inner`}
                                    >
                                      {getCategoryIcon(key, "w-6 h-6")}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-bold text-white truncate capitalize">
                                        {cat.name}
                                      </p>
                                      <p className="text-[10.5px] text-slate-400 truncate italic font-semibold mt-1 leading-normal">
                                        {cat.keywords && cat.keywords.length > 0
                                          ? cat.keywords.join(", ")
                                          : "No keywords configured"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {/* Reorder Buttons */}
                                    <button
                                      type="button"
                                      onClick={() => handleMoveCategory(key, "up")}
                                      disabled={index === 0}
                                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer flex"
                                      title="Move Up"
                                    >
                                      <IonIcon
                                        icon={arrowUpOutline}
                                        className="w-4.5 h-4.5 block"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMoveCategory(key, "down")}
                                      disabled={index === sortedKeys.length - 1}
                                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer flex"
                                      title="Move Down"
                                    >
                                      <IonIcon
                                        icon={arrowDownOutline}
                                        className="w-4.5 h-4.5 block"
                                      />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleStartEditCategory(key)}
                                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex"
                                      title="Edit Category"
                                    >
                                      <IonIcon
                                        icon={createOutline}
                                        className="w-4.5 h-4.5 block"
                                      />
                                    </button>
                                    {!isOther && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteCategory(key)}
                                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-rose-400 transition-all cursor-pointer flex"
                                        title="Delete Category"
                                      >
                                        <IonIcon
                                          icon={trashOutline}
                                          className="w-4.5 h-4.5 block"
                                        />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Add / Edit Category Form Card */}
                      <div className="glassmorphism rounded-3xl p-5 border border-white/5 bg-slate-950/20 shadow-xl relative overflow-hidden flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                            {editingCatKey
                              ? `Edit "${editingCatKey}"`
                              : "Add Custom Category"}
                          </label>
                          {editingCatKey && (
                            <button
                              type="button"
                              onClick={handleCancelEditCategory}
                              className="text-[9px] text-rose-400 font-black uppercase tracking-wider hover:underline"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>

                        <form
                          onSubmit={handleSaveCategory}
                          className="space-y-5"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Name Input */}
                            <IonItem
                              lines="none"
                              className="rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                              style={{
                                "--background": "transparent",
                                "--inner-padding-end": "0px",
                                "--padding-start": "0px",
                              }}
                            >
                              <IonInput
                                type="text"
                                required
                                placeholder="Category Name"
                                value={catEditName}
                                onIonInput={(e) =>
                                  setCatEditName(e.detail.value)
                                }
                                className="px-3 text-white text-xs placeholder-slate-500 font-semibold"
                                style={{
                                  "--padding-top": "10px",
                                  "--padding-bottom": "10px",
                                }}
                              />
                            </IonItem>

                            {/* Keywords Input */}
                            <IonItem
                              lines="none"
                              className="rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans text-xs text-white"
                              style={{
                                "--background": "transparent",
                                "--inner-padding-end": "0px",
                                "--padding-start": "0px",
                              }}
                            >
                              <IonInput
                                type="text"
                                placeholder="Keywords (split by ',')"
                                value={catEditKeywords}
                                onIonInput={(e) =>
                                  setCatEditKeywords(e.detail.value)
                                }
                                className="px-3 text-white text-xs placeholder-slate-500 font-semibold"
                                style={{
                                  "--padding-top": "10px",
                                  "--padding-bottom": "10px",
                                }}
                              />
                            </IonItem>
                          </div>

                          {/* Color Picker Swatches */}
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                              Theme Color Accent
                            </label>
                            <div className="flex items-center flex-wrap gap-4 pl-1">
                              {Object.keys(colorHexMap).map((colorName) => {
                                const hex = colorHexMap[colorName];
                                const isSelected = catEditColor === colorName;
                                return (
                                  <button
                                    key={colorName}
                                    type="button"
                                    onClick={() => setCatEditColor(colorName)}
                                    className="w-10 h-10 rounded-full transition-all border cursor-pointer relative flex items-center justify-center shadow-md"
                                    style={{
                                      backgroundColor: hex,
                                      borderColor: isSelected
                                        ? "#ffffff"
                                        : "rgba(255,255,255,0.1)",
                                      transform: isSelected
                                        ? "scale(1.15)"
                                        : "scale(1)",
                                      boxShadow: isSelected
                                        ? `0 0 14px ${hex}`
                                        : "none",
                                    }}
                                    title={colorName}
                                  >
                                    {isSelected && (
                                      <span className="text-xs text-slate-950 font-black">
                                        ✓
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Icon Picker Grid */}
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block ml-1">
                              Category Icon
                            </label>
                            <div className="grid grid-cols-4 gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                              {Object.keys(iconMap).map((iconName) => {
                                const isSelected = catEditIcon === iconName;
                                return (
                                  <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setCatEditIcon(iconName)}
                                    className={`p-4 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
                                      isSelected
                                        ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-400 shadow-lg shadow-emerald-500/10 scale-105"
                                        : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                  >
                                    <IonIcon
                                      icon={iconMap[iconName]}
                                      className="w-6.5 h-6.5 block"
                                      style={{ fontSize: "26px" }}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 uppercase tracking-wide font-extrabold text-xs"
                            style={{
                              background:
                                "linear-gradient(to right, #10b981, #14b8a6)",
                              color: "#022c22",
                              padding: "14px 20px",
                              borderRadius: "16px",
                              border: "none",
                              minHeight: "48px",
                            }}
                          >
                            <IonIcon
                              icon={checkmarkOutline}
                              className="w-4 h-4 stroke-[2.5]"
                              style={{ color: "#022c22" }}
                            />
                            <span>
                              {editingCatKey
                                ? "Save Category"
                                : "Create Category"}
                            </span>
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
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
                    className="p-1.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex"
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
                      background: "linear-gradient(to right, #10b981, #14b8a6)",
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
                    className="p-1.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex"
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
                    background: "linear-gradient(to right, #10b981, #14b8a6)",
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
                        className="p-1.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex"
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
                                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 active:scale-95 transition-all cursor-pointer flex"
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
                                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 active:scale-95 transition-all cursor-pointer flex"
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
          style={{ "--color-selected": "#10b981", "--color": "#64748b" }}
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
          style={{ "--color-selected": "#10b981", "--color": "#64748b" }}
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
          style={{ "--color-selected": "#10b981", "--color": "#64748b" }}
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
          style={{ "--color-selected": "#10b981", "--color": "#64748b" }}
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
          background: "linear-gradient(to right, #10b981, #14b8a6)",
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
