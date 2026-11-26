import React, { useRef, useState, useEffect, useCallback } from "react";
// import { GEMINI_API_KEY, GEMINI_MODEL } from "../../../utils/constant";

// ── Palette (matches the prescription-pad look & feel) ─────────────────────
const C = {
  green: "#1b4332",
  greenMid: "#2d6a4f",
  greenLight: "#40916c",
  cream: "#fdf8f0",
  creamDark: "#f0e8d8",
  gold: "#b5853a",
  paper: "#fefcf7",
  border: "#d4c9b5",
  text: "#1c1c1c",
  muted: "#6b7280",
  line: "rgba(190,175,150,0.45)",
  margin: "rgba(210,160,140,0.45)",
  sep: "rgba(170,130,100,0.55)",
};

const PEN_COLOR = "#1c1c1c";
const PEN_WIDTH = 2.5;
const PAGE_H = 380; // logical px per page
const LINE_SPC = 34;
const DPR = window.devicePixelRatio || 1;



const recognizeHandwriting = async (canvasDataUrl) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/png",
                  data: canvasDataUrl.split(",")[1],
                },
              },
              {
                text: "This is handwriting drawn on a canvas. It may contain multiple pages/sections separated by dashed lines — read ALL of them. Transcribe exactly what is written. Return ONLY the transcribed text, nothing else.",
              },
            ],
          },
        ],
      }),
    },
  );
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
};

// ── Smoothing: n passes of weighted-average (Gaussian) smoothing ────────────
function gauss(arr, n) {
  let a = arr;
  for (let p = 0; p < n; p++) {
    const o = [a[0]];
    for (let i = 1; i < a.length - 1; i++)
      o.push({
        x: a[i - 1].x * 0.25 + a[i].x * 0.5 + a[i + 1].x * 0.25,
        y: a[i - 1].y * 0.25 + a[i].y * 0.5 + a[i + 1].y * 0.25,
      });
    o.push(a[a.length - 1]);
    a = o;
  }
  return a;
}

// ── Render one stroke as a smooth Catmull-Rom Bézier spline ────────────────
function smoothStroke(c, raw, color, width) {
  if (!raw.length) return;
  const s = raw.length >= 4 ? gauss(raw, 3) : raw;
  c.save();
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.lineJoin = "round";
  if (s.length === 1) {
    c.fillStyle = color;
    c.beginPath();
    c.arc(s[0].x, s[0].y, width * 0.5, 0, Math.PI * 2);
    c.fill();
  } else if (s.length === 2) {
    c.beginPath();
    c.moveTo(s[0].x, s[0].y);
    c.lineTo(s[1].x, s[1].y);
    c.stroke();
  } else {
    c.beginPath();
    c.moveTo(s[0].x, s[0].y);
    for (let i = 0; i < s.length - 1; i++) {
      const p0 = s[Math.max(0, i - 1)],
        p1 = s[i],
        p2 = s[i + 1],
        p3 = s[Math.min(s.length - 1, i + 2)];
      c.bezierCurveTo(
        p1.x + (p2.x - p0.x) / 6,
        p1.y + (p2.y - p0.y) / 6,
        p2.x - (p3.x - p1.x) / 6,
        p2.y - (p3.y - p1.y) / 6,
        p2.x,
        p2.y,
      );
    }
    c.stroke();
  }
  c.restore();
}

