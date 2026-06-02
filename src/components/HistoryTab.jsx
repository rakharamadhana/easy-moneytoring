import React, { useState } from "react";
import {
  IonCard,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
} from "@ionic/react";
import {
  helpCircleOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";

// ---------------- DailyConsumptionChart subcomponent ----------------
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

  const totalSpent = runningSum;
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;
  const divisor = isCurrentMonth ? now.getDate() : totalDays;
  const averageDailySpent = divisor > 0 ? totalSpent / divisor : 0;

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
      <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-3 rounded-2xl border border-white/5 text-[10px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-400 font-extrabold uppercase tracking-wider">
            Total Month Spending
          </span>
          <span className="text-sm font-extrabold text-white font-['Outfit']">
            {formatCurrency(totalSpent)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-slate-400 font-extrabold uppercase tracking-wider">
            Daily Average
          </span>
          <span className="text-sm font-extrabold text-teal-400 font-['Outfit']">
            {formatCurrency(averageDailySpent)}
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

// ---------------- Main HistoryTab component ----------------
export default function HistoryTab({
  expenses,
  formatCurrency,
  currentMonthName,
  sortedCategoriesList,
  getCategoryConfig,
  getCategoryIcon,
  onStartEditExpense,
  onDeleteExpense,
  onUpdateExpenseCategory,
}) {
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionCategoryFilter, setTransactionCategoryFilter] = useState("all");
  const [transactionDateFilter, setTransactionDateFilter] = useState("all");

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

  return (
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
              <IonIcon icon={helpCircleOutline} style={{ fontSize: "32px" }} />
            </div>
            <p className="text-xs text-slate-200 font-bold uppercase tracking-wider">
              No Variable Expenses Logged
            </p>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Add expenses in "Quick Log" to populate transaction history.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
              <IonSearchbar
                value={transactionSearch}
                onIonInput={(e) => setTransactionSearch(e.detail.value || "")}
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
                  onIonChange={(e) => setTransactionCategoryFilter(e.detail.value)}
                  interface="popover"
                  aria-label="Filter transactions by category"
                  className="min-h-[42px] min-w-[135px] text-xs font-extrabold uppercase tracking-wide text-slate-200"
                >
                  <IonSelectOption value="all">All Categories</IonSelectOption>
                  {sortedCategoriesList.map((cat) => (
                    <IonSelectOption key={cat.name} value={cat.name}>
                      {cat.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/40 px-2">
                <IonSelect
                  value={transactionDateFilter}
                  onIonChange={(e) => setTransactionDateFilter(e.detail.value)}
                  interface="popover"
                  aria-label="Filter transactions by date"
                  className="min-h-[42px] min-w-[105px] text-xs font-extrabold uppercase tracking-wide text-slate-200"
                >
                  <IonSelectOption value="all">This Month</IonSelectOption>
                  <IonSelectOption value="week">Last 7 Days</IonSelectOption>
                  <IonSelectOption value="today">Today</IonSelectOption>
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
                    const catObj = getCategoryConfig(expense.category);
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
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 mt-0.5">
                                <IonSelect
                                  value={expense.category}
                                  onIonChange={(e) =>
                                    onUpdateExpenseCategory(expense, e.detail.value)
                                  }
                                  interface="popover"
                                  aria-label={`Change category for ${expense.description}`}
                                  className="w-[135px] shrink-0 rounded-md border border-white/5 bg-white/3 text-[9px] font-extrabold uppercase tracking-wide text-slate-300 h-[22px] flex items-center"
                                  style={{
                                    "--padding-start": "6px",
                                    "--padding-end": "6px",
                                    "--padding-top": "0px",
                                    "--padding-bottom": "0px",
                                    "--min-height": "22px",
                                    "min-height": "22px",
                                  }}
                                >
                                  {sortedCategoriesList.map((cat) => (
                                    <IonSelectOption key={cat.name} value={cat.name}>
                                      {cat.name}
                                    </IonSelectOption>
                                  ))}
                                </IonSelect>
                                <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5 pl-1 sm:pl-0">
                                  <span className="hidden sm:inline">•</span>
                                  <span>
                                    {new Date(
                                      expense.created_at || expense.date
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                    ,{" "}
                                    {new Date(
                                      expense.created_at || expense.date
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="font-extrabold text-white text-xs">
                                -{formatCurrency(expense.amount)}
                              </span>
                              <button
                                onClick={() => onStartEditExpense(expense)}
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

                        <IonItemOptions side="start" className="h-full">
                          <IonItemOption
                            color="primary"
                            onClick={() => onStartEditExpense(expense)}
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

                        <IonItemOptions side="end" className="h-full">
                          <IonItemOption
                            color="danger"
                            onClick={() => onDeleteExpense(expense.id)}
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
  );
}
