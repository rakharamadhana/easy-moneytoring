import React, { useState } from "react";
import {
  IonCard,
  IonIcon,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  closeOutline,
  addOutline,
  checkmarkOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";
import { categories } from "../utils/categorizer";

export default function CashFlowTab({
  baselineIncomes,
  fixedExpenses,
  additionalIncome,
  currentDay,
  formatCurrency,
  totalBaseline,
  totalBaselineConfigured,
  totalFixedExpenses,
  totalAdditional,
  sortedCategoriesList,
  onAddBaselineIncome,
  onSaveEditBaseline,
  onDeleteBaselineIncome,
  onAddFixedExpense,
  onSaveEditFixed,
  onDeleteFixedExpense,
  onAddAdditionalIncome,
  onSaveEditAdditional,
  onDeleteAdditionalIncome,
}) {
  // Baseline Income add/edit states
  const [isAddingBaseline, setIsAddingBaseline] = useState(false);
  const [newBaselineDesc, setNewBaselineDesc] = useState("");
  const [newBaselineAmount, setNewBaselineAmount] = useState("");
  const [newBaselineDay, setNewBaselineDay] = useState("1");

  const [editingBaselineId, setEditingBaselineId] = useState(null);
  const [editBaselineDesc, setEditBaselineDesc] = useState("");
  const [editBaselineAmount, setEditBaselineAmount] = useState("");
  const [editBaselineDay, setEditBaselineDay] = useState("1");

  // Fixed Monthly Bills add/edit states
  const [isAddingFixed, setIsAddingFixed] = useState(false);
  const [newFixedDesc, setNewFixedDesc] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");
  const [newFixedDay, setNewFixedDay] = useState("1");
  const [newFixedCategory, setNewFixedCategory] = useState("Utilities/Bills");

  const [editingFixedId, setEditingFixedId] = useState(null);
  const [editFixedDesc, setEditFixedDesc] = useState("");
  const [editFixedAmount, setEditFixedAmount] = useState("");
  const [editFixedDay, setEditFixedDay] = useState("1");
  const [editFixedCategory, setEditFixedCategory] = useState("Utilities/Bills");

  // Additional Income states
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [additionalAmount, setAdditionalAmount] = useState("");
  const [additionalDesc, setAdditionalDesc] = useState("");
  const [additionalDate, setAdditionalDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [editingAdditionalId, setEditingAdditionalId] = useState(null);
  const [editAdditionalDesc, setEditAdditionalDesc] = useState("");
  const [editAdditionalAmount, setEditAdditionalAmount] = useState("");
  const [editAdditionalDate, setEditAdditionalDate] = useState("");

  // Handlers for Local Form Submissions
  const handleAddBaselineSubmit = async (e) => {
    e.preventDefault();
    const success = await onAddBaselineIncome({
      desc: newBaselineDesc,
      amount: newBaselineAmount,
      day: newBaselineDay,
    });
    if (success) {
      setNewBaselineDesc("");
      setNewBaselineAmount("");
      setNewBaselineDay("1");
      setIsAddingBaseline(false);
    }
  };

  const handleEditBaselineSubmit = async (e, id) => {
    e.preventDefault();
    const success = await onSaveEditBaseline({
      id,
      desc: editBaselineDesc,
      amount: editBaselineAmount,
      day: editBaselineDay,
    });
    if (success) {
      setEditingBaselineId(null);
    }
  };

  const startEditBaseline = (income) => {
    setEditingBaselineId(income.id);
    setEditBaselineDesc(income.description);
    setEditBaselineAmount(income.amount);
    setEditBaselineDay(income.transfer_day);
  };

  const handleAddFixedSubmit = async (e) => {
    e.preventDefault();
    const success = await onAddFixedExpense({
      desc: newFixedDesc,
      amount: newFixedAmount,
      day: newFixedDay,
      category: newFixedCategory,
    });
    if (success) {
      setNewFixedDesc("");
      setNewFixedAmount("");
      setNewFixedDay("1");
      setNewFixedCategory("Utilities/Bills");
      setIsAddingFixed(false);
    }
  };

  const handleEditFixedSubmit = async (e, id) => {
    e.preventDefault();
    const success = await onSaveEditFixed({
      id,
      desc: editFixedDesc,
      amount: editFixedAmount,
      day: editFixedDay,
      category: editFixedCategory,
    });
    if (success) {
      setEditingFixedId(null);
    }
  };

  const startEditFixed = (bill) => {
    setEditingFixedId(bill.id);
    setEditFixedDesc(bill.description);
    setEditFixedAmount(bill.amount);
    setEditFixedDay(bill.due_day);
    setEditFixedCategory(bill.category);
  };

  const handleAddAdditionalSubmit = async (e) => {
    e.preventDefault();
    const success = await onAddAdditionalIncome({
      amount: additionalAmount,
      desc: additionalDesc,
      date: additionalDate,
    });
    if (success) {
      setAdditionalAmount("");
      setAdditionalDesc("");
      setAdditionalDate(new Date().toISOString().split("T")[0]);
      setIsAddingIncome(false);
    }
  };

  const handleEditAdditionalSubmit = async (e, id) => {
    e.preventDefault();
    const success = await onSaveEditAdditional({
      id,
      desc: editAdditionalDesc,
      amount: editAdditionalAmount,
      date: editAdditionalDate,
    });
    if (success) {
      setEditingAdditionalId(null);
    }
  };

  const startEditAdditional = (item) => {
    setEditingAdditionalId(item.id);
    setEditAdditionalDesc(item.description);
    setEditAdditionalAmount(item.amount);
    setEditAdditionalDate(item.date);
  };

  return (
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
              {formatCurrency(totalBaselineConfigured)} configured monthly
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
                : "linear-gradient(to top right, var(--theme-color), var(--color-teal-400))",
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
            onSubmit={handleAddBaselineSubmit}
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
                onIonInput={(e) => setNewBaselineDesc(e.detail.value)}
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
                  onIonInput={(e) => setNewBaselineAmount(e.detail.value)}
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
                  onIonInput={(e) => setNewBaselineDay(e.detail.value)}
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
              <span>Add Baseline Income</span>
            </button>
          </form>
        )}

        {baselineIncomes.length === 0 ? (
          <p className="text-[11px] text-slate-500 font-semibold leading-normal italic text-center py-4">
            No baseline income sources configured. Click add to setup.
          </p>
        ) : (
          <div className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1">
            {baselineIncomes.map((income) => (
              <div key={income.id}>
                {editingBaselineId === income.id ? (
                  <form
                    onSubmit={(e) => handleEditBaselineSubmit(e, income.id)}
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
                        onIonInput={(e) => setEditBaselineDesc(e.detail.value)}
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
                          onIonInput={(e) => setEditBaselineAmount(e.detail.value)}
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
                          onIonInput={(e) => setEditBaselineDay(e.detail.value)}
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
                        className="p-1.5 rounded-lg rounded-btn-square bg-white/5 text-slate-400 hover:text-white"
                      >
                        <IonIcon icon={closeOutline} className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg rounded-btn-square bg-emerald-500 text-slate-950 font-bold"
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
                            Transfers Day {income.transfer_day} of month
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
                              onClick={() => startEditBaseline(income)}
                              className="flex h-7 w-7 items-center justify-center rounded-xl rounded-btn-square border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-white active:scale-95"
                              aria-label={`Edit ${income.description}`}
                              title="Edit"
                            >
                              <IonIcon
                                icon={createOutline}
                                className="h-3.5 w-3.5"
                              />
                            </button>
                            <button
                              onClick={() => onDeleteBaselineIncome(income.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-xl rounded-btn-square border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-rose-400 active:scale-95"
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
                : "linear-gradient(to top right, var(--theme-color), var(--color-teal-400))",
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
            onSubmit={handleAddFixedSubmit}
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
                  onIonInput={(e) => setNewFixedAmount(e.detail.value)}
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
                    onIonChange={(e) => setNewFixedCategory(e.detail.value)}
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
                Object.values(categories).find((c) => c.name === bill.category) ||
                categories.Other;
              return (
                <div key={bill.id}>
                  {editingFixedId === bill.id ? (
                    <form
                      onSubmit={(e) => handleEditFixedSubmit(e, bill.id)}
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
                          onIonInput={(e) => setEditFixedDesc(e.detail.value)}
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
                            onIonInput={(e) => setEditFixedAmount(e.detail.value)}
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
                            onIonInput={(e) => setEditFixedDay(e.detail.value)}
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
                              onIonChange={(e) => setEditFixedCategory(e.detail.value)}
                              interface="popover"
                              className="text-white text-xs font-sans"
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
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingFixedId(null)}
                          className="p-1.5 rounded-lg rounded-btn-square bg-white/5 text-slate-400 hover:text-white"
                        >
                          <IonIcon icon={closeOutline} className="w-4 h-4" />
                        </button>
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg rounded-btn-square bg-emerald-500 text-slate-950 font-bold"
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
                            className={`inline-block w-1.5 h-1.5 rounded-full ${
                              catObj.textColor
                                ? catObj.bgColor + " " + catObj.textColor
                                : "bg-slate-500"
                            }`}
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
                            onClick={() => startEditFixed(bill)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl rounded-btn-square border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-white active:scale-95"
                            aria-label={`Edit ${bill.description}`}
                            title="Edit"
                          >
                            <IonIcon
                              icon={createOutline}
                              className="h-3.5 w-3.5"
                            />
                          </button>
                          <button
                            onClick={() => onDeleteFixedExpense(bill.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl rounded-btn-square border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-rose-400 active:scale-95"
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
                : "linear-gradient(to top right, var(--theme-color), var(--color-teal-400))",
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
            onSubmit={handleAddAdditionalSubmit}
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
                onIonInput={(e) => setAdditionalAmount(e.detail.value)}
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
                onIonInput={(e) => setAdditionalDesc(e.detail.value)}
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
                  onIonInput={(e) => setAdditionalDate(e.detail.value)}
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
                <div key={item.id}>
                  {editingAdditionalId === item.id ? (
                    <form
                      onSubmit={(e) => handleEditAdditionalSubmit(e, item.id)}
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
                          value={editAdditionalDesc}
                          onIonInput={(e) => setEditAdditionalDesc(e.detail.value)}
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
                            value={editAdditionalAmount}
                            onIonInput={(e) => setEditAdditionalAmount(e.detail.value)}
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
                            type="date"
                            required
                            value={editAdditionalDate}
                            onIonInput={(e) => setEditAdditionalDate(e.detail.value)}
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
                          onClick={() => setEditingAdditionalId(null)}
                          className="p-1.5 rounded-lg rounded-btn-square bg-white/5 text-slate-400 hover:text-white"
                        >
                          <IonIcon icon={closeOutline} className="w-4 h-4" />
                        </button>
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg rounded-btn-square bg-emerald-500 text-slate-950 font-bold"
                        >
                          <IonIcon
                            icon={checkmarkOutline}
                            className="w-4 h-4 stroke-[2.5]"
                          />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-slate-950/40 border border-white/5 rounded-xl p-3 hover:border-emerald-500/20 transition-all">
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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditAdditional(item)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl rounded-btn-square border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-white active:scale-95"
                            aria-label={`Edit ${item.description}`}
                            title="Edit"
                          >
                            <IonIcon icon={createOutline} className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteAdditionalIncome(item.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl rounded-btn-square border border-white/5 bg-white/5 text-slate-300 transition-all hover:text-rose-400 active:scale-95"
                            aria-label={`Delete ${item.description}`}
                            title="Delete"
                          >
                            <IonIcon icon={trashOutline} className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </IonCard>
    </div>
  );
}