function NotePadModal({ onSave }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const offRef = useRef(null); // offscreen canvas — committed ink only
  const offCtxRef = useRef(null);
  const scrollRef = useRef(null);

  const drawingRef = useRef(false);
  const ptsRef = useRef([]);
  const rafIdRef = useRef(null);
  const sRef = useRef({ left: 0, top: 0 });
  const logWRef = useRef(0);
  const pagesRef = useRef(1);
  const undoRef = useRef([]);

  const hasStrokes = useRef(false);
  const isConverting = useRef(false);

  const [converting, setConverting] = useState(false);
  const [allText, setAllText] = useState("");
  const [empty, setEmpty] = useState(true);
  const [pages, setPages] = useState(1);
  const [canUndo, setCanUndo] = useState(false);

  // ── Offscreen <-> visible plumbing ─────────────────────────────────────────
  const fromOff = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offRef.current, 0, 0);
    ctx.restore(); // back to DPR base transform
  }, []);

  const toOff = useCallback(() => {
    const canvas = canvasRef.current;
    const off = offRef.current;
    off.width = canvas.width;
    off.height = canvas.height;
    const offCtx = off.getContext("2d");
    offCtxRef.current = offCtx;
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.drawImage(canvas, 0, 0);
  }, []);

  // ── Undo: snapshot committed ink before each stroke ─────────────────────────
  const saveUndo = useCallback(() => {
    const off = offRef.current;
    const u = undoRef.current;
    if (u.length >= 24) u.shift();
    const snap = document.createElement("canvas");
    snap.width = off.width;
    snap.height = off.height;
    snap.getContext("2d").drawImage(off, 0, 0);
    u.push({ snap, pages: pagesRef.current });
    setCanUndo(true);
  }, []);

  const doUndo = useCallback(() => {
    const u = undoRef.current;
    if (!u.length) return;
    const { snap, pages: pg } = u.pop();
    const canvas = canvasRef.current;
    const off = offRef.current;
    pagesRef.current = pg;
    if (canvas.width !== snap.width || canvas.height !== snap.height) {
      canvas.width = snap.width;
      canvas.height = snap.height;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctxRef.current = ctx;
    }
    off.width = snap.width;
    off.height = snap.height;
    const offCtx = off.getContext("2d");
    offCtxRef.current = offCtx;
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.drawImage(snap, 0, 0);
    fromOff();
    setPages(pg);
    if (!u.length) {
      hasStrokes.current = false;
      setEmpty(true);
      setCanUndo(false);
    }
  }, [fromOff]);

  // ── White-background, full-height export for OCR ────────────────────────────
  const exportImg = useCallback(() => {
    const canvas = canvasRef.current;
    const t = document.createElement("canvas");
    t.width = canvas.width;
    t.height = canvas.height;
    const tc = t.getContext("2d");
    tc.fillStyle = "#fff";
    tc.fillRect(0, 0, t.width, t.height);
    tc.imageSmoothingEnabled = true;
    tc.imageSmoothingQuality = "high";
    tc.drawImage(canvas, 0, 0);
    return t.toDataURL("image/png");
  }, []);

  // ── Reset the pad to a single blank page (ink only — keeps text) ────────────
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const off = offRef.current;
    pagesRef.current = 1;
    const logH = PAGE_H;
    const logW = logWRef.current;
    canvas.width = Math.round(logW * DPR);
    canvas.height = Math.round(logH * DPR);
    off.width = canvas.width;
    off.height = canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctxRef.current = ctx;
    const offCtx = off.getContext("2d");
    offCtxRef.current = offCtx;
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.clearRect(0, 0, off.width, off.height);
    undoRef.current = [];
    hasStrokes.current = false;
    ptsRef.current = [];
    drawingRef.current = false;
    setPages(1);
    setEmpty(true);
    setCanUndo(false);
  }, []);

  // ── Convert: read ALL pages → append text → reset to blank page 1 ───────────
  const convertToText = useCallback(async () => {
    if (!hasStrokes.current || isConverting.current) return;
    isConverting.current = true;
    setConverting(true);

    const dataUrl = exportImg();
    clearCanvas(); // free the pad immediately

    try {
      const text = await recognizeHandwriting(dataUrl);
      if (text) setAllText((prev) => (prev ? prev + " " + text : text));
    } catch {
      // ignore — don't block future writes
    } finally {
      isConverting.current = false;
      setConverting(false);
    }
  }, [exportImg, clearCanvas]);

  // ── New page: grow the canvas, keep existing ink, scroll into view ──────────
  const addNewPage = useCallback(() => {
    const canvas = canvasRef.current;
    const off = offRef.current;
    const snap = document.createElement("canvas");
    snap.width = off.width;
    snap.height = off.height;
    snap.getContext("2d").drawImage(off, 0, 0);

    pagesRef.current += 1;
    const logH = pagesRef.current * PAGE_H;
    const logW = logWRef.current;
    canvas.width = Math.round(logW * DPR);
    canvas.height = Math.round(logH * DPR);
    off.width = canvas.width;
    off.height = canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctxRef.current = ctx;
    const offCtx = off.getContext("2d");
    offCtxRef.current = offCtx;
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.drawImage(snap, 0, 0);
    fromOff();

    setPages(pagesRef.current);
    setTimeout(() => {
      const a = scrollRef.current;
      if (a) a.scrollTo({ top: a.scrollHeight, behavior: "smooth" });
    }, 60);
  }, [fromOff]);

  // ── Init + smooth drawing engine ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const logW = canvas.offsetWidth;
    logWRef.current = logW;
    const logH = PAGE_H;

    canvas.width = Math.round(logW * DPR);
    canvas.height = Math.round(logH * DPR);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctxRef.current = ctx;

    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    offRef.current = off;
    offCtxRef.current = off.getContext("2d");

    const xy = (e) => ({
      x: e.clientX - sRef.current.left,
      y: e.clientY - sRef.current.top,
    });

    const addPt = (p) => {
      const pts = ptsRef.current;
      if (!pts.length) {
        pts.push(p);
        return;
      }
      const l = pts[pts.length - 1];
      if (Math.hypot(p.x - l.x, p.y - l.y) >= 1.0) pts.push(p);
    };

    const renderLive = () => {
      rafIdRef.current = null;
      fromOff();
      smoothStroke(ctxRef.current, ptsRef.current, PEN_COLOR, PEN_WIDTH);
    };

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      saveUndo(); // snapshot state before this stroke
      drawingRef.current = true;
      ptsRef.current = [];
      const r = canvas.getBoundingClientRect();
      sRef.current = { left: r.left, top: r.top };
      addPt(xy(e));
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      hasStrokes.current = true;
      setEmpty(false);
    };

    const onPointerMove = (e) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [e];
      evs.forEach((ev) => addPt(xy(ev)));
      if (rafIdRef.current) return;
      rafIdRef.current = requestAnimationFrame(renderLive);
    };

    const finishStroke = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      fromOff();
      smoothStroke(ctxRef.current, ptsRef.current, PEN_COLOR, PEN_WIDTH);
      ptsRef.current = [];
      toOff();
    };

    let rzTimer;
    const onResize = () => {
      clearTimeout(rzTimer);
      rzTimer = setTimeout(() => {
        const newW = canvas.offsetWidth;
        if (!newW) return;
        const snap = document.createElement("canvas");
        snap.width = off.width;
        snap.height = off.height;
        snap.getContext("2d").drawImage(off, 0, 0);
        logWRef.current = newW;
        const h = pagesRef.current * PAGE_H;
        canvas.width = Math.round(newW * DPR);
        canvas.height = Math.round(h * DPR);
        off.width = canvas.width;
        off.height = canvas.height;
        const c2 = canvas.getContext("2d");
        c2.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctxRef.current = c2;
        const oc = off.getContext("2d");
        offCtxRef.current = oc;
        oc.setTransform(1, 0, 0, 1, 0, 0);
        oc.drawImage(snap, 0, 0);
        fromOff();
      }, 150);
    };

    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    canvas.addEventListener("pointermove", onPointerMove, { passive: false });
    canvas.addEventListener("pointerup", finishStroke);
    canvas.addEventListener("pointercancel", finishStroke);
    canvas.addEventListener("pointerleave", finishStroke);
    window.addEventListener("resize", onResize);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", finishStroke);
      canvas.removeEventListener("pointercancel", finishStroke);
      canvas.removeEventListener("pointerleave", finishStroke);
      window.removeEventListener("resize", onResize);
      clearTimeout(rzTimer);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [fromOff, toOff, saveUndo]);

  const handleSave = () => {
    if (onSave) onSave(allText);
  };

  const isEmpty = empty && !allText && !converting;
  const contentH = pages * PAGE_H;

  return (
    <div style={S.wrapper}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <span style={S.headerIcon}>✏️</span>
          <span style={S.headerTitle}>Smart Notepad</span>
          {converting && (
            <span style={S.badge}>
              <span style={S.spinner} /> Reading…
            </span>
          )}
        </div>
        <div style={S.headerRight}>
          {allText && (
            <button style={S.saveBtn} onClick={handleSave}>
              💾 Save
            </button>
          )}
          {allText && (
            <button
              style={S.copyBtn}
              onClick={() => navigator.clipboard.writeText(allText)}
            >
              📋 Copy
            </button>
          )}
          {allText && (
            <button style={S.clearTextBtn} onClick={() => setAllText("")}>
              🗑 Clear Text
            </button>
          )}
        </div>
      </div>

      {/* Tools */}
      <div style={S.tools}>
        <span style={S.rx}>Rx</span>
        <button
          style={{ ...S.tb, ...(canUndo ? {} : S.tbDisabled) }}
          onClick={doUndo}
          disabled={!canUndo}
          title="Undo last stroke"
        >
          ↩ Undo
        </button>
        <button style={S.newPageBtn} onClick={addNewPage} title="Add a page">
          ＋ New Page
        </button>
        <button
          style={{
            ...S.convertBtn,
            ...(empty || converting ? S.convertBtnDisabled : {}),
          }}
          onClick={convertToText}
          disabled={empty || converting}
          title="Convert handwriting to text"
        >
          {converting ? (
            <>
              <span style={S.convertSpinner} /> Reading…
            </>
          ) : (
            <>✨ Convert</>
          )}
        </button>
        <span style={S.pageBadge}>Page 1 / {pages}</span>
      </div>

      {/* Writing area (scrolls when multiple pages) */}
      <div style={S.area} ref={scrollRef}>
        <div style={{ ...S.content, height: contentH }}>
          {/* Ruled lines */}
          <div style={S.ruled} aria-hidden="true" />
          {/* Red margin */}
          <div style={S.margin} />
          {/* Page separators */}
          {Array.from({ length: pages - 1 }).map((_, i) => (
            <div key={i} style={{ ...S.pageSep, top: (i + 1) * PAGE_H }}>
              <span style={S.pageSepLbl}>Page {i + 2}</span>
            </div>
          ))}

          {/* Converted text — visible behind the transparent ink canvas */}
          {allText && (
            <div style={S.textResult}>
              {allText.split("\n").map((line, i) => (
                <p key={i} style={S.textLine}>
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* Ink canvas — transparent, always on top, always drawable */}
          <canvas ref={canvasRef} style={{ ...S.canvas, height: contentH }} />

          {/* Placeholder */}
          {isEmpty && (
            <div style={S.placeholder}>
              <p style={S.phLine}>Write notes here…</p>
              <small style={S.phSub}>
                Finger · Stylus · Mouse &nbsp;·&nbsp; ＋ New Page when the pad
                is full
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={S.footer}>
        <span style={S.footerHint}>
          Write your notes → tap <strong>Convert</strong> to read all pages
          &nbsp;•&nbsp; ＋ New Page when full
        </span>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

const S = {
  wrapper: {
    width: "100%",
    background: C.cream,
    border: `1px solid ${C.border}`,
    boxShadow: "0 8px 32px rgba(10,30,70,0.10)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "Nunito, 'Segoe UI', sans-serif",
  },

  // Header
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    background: C.green,
    color: "#fff",
    flexShrink: 0,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
  headerIcon: { fontSize: "17px" },
  headerTitle: { fontSize: "15px", fontWeight: 700, letterSpacing: "0.03em" },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.18)",
    borderRadius: "20px",
    padding: "2px 10px",
    fontSize: "11px",
    fontWeight: 600,
    animation: "fadeIn 0.3s ease",
  },
  headerRight: { display: "flex", gap: "8px" },
  copyBtn: {
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.35)",
    color: "#fff",
    borderRadius: "8px",
    padding: "4px 12px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  clearTextBtn: {
    background: "rgba(239,68,68,0.25)",
    border: "1px solid rgba(239,68,68,0.5)",
    color: "#fff",
    borderRadius: "8px",
    padding: "4px 12px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  saveBtn: {
    background: "rgba(64,145,108,0.55)",
    border: "1px solid rgba(64,145,108,0.85)",
    color: "#fff",
    borderRadius: "8px",
    padding: "4px 12px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },

  // Tools row
  tools: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    padding: "8px 12px",
    background: C.creamDark,
    borderBottom: `1px solid ${C.border}`,
    flexShrink: 0,
  },
  rx: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "26px",
    fontWeight: 700,
    color: C.green,
    lineHeight: 1,
    marginRight: "4px",
  },
  tb: {
    padding: "6px 12px",
    border: `1px solid ${C.border}`,
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    color: C.text,
    flexShrink: 0,
  },
  tbDisabled: { opacity: 0.45, cursor: "not-allowed" },
  newPageBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    background: C.green,
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: "0 2px 6px rgba(27,67,50,0.25)",
  },
  pageBadge: {
    fontSize: "11px",
    fontWeight: 700,
    color: C.muted,
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: "20px",
    padding: "3px 10px",
    flexShrink: 0,
    marginLeft: "auto",
  },

  // Writing area
  area: {
    position: "relative",
    height: `${PAGE_H}px`,
    overflowY: "auto",
    overflowX: "hidden",
    background: C.paper,
  },
  content: { position: "relative", width: "100%", background: C.paper },
  ruled: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${
      LINE_SPC - 1
    }px, ${C.line} ${LINE_SPC - 1}px, ${C.line} ${LINE_SPC}px)`,
  },
  margin: {
    position: "absolute",
    left: "46px",
    top: 0,
    bottom: 0,
    width: "1.5px",
    background: C.margin,
    zIndex: 1,
    pointerEvents: "none",
  },
  pageSep: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 0,
    borderTop: `1.2px dashed ${C.sep}`,
    zIndex: 1,
    pointerEvents: "none",
  },
  pageSepLbl: {
    position: "absolute",
    right: "10px",
    top: "6px",
    fontSize: "11px",
    fontWeight: 700,
    color: "rgba(140,100,75,0.7)",
  },

  textResult: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    padding: "16px 24px 22px 58px",
    pointerEvents: "none",
  },
  textLine: {
    margin: 0,
    fontSize: "17px",
    lineHeight: "2.0",
    color: "#1f2937",
    fontFamily: "Cambria, 'Times New Roman', Georgia, serif",
  },

  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 3,
    cursor: "crosshair",
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
  },

  placeholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: `${PAGE_H}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    pointerEvents: "none",
    textAlign: "center",
  },
  phLine: {
    margin: 0,
    fontFamily: "'Caveat', cursive, sans-serif",
    fontSize: "22px",
    color: "rgba(0,0,0,0.18)",
    fontStyle: "italic",
  },
  phSub: { fontSize: "12px", color: "rgba(0,0,0,0.13)", marginTop: "4px" },

  spinner: {
    width: "12px",
    height: "12px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.75s linear infinite",
    flexShrink: 0,
  },

  // Convert button (toolbar)
  convertBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "6px 14px",
    background: `linear-gradient(135deg, ${C.gold}, #d4a853)`,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(181,133,58,0.3)",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  convertBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  convertSpinner: {
    width: "13px",
    height: "13px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    flexShrink: 0,
  },

  footer: {
    padding: "7px 16px",
    borderTop: `1px solid ${C.border}`,
    background: C.creamDark,
    flexShrink: 0,
  },
  footerHint: { fontSize: "11px", color: C.muted, fontStyle: "italic" },
};

export default NotePadModal;
