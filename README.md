# 💸 Easy Moneytoring

**Easy Moneytoring** is a premium, high-end, personal finance tracking web and native mobile application built with **React**, **Ionic Framework**, **Vite**, and **Supabase**. It features real-time cloud synchronization, natural language transaction inputs with manual category overrides, recurring bill management, cash flow tracking, local n8n task automations, and custom category drag-and-order customizers.

---

## ✨ Primary Features & Functionalities

### 1. 📊 Interactive Dashboard & Intelligent Budgeting
* **Real-time Spending Visualizations**: Dynamic high-contrast progress bars and visual stacked indicators detailing your current month's budget usage.
* **Cash Flow Balancer**: Automatically incorporates multi-source baseline income, fixed expenses (bills), and variable expenditures to compute remaining cash flow.
* **Expense Breakdown List**: Sorts and summarizes spending metrics by category in real-time, with interactive category filters.

### 2. ⚡ Natural Language "Quick Log"
* **Intelligent Auto-Categorization**: Enter transactions naturally (e.g., `"Starbucks 12.50"` or `"70 Costco grocery"`). The built-in semantic parser instantly extracts description, cost, and auto-detects the matching category based on keywords.
* **Manual Category Override Dropdown**: If auto-detection falls back to `Other`, you can manually choose your desired custom category directly in the quick logger before saving!

### 3. 🔄 Comprehensive Cloud Sync & Auto-Migration
* **Supabase Core Integration**: Safe authentication and real-time syncing of categories, recurring bills, variable expenses, baseline income, and one-off cash receipts.
* **Offline-to-Cloud Migration**: Detects local browser data and migrates your pre-existing categories to Supabase automatically on first load with zero data loss.

### 4. 🛠️ Interactive Category Customizer
* **Custom Arranging Control**: Arrange categories in your preferred custom order using glassmorphic **Up and Down arrow buttons** inside your Profile settings.
* **Global Synchronization**: Custom sorting instantly cascades throughout the entire application, dynamically updating selection lists, transaction filters, progress charts, and breakdowns.
* **Design Settings**: Add custom categories, select color presets, map dynamic parsing keywords, and select beautiful Ionic icons.

### 5. 👆 Frictionless Expense Editing
* **Gestures & Inline Buttons**: Swipe right on any logged transaction item inside the History tab list to reveal touch-friendly **Edit** sliders, or tap the responsive inline pencil button.
* **Glassmorphic Transaction Editor**: Modify descriptions, amounts, categories, and local calendar date-time values in an elegant, responsive dark-mode modal.

### 6. 📈 Additional One-Off Income History
* **Cash Flow History Card**: Features a scrollable list inside the Cash Flow panel logging every additional one-off cash receipt for the current month.
* **Instant Row Deletion**: Embedded trash action button next to each entry to instantly delete records from Supabase and subtract them from your live budget totals in real-time.

### 7. 🔗 local n8n Webhook Alerts
* **Broadcast Integrations**: Turn on live alerts inside settings to push newly logged transactions to local or self-hosted n8n automation instances (e.g. to broadcast who spent what in a Discord, Slack, or Telegram family group chat).
* **Diagnostic Console**: Features a visual "Send Test Webhook" diagnostic panel to verify local network tunnels and local webhook listeners in seconds.

---

## 🚀 Setup & Installation Instructions

### 📋 Prerequisites
* **Node.js** (v18+)
* **npm** or **pnpm**
* A free **Supabase** Account (for hosting backend services)

---

### Step 1: Install Dependencies
Clone the repository and run the package installation script:
```bash
npm install
```

---

### Step 2: Configure Environment Variables
Create a `.env` file in your root project directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-api-key
```
*(You can find these keys inside your **Supabase Dashboard -> Project Settings -> API**)*

---

### Step 3: Run Database Migrations
Open your **Supabase Dashboard ➡️ SQL Editor**, paste this complete schema script, and click **Run**. This will create the required tables, check constraints, foreign-key relationships, and row-level security (RLS) policies:

```sql
-- 1. BASELINE INCOME TABLE
create table if not exists public.baseline_income (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  transfer_day integer default 1 not null check (transfer_day >= 1 and transfer_day <= 31),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.baseline_income enable row level security;
create policy "Users can perform all operations on their own baseline income." on public.baseline_income for all using (auth.uid() = user_id);

-- 2. FIXED EXPENSES TABLE
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
create policy "Users can perform all operations on their own fixed expenses." on public.fixed_expenses for all using (auth.uid() = user_id);

-- 3. CUSTOM CATEGORIES TABLE
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
create policy "Users can perform all operations on their own custom categories." on public.custom_categories for all using (auth.uid() = user_id);

-- 4. VARIABLE EXPENSES TABLE
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  category text not null,
  date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.expenses enable row level security;
create policy "Users can perform all operations on their own expenses." on public.expenses for all using (auth.uid() = user_id);

-- 5. ADDITIONAL INCOME TABLE
create table if not exists public.additional_income (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.additional_income enable row level security;
create policy "Users can perform all operations on their own additional income." on public.additional_income for all using (auth.uid() = user_id);
```

---

### Step 4: Run Locally (Web)
Launch the local Vite web development server:
```bash
npm run dev
```
Open **`http://localhost:8100`** in your browser to view your live app!

---

### Step 5: Synchronize with Native Mobile (Android / iOS)
Easy Moneytoring can be compiled into a native mobile app via Capacitor:
1. Build the production web assets:
   ```bash
   npm run build
   ```
2. Sync the compiled bundle to your native targets (e.g. Android):
   ```bash
   npx cap sync android
   ```
3. Open the workspace in **Android Studio**:
   ```bash
   npx cap open android
   ```
4. Build, debug, and run the APK inside Android Studio on a connected device or native emulator!

---

## 🔗 n8n Automations Setup
Please review the step-by-step instructions and copy-paste-ready **n8n Workflow JSONs** inside your local [n8n_integration_guide.md](./n8n_integration_guide.md) to set up Discord/Slack broadcasts when variable expenses are logged!
