import React, { useState } from "react";
import {
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonItem,
  IonInput,
} from "@ionic/react";
import {
  settingsOutline,
  logOutOutline,
  createOutline,
  trashOutline,
  checkmarkOutline,
  reorderThree,
} from "ionicons/icons";

export default function ProfileTab({
  session,
  onSignOut,
  selectedCurrency,
  onCurrencyChange,
  userCategories,
  getCategoryIcon,
  colorHexMap,
  iconMap,
  sortedCategoriesList,
  n8nEnabled,
  onN8nToggle,
  n8nUrl,
  onN8nUrlChange,
  n8nNickname,
  onN8nNicknameChange,
  onSendTestWebhook,
  onSaveCategory,
  onDeleteCategory,
  onReorderCategories,
}) {
  const [profileView, setProfileView] = useState("profile"); // 'profile', 'settings', or 'categories'

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
        const orderedKeys = Object.keys(userCategories).sort(
          (a, b) => (userCategories[a].display_order || 0) - (userCategories[b].display_order || 0)
        );
        const reorderedKeys = [...orderedKeys];
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

  // Local state for Category customization form
  const [editingCatKey, setEditingCatKey] = useState(null);
  const [catEditName, setCatEditName] = useState("");
  const [catEditColor, setCatEditColor] = useState("emerald");
  const [catEditIcon, setCatEditIcon] = useState("cashOutline");
  const [catEditKeywords, setCatEditKeywords] = useState("");

  const handleStartEditCategory = (key) => {
    const cat = userCategories[key];
    setEditingCatKey(key);
    setCatEditName(cat.name);
    setCatEditColor(cat.color || "emerald");
    setCatEditIcon(cat.icon || "cashOutline");
    setCatEditKeywords(cat.keywords ? cat.keywords.join(", ") : "");
  };

  const handleCancelEditCategory = () => {
    setEditingCatKey(null);
    setCatEditName("");
    setCatEditColor("emerald");
    setCatEditIcon("cashOutline");
    setCatEditKeywords("");
  };

  const handleCategoryFormSubmit = async (e) => {
    e.preventDefault();
    const keywordsArray = catEditKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const success = await onSaveCategory(editingCatKey, {
      name: catEditName,
      color: catEditColor,
      icon: catEditIcon,
      keywords: keywordsArray,
    });

    if (success) {
      handleCancelEditCategory();
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {profileView === "profile" ? (
        <>
          {/* Active Profile Overview Card */}
          <div className="glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center gap-4">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none" />

            {/* Big Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-white/10 select-none">
              {session?.user?.email ? session.user.email[0].toUpperCase() : "U"}
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
                background: "linear-gradient(to right, #f43f5e, #e11d48)",
                color: "#fff",
                padding: "14px 20px",
                borderRadius: "16px",
                border: "none",
                minHeight: "48px",
              }}
            >
              <IonIcon icon={logOutOutline} className="w-4.5 h-4.5" />
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
                onIonChange={(e) => onCurrencyChange(e.detail.value)}
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
                <IonSelectOption value="USD">US Dollar ($)</IonSelectOption>
                <IonSelectOption value="EUR">Euro (€)</IonSelectOption>
                <IonSelectOption value="JPY">Japanese Yen (¥)</IonSelectOption>
                <IonSelectOption value="GBP">British Pound (£)</IonSelectOption>
              </IonSelect>
            </div>

            <p className="text-[9px] text-slate-400 font-semibold leading-normal italic px-1">
              All cash flows, budgets, expenditures, and logged history will
              format automatically to your chosen currency.
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
                <IonIcon icon={settingsOutline} className="w-4 h-4 text-emerald-400" />
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
                onIonChange={(e) => onN8nToggle(e.detail.checked)}
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
                      onIonInput={(e) => onN8nUrlChange(e.detail.value)}
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
                      onIonInput={(e) => onN8nNicknameChange(e.detail.value)}
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
                  onClick={onSendTestWebhook}
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
              Sends expense logs in real-time to your local n8n workflows for
              broadcast notifications in your family chat.
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
                .sort(
                  (a, b) =>
                    (userCategories[a].display_order || 0) -
                    (userCategories[b].display_order || 0)
                )
                .map((key, index, sortedKeys) => {
                  const cat = userCategories[key];
                  const isOther = key === "Other";
                  const isDragging = draggedIndex === index;
                  const isDragOver = dragOverIndex === index && draggedIndex !== index;
                  
                  return (
                    <div
                      key={key}
                      data-index={index}
                      className={`flex items-center justify-between bg-slate-950/40 border rounded-2xl p-4 transition-all duration-200 select-none ${
                        isDragging ? "opacity-30 border-dashed border-slate-700" : ""
                      } ${
                        isDragOver ? "border-emerald-500/50 bg-slate-900/60 scale-[1.01]" : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1 pr-2">
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
                          className="w-8 h-8 -ml-2 -my-2 flex items-center justify-center text-slate-500 shrink-0 select-none cursor-grab active:cursor-grabbing touch-none"
                          style={{ touchAction: "none" }}
                        >
                          <IonIcon
                            icon={reorderThree}
                            className="w-5 h-5 pointer-events-none"
                          />
                        </div>
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
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(key)}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex"
                          title="Edit Category"
                        >
                          <IonIcon icon={createOutline} className="w-4.5 h-4.5 block" />
                        </button>
                        {!isOther && (
                          <button
                            type="button"
                            onClick={() => onDeleteCategory(key)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-rose-400 transition-all cursor-pointer flex"
                            title="Delete Category"
                          >
                            <IonIcon icon={trashOutline} className="w-4.5 h-4.5 block" />
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
                {editingCatKey ? `Edit "${editingCatKey}"` : "Add Custom Category"}
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

            <form onSubmit={handleCategoryFormSubmit} className="space-y-5">
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
                    onIonInput={(e) => setCatEditName(e.detail.value)}
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
                    onIonInput={(e) => setCatEditKeywords(e.detail.value)}
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
                          transform: isSelected ? "scale(1.15)" : "scale(1)",
                          boxShadow: isSelected ? `0 0 14px ${hex}` : "none",
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
                  background: "linear-gradient(to right, #10b981, #14b8a6)",
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
                  {editingCatKey ? "Save Category" : "Create Category"}
                </span>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
