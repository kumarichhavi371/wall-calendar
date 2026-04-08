import { useState, useEffect, useRef } from "react";
import "./WallCalendar.css";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const MONTH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=900&q=80", label: "Winter Peaks" },
  { url: "https://images.unsplash.com/photo-1518737010536-4d1b51b14e59?w=900&q=80", label: "Spring Bloom" },
  { url: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=900&q=80", label: "Ocean Cliffs" },
  { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80", label: "Forest Path" },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80", label: "Mountain Mist" },
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80", label: "Golden Hour" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80", label: "Coastal Calm" },
  { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80", label: "Summer Dusk" },
  { url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=900&q=80", label: "Autumn Valley" },
  { url: "https://images.unsplash.com/photo-1445964047600-cdbdb873673d?w=900&q=80", label: "Morning Lake" },
  { url: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=80", label: "Snowy Ridge" },
  { url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=80", label: "Winter Night" },
];

const HOLIDAYS = {
  "1-1": "New Year's Day",
  "2-14": "Valentine's Day",
  "3-17": "St. Patrick's Day",
  "4-22": "Earth Day",
  "5-12": "Mother's Day",
  "6-19": "Juneteenth",
  "7-4": "Independence Day",
  "9-1": "Labor Day",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
  "11-27": "Thanksgiving",
  "12-25": "Christmas",
  "12-31": "New Year's Eve",
};

const THEMES = [
  { name: "Alpine",  accent: "#1a7fe0", accentLight: "#e3f0fc" },
  { name: "Forest",  accent: "#2d7d46", accentLight: "#e6f4ea" },
  { name: "Sunset",  accent: "#c0392b", accentLight: "#fdecea" },
  { name: "Dusk",    accent: "#7c3aed", accentLight: "#f0eaff" },
];

/* ── helpers ── */
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay    = (y, m) => new Date(y, m, 1).getDay();
const toMs  = (c) => new Date(c.year, c.month, c.day).getTime();
const sameDay = (a, b) => a && b && a.year===b.year && a.month===b.month && a.day===b.day;
const dateKey = (y, m, d) => `${y}-${m}-${d}`;

function inRange(cell, s, e) {
  if (!s || !e) return false;
  const [lo, hi] = toMs(s) <= toMs(e) ? [s, e] : [e, s];
  const t = toMs(cell);
  return t > toMs(lo) && t < toMs(hi);
}
function isRangeStart(cell, s, e) {
  if (!s || !e) return false;
  return toMs(s) <= toMs(e) ? sameDay(cell, s) : sameDay(cell, e);
}
function isRangeEnd(cell, s, e) {
  if (!s || !e) return false;
  return toMs(s) <= toMs(e) ? sameDay(cell, e) : sameDay(cell, s);
}
function rangeLabel(s, e) {
  if (!s) return null;
  const fmt = c => `${MONTHS[c.month].slice(0,3)} ${c.day}, ${c.year}`;
  if (!e) return `From: ${fmt(s)}`;
  const [lo, hi] = toMs(s) <= toMs(e) ? [s, e] : [e, s];
  const days = Math.round((toMs(hi) - toMs(lo)) / 86400000) + 1;
  return `${fmt(lo)} → ${fmt(hi)}  ·  ${days} day${days > 1 ? "s" : ""}`;
}

/* ══════════════════════════════════════════ */
export default function WallCalendar() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd,   setRangeEnd]   = useState(null);
  const [hoverDay,   setHoverDay]   = useState(null);
  const [selecting,  setSelecting]  = useState(false);
  const [notes,      setNotes]      = useState({});
  const [noteInput,  setNoteInput]  = useState("");
  const [themeIdx,   setThemeIdx]   = useState(0);
  const [flipping,   setFlipping]   = useState(false);
  const [flipDir,    setFlipDir]    = useState(1);
  const noteRef = useRef(null);

  const theme = THEMES[themeIdx];
  const img   = MONTH_IMAGES[viewMonth];

  /* focus textarea when note context changes */
  useEffect(() => { noteRef.current?.focus(); }, [rangeStart, rangeEnd]);

  /* navigation with flip animation */
  function navigate(dir) {
    if (flipping) return;
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setViewMonth(prev => {
        let nm = prev + dir;
        if (nm < 0)  { setViewYear(y => y - 1); return 11; }
        if (nm > 11) { setViewYear(y => y + 1); return 0; }
        return nm;
      });
      setFlipping(false);
    }, 350);
  }

  /* date selection */
  function handleDayClick(day) {
    const cell = { year: viewYear, month: viewMonth, day };
    if (!selecting || (rangeStart && rangeEnd)) {
      setRangeStart(cell); setRangeEnd(null); setSelecting(true);
    } else {
      setRangeEnd(cell); setSelecting(false);
    }
  }

  const effEnd = selecting && hoverDay ? hoverDay : rangeEnd;

  /* note keys */
  const monthKey = `month-${viewYear}-${viewMonth}`;
  const rk = rangeStart && rangeEnd
    ? `range-${dateKey(rangeStart.year,rangeStart.month,rangeStart.day)}-${dateKey(rangeEnd.year,rangeEnd.month,rangeEnd.day)}`
    : null;
  const noteKey   = rk || monthKey;
  const curNotes  = notes[noteKey] || [];

  function saveNote() {
    if (!noteInput.trim()) return;
    setNotes(n => ({ ...n, [noteKey]: [...(n[noteKey] || []), { text: noteInput.trim(), ts: Date.now() }] }));
    setNoteInput("");
  }
  function deleteNote(idx) {
    setNotes(n => {
      const arr = (n[noteKey] || []).filter((_, i) => i !== idx);
      const next = { ...n };
      arr.length ? (next[noteKey] = arr) : delete next[noteKey];
      return next;
    });
  }

  /* build calendar cells */
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDay(viewYear, viewMonth);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  /* holidays this month */
  const thisMonthHolidays = Object.entries(HOLIDAYS)
    .filter(([k]) => parseInt(k.split("-")[0]) === viewMonth + 1);

  return (
    <div className="cal-root">

      {/* theme chooser */}
      <div className="theme-bar">
        {THEMES.map((t, i) => (
          <button
            key={i} title={t.name}
            className={`theme-dot ${i === themeIdx ? "active" : ""}`}
            style={{ background: t.accent }}
            onClick={() => setThemeIdx(i)}
          />
        ))}
      </div>

      {/* the "book" */}
      <div className="cal-book">

        {/* spiral binding */}
        <div className="cal-binding">
          {Array.from({ length: 22 }).map((_, i) => <div key={i} className="cal-ring" />)}
        </div>

        {/* page (animates on month change) */}
        <div
          className={`cal-page ${flipping ? "flipping" : ""}`}
          style={{ transformOrigin: flipDir > 0 ? "left center" : "right center" }}
        >

          {/* hero image */}
          <div className="cal-hero">
            <img src={img.url} alt={img.label} />
            <div className="cal-cut-left"  style={{ background: theme.accent }} />
            <div className="cal-cut-right" style={{ background: theme.accent }} />
            <div className="cal-month-label">
              <div className="cal-year-txt">{viewYear}</div>
              <div className="cal-month-txt">{MONTHS[viewMonth]}</div>
            </div>
            <div className="cal-img-label">{img.label}</div>
            <button className="cal-nav-btn left"  onClick={() => navigate(-1)}>‹</button>
            <button className="cal-nav-btn right" onClick={() => navigate(1)}>›</button>
          </div>

          {/* body: notes | grid */}
          <div className="cal-body">

            {/* ── notes panel ── */}
            <div className="notes-panel">
              <div className="notes-label">{rk ? "Range Notes" : "Month Notes"}</div>
              {rk && (
                <div className="range-info" style={{ color: theme.accent }}>
                  {rangeLabel(rangeStart, rangeEnd)}
                </div>
              )}

              <div className="notes-list">
                {curNotes.length === 0
                  ? <div className="notes-empty">No notes yet…</div>
                  : curNotes.map((n, i) => (
                    <div key={n.ts} className="note-item" style={{ borderLeft: `3px solid ${theme.accent}` }}>
                      {n.text}
                      <button className="note-del" onClick={() => deleteNote(i)}>×</button>
                    </div>
                  ))
                }
              </div>

              <textarea
                ref={noteRef}
                className="note-ta"
                rows={3}
                placeholder="Add a note… (Enter to save)"
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveNote(); } }}
              />
              <button
                className="note-save-btn"
                style={{ background: theme.accent }}
                onClick={saveNote}
              >Save Note</button>

              {rangeStart && (
                <div className="sel-section">
                  <div className="notes-label">Selection</div>
                  <div className="sel-info">{rangeLabel(rangeStart, effEnd) || ""}</div>
                  <button
                    className="sel-clear-btn"
                    style={{ border: `1px solid ${theme.accent}`, color: theme.accent }}
                    onClick={() => { setRangeStart(null); setRangeEnd(null); setSelecting(false); setHoverDay(null); }}
                  >Clear selection</button>
                </div>
              )}
            </div>

            {/* ── grid panel ── */}
            <div className="grid-panel">

              {/* day headers */}
              <div className="day-headers">
                {DAYS_SHORT.map((d, i) => (
                  <div
                    key={d} className="day-header"
                    style={{ color: i === 0 || i === 6 ? theme.accent : "#bbb" }}
                  >{d}</div>
                ))}
              </div>

              {/* cells */}
              <div className="day-cells">
                {cells.map((day, idx) => {
                  if (!day) return <div key={`e${idx}`} className="cell-empty" />;

                  const cell = { year: viewYear, month: viewMonth, day };
                  const isToday   = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                  const isSt      = rangeStart && isRangeStart(cell, rangeStart, effEnd || rangeStart);
                  const isEn      = effEnd && isRangeEnd(cell, rangeStart, effEnd);
                  const inRng     = inRange(cell, rangeStart, effEnd);
                  const isWeekend = idx % 7 === 0 || idx % 7 === 6;
                  const holiday   = HOLIDAYS[`${viewMonth + 1}-${day}`];
                  const isSel     = isSt || isEn;
                  const hasNote   = Object.keys(notes).some(k => k.includes(dateKey(viewYear, viewMonth, day)));

                  let cellBg = "transparent";
                  let cellBr = "50%";
                  if (isSel) {
                    cellBg = theme.accent;
                    cellBr = isSt && isEn ? "50%" : isSt ? "50% 0 0 50%" : "0 50% 50% 0";
                  } else if (inRng) {
                    cellBg = theme.accentLight;
                    cellBr = "0";
                  }

                  return (
                    <div
                      key={day}
                      className="day-cell"
                      style={{ background: cellBg, borderRadius: cellBr, cursor: "pointer" }}
                      title={holiday || undefined}
                      onClick={() => handleDayClick(day)}
                      onMouseEnter={() => { if (selecting && rangeStart) setHoverDay(cell); }}
                      onMouseLeave={() => setHoverDay(null)}
                    >
                      <div
                        className="day-inner"
                        style={{
                          color: isSel ? "#fff" : isWeekend ? theme.accent : "#333",
                          fontWeight: isToday || isSel ? 700 : 400,
                          background: isToday && !isSel ? theme.accentLight : "transparent",
                          border: isToday && !isSel ? `1.5px solid ${theme.accent}` : "none",
                        }}
                      >
                        {day}
                        {holiday && (
                          <span
                            className="hol-dot"
                            style={{ background: isSel ? "rgba(255,255,255,0.7)" : theme.accent }}
                          />
                        )}
                      </div>
                      {hasNote && !isSel && (
                        <span className="note-indicator" style={{ background: theme.accent }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* holiday legend */}
              {thisMonthHolidays.length > 0 && (
                <div className="hol-legend">
                  {thisMonthHolidays.map(([k, name]) => (
                    <div key={k} className="hol-badge">
                      <span className="hol-badge-dot" style={{ background: theme.accent }} />
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* footer */}
          <div className="cal-footer">
            <div className="month-dots">
              {MONTHS.map((m, i) => (
                <div
                  key={m} className="month-dot" title={m}
                  style={{
                    background: i === viewMonth ? theme.accent : "#ccc",
                    transform: i === viewMonth ? "scale(1.5)" : "scale(1)",
                  }}
                  onClick={() => setViewMonth(i)}
                />
              ))}
            </div>
            <div className="cal-status">
              {selecting
                ? "Click end date to finish range"
                : rangeEnd
                  ? rangeLabel(rangeStart, rangeEnd)
                  : rangeStart
                    ? "Click end date"
                    : "Click a date to start selecting"}
            </div>
          </div>

        </div>{/* end cal-page */}
      </div>{/* end cal-book */}
    </div>
  );
}
