<div align="center">

# 📅 Wall Calendar

**An interactive React calendar inspired by physical wall calendars — with date range selection, integrated notes, theme switching, and scenic hero images.**

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖼 **Wall Calendar Aesthetic** | Spiral binding, diagonal-cut hero image, clean date grid |
| 🗓 **Date Range Selector** | Click start → hover preview → click end. Visual states for start, in-between, and end days |
| 📝 **Integrated Notes** | Attach notes to a specific month or a selected date range |
| 🎨 **4 Color Themes** | Alpine (blue), Forest (green), Sunset (red), Dusk (purple) |
| 🖼 **12 Scenic Images** | Unique landscape photo auto-loads for each month |
| 🎉 **Holiday Markers** | Dots on holidays with a legend below the grid |
| 📱 **Fully Responsive** | Desktop side-by-side layout collapses to vertical stack on mobile |
| ✨ **Page-Flip Animation** | Smooth flip transition when changing months |

---

## 🖥 Preview

> *(Calendar with spiral binding, scenic hero image, date range selection highlighted in blue, and notes panel on the left)*


<img width="1305" height="912" alt="image" src="https://github.com/user-attachments/assets/fc62bdfa-d275-4dd8-8f3d-cb9c0bfd78f1" />


---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher — [Download here](https://nodejs.org/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kumarichhavi371/wall-calendar.git

# 2. Navigate to the project folder
cd wall-calendar

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
wall-calendar/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── index.js                # React root render
│   ├── index.css               # Global reset styles
│   ├── WallCalendar.jsx        # Main calendar component
│   └── WallCalendar.css        # All component styles
├── package.json
└── README.md
```

---

## 🎯 How to Use

**Navigate months** — Click the `‹` `›` arrows on the hero image, or click any dot in the footer.

**Select a date range**
1. Click any day → it becomes the **start date**
2. Hover over other days to **preview** the range live
3. Click another day → it becomes the **end date**
4. Click **"Clear selection"** to reset

**Add notes**
- With no range selected → note saves to the **current month**
- With a range selected → note saves to that **specific range**
- Press `Enter` to save, or click **"Save Note"**

**Switch themes** — Click any colored dot at the top right of the page.

---

## 🛠 Customization

### Change Themes

Edit the `THEMES` array in `WallCalendar.jsx`:

```js
const THEMES = [
  { name: "Alpine",  accent: "#1a7fe0", accentLight: "#e3f0fc" },
  { name: "Forest",  accent: "#2d7d46", accentLight: "#e6f4ea" },
  // Add your own theme here ↓
  { name: "Ocean",   accent: "#0077b6", accentLight: "#caf0f8" },
];
```

### Change Hero Images

Replace any URL in the `MONTH_IMAGES` array with your own image:

```js
const MONTH_IMAGES = [
  { url: "https://your-image-url.com/january.jpg", label: "Your Label" },
  // ...
];
```

### Add / Edit Holidays

Edit the `HOLIDAYS` object — key format is `"month-day"`:

```js
const HOLIDAYS = {
  "1-26": "Republic Day",    // January 26
  "8-15": "Independence Day", // August 15
  // ...
};
```

---

## 🧰 Tech Stack

- [React 18](https://react.dev/) — UI framework
- [Create React App](https://create-react-app.dev/) — Project scaffolding
- Plain CSS — No external UI library

---


---

<div align="center">
Made with ❤️ 
</div>
