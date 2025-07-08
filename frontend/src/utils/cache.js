// Save data to localStorage
export const saveToCache = (key, value) => {
  try {
    if (value === undefined) return;
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
  } catch (error) {
    console.error(`Error saving ${key} to cache:`, error);
  }
};

// Load data from localStorage
export const loadFromCache = (key) => {
  try {
    if (localStorage.getItem("user") === "undefined") localStorage.removeItem("user");
    if (localStorage.getItem("accessToken") === "undefined") localStorage.removeItem("accessToken");

    const data = localStorage.getItem(key);
    if (!data || data === "undefined") return null;
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading ${key} from cache:`, error);
    return null;
  }
};

// Remove specific cache item
export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing ${key} from cache:`, error);
  }
};

// Clear all cache (use cautiously)
export const clearAllCache = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing all cache:", error);
  }
};

// src/utils/cache.js
// export const saveToCache = (key, value) => {
//   localStorage.setItem(key, JSON.stringify(value));
// };

// export const getFromCache = (key) => {
//   const cached = localStorage.getItem(key);
//   return cached ? JSON.parse(cached) : null;
// };

// export const removeFromCache = (key) => {
//   localStorage.removeItem(key);
// };
