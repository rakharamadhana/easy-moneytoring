export const categories = {
  Groceries: {
    name: 'Groceries',
    color: 'amber',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
    gradientFrom: 'from-amber-400/20',
    keywords: ['costco', 'walmart', 'grocery', 'groceries', 'safeway', 'whole foods', 'kroger', 'aldi', 'trader joe', 'supermarket', 'food lion', 'lidl', 'h-mart', 'tesco', 'woolworths', 'coles', 'food', 'market', 'snack', 'snacks']
  },
  Luxury: {
    name: 'Luxury',
    color: 'violet',
    textColor: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    borderColor: 'border-violet-400/20',
    gradientFrom: 'from-violet-400/20',
    keywords: ['starbucks', 'cafe', 'restaurant', 'bar', 'coffee', 'boba', 'uber eats', 'doordash', 'mcdonald', 'burger king', 'subway', 'pizza', 'ramen', 'pub', 'grubhub', 'dining', 'steak', 'bistro', 'sushi', 'dunkin', 'juice', 'drink', 'drinks', 'beverage', 'tea', 'dessert', 'bakery']
  },
  Shopping: {
    name: 'Shopping',
    color: 'rose',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/20',
    gradientFrom: 'from-rose-400/20',
    keywords: ['zara', 'amazon', 'target', 'h&m', 'sephora', 'nike', 'adidas', 'mall', 'nordstrom', 'clothing', 'shoes', 'macys', 'best buy', 'ikea', 'shein']
  },
  Transport: {
    name: 'Transport',
    color: 'indigo',
    textColor: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    borderColor: 'border-indigo-400/20',
    gradientFrom: 'from-indigo-400/20',
    keywords: ['gas', 'chevron', 'shell', 'exxon', 'mobil', 'fuel', 'uber', 'lyft', 'taxi', 'subway', 'metro', 'bus', 'train', 'parking', 'transit', 'toll', 'caltex', 'bp']
  },
  Utilities: {
    name: 'Utilities/Bills',
    color: 'sky',
    textColor: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
    borderColor: 'border-sky-400/20',
    gradientFrom: 'from-sky-400/20',
    keywords: ['rent', 'electric', 'water', 'internet', 'comcast', 'netflix', 'spotify', 'insurance', 'phone', 't-mobile', 'verizon', 'at&t', 'power', 'utility', 'bills', 'subscription']
  },
  Other: {
    name: 'Other',
    color: 'slate',
    textColor: 'text-slate-400',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-400/20',
    gradientFrom: 'from-slate-400/20',
    keywords: []
  }
};

/**
 * Auto-categorizes an expense description based on keywords.
 * @param {string} description 
 * @param {object} customCategories Optional dynamic categories dictionary
 * @returns {object} Category configuration
 */
export function getCategoryByDescription(description, customCategories = categories) {
  const fallbackOther = customCategories.Other || categories.Other;
  if (!description) return fallbackOther;
  const desc = description.toLowerCase();
  
  for (const key of Object.keys(customCategories)) {
    if (key === 'Other') continue;
    const cat = customCategories[key];
    if (cat.keywords && cat.keywords.some(keyword => desc.includes(keyword.trim().toLowerCase()))) {
      return cat;
    }
  }
  return fallbackOther;
}

/**
 * Parses a natural language quick input string like "Starbucks 8.50" or "8.50 Starbucks"
 * @param {string} input 
 * @param {object} customCategories Optional dynamic categories dictionary
 * @returns {object} { amount, description, category }
 */
export function parseQuickInput(input, customCategories = categories) {
  const fallbackOther = customCategories.Other || categories.Other;
  if (!input) return { amount: '', description: '', category: fallbackOther };
  
  // Try to find the numeric amount at the end or start of the string
  // Matches optional currency symbols like $, followed by decimal or integer
  const amountRegex = /(?:^|\s)\$?(\d+(?:\.\d{1,2})?)(?:\s|$)/;
  const match = input.match(amountRegex);
  
  let amount = '';
  let description = input.trim();
  
  if (match) {
    amount = match[1];
    // Remove the amount from the description
    description = input.replace(match[0], ' ').replace(/\s+/g, ' ').trim();
  }
  
  // Categorize based on the description
  const category = getCategoryByDescription(description, customCategories);
  
  return {
    amount,
    description,
    category
  };
}
