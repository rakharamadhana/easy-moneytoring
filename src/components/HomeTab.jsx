import React, { useState } from "react";
import { IonCard, IonIcon } from "@ionic/react";
import { calendarOutline, reorderThree } from "ionicons/icons";

export default function HomeTab({
  remainingBudget,
  totalBudget,
  currentMonthName,
  formatCurrency,
  totalSpent,
  categoryMap,
  categoryTotals,
  getCategoryColor,
  getCategoryIcon,
  setSelectedDetailCategory,
  remainingPercentage,
  onReorderCategories,
}) {
  // Pointer Events reordering states & handlers
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handlePointerDown = (e, index) => {
    if (e.button !== 0) return; // Left click only
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggedIndex(index);
    setDragOverIndex(index);
  };

  const handlePointerMove = (e) => {
    if (draggedIndex === null) return;
    const clientY = e.clientY;
    const clientX = e.clientX;
    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return;

    const itemContainer = element.closest("[data-index]");
    if (itemContainer) {
      const targetIndex = parseInt(itemContainer.getAttribute("data-index"), 10);
      if (!isNaN(targetIndex) && targetIndex !== dragOverIndex) {
        setDragOverIndex(targetIndex);
      }
    }
  };

  const handlePointerUp = (e) => {
    if (draggedIndex !== null) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore
      }
      
      if (dragOverIndex !== null && draggedIndex !== dragOverIndex) {
        const reorderedKeys = [...categoryMap].map((c) => c.key);
        const [removed] = reorderedKeys.splice(draggedIndex, 1);
        reorderedKeys.splice(dragOverIndex, 0, removed);
        onReorderCategories(reorderedKeys);
      }
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handlePointerCancel = (e) => {
    if (draggedIndex !== null) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore
      }
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  return (
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
          {categoryMap.map((cat, index) => {
            const amount = categoryTotals[cat.name] || 0;
            const percent = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index && draggedIndex !== index;
            
            return (
              <div
                key={cat.key}
                data-index={index}
                onClick={() => setSelectedDetailCategory(cat.name)}
                className={`group relative cursor-pointer hover:bg-white/3 py-1 px-2.5 -mx-2.5 rounded-2xl transition-all border duration-200 select-none ${
                  isDragging ? "opacity-30 border-dashed border-slate-700" : ""
                } ${
                  isDragOver ? "border-emerald-500/50 bg-slate-900/60 scale-[1.01]" : "border-transparent hover:border-white/5"
                }`}
                title={`Audit ${cat.name} expenses`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    {/* Drag Handle Wrapper using Pointer Events */}
                    <div
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        handlePointerDown(e, index);
                      }}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerCancel}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 -my-2 flex items-center justify-center text-slate-500 shrink-0 select-none opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mr-0.5 touch-none"
                      style={{ touchAction: "none" }}
                    >
                      <IonIcon
                        icon={reorderThree}
                        className="w-4 h-4 pointer-events-none"
                      />
                    </div>
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
  );
}
