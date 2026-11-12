import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, Maximize2, Minimize2 } from "lucide-react";

// Standard WHO percentile lines (P3/P15/P50/P85/P97) — same colors and set
// used by the print PDF's chart, sourced from the real WHOGrowthStandard table.
const PERCENTILE_KEYS = ["p3", "p15", "p50", "p85", "p97"];
const PERCENTILE_COLORS = {
  p3: "#dc3545",
  p15: "#ff9f1c",
  p50: "#b8860b",
  p85: "#558b2f",
  p97: "#28a745",
};

// Card header + in-chart title, matching the print PDF's two-tier labeling
// ("Weight Growth (0-5 years)" card header + "WHO Weight Chart (0-5 years)"
// title inside the plot).
// Fixed Y-axis ranges matching the print PDF's WHO charts exactly (rather
// than auto-scaling to whatever the patient's own data happens to span).
// yTicks forces clean, evenly-spaced round numbers (e.g. Weight: 0,5,10...25)
// instead of Recharts' default auto tick algorithm, which can land on
// irregular values like 0,7,14,21,25 for an uneven domain.
const CHART_META = {
  height: { cardTitle: "Height Growth (0-5 years)", chartTitle: "WHO Height Chart (0-5 years)", yDomain: [20, 200], yTicks: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200] },
  weight: { cardTitle: "Weight Growth (0-5 years)", chartTitle: "WHO Weight Chart (0-5 years)", yDomain: [0, 120], yTicks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] },
  ofc: { cardTitle: "OFC Growth (0-5 years)", chartTitle: "WHO Head Circumference Chart (0-5 years)", yDomain: [5, 55], yTicks: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] },
  bmi: { cardTitle: "BMI Growth", chartTitle: "BMI Trend", yDomain: ["auto", "auto"], yTicks: undefined },
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function ChildGrowthCharts({
  apiResponse = [],
  whoStandards = [],
  onEdit,
  refprint,
}) {
  /* ---------------- FORMAT API DATA ---------------- */
  const measurements = useMemo(() => {
    if (!Array.isArray(apiResponse)) return [];

    const mapped = apiResponse
      .map((item) => {
        // WHO/IAP 0-5 year growth charts are plotted month-wise, not year-wise.
        const ageInMonths = Number(item?.AgeInMonths) || 0;

        return {
          age: ageInMonths,
          ageLabel: `${item.AgeInMonths} Months`,
          height: Number(item.Height) || 0,
          weight: Number(item.Weight) || 0,
          bmi: Number(item.BMI) || 0,
          ofc: Number(item?.OFC) || 0,
          Id: item.Id,
          updatedAt: item.VisitDate,
          GrowthStatus: item.GrowthStatus || "N/A",
        };
      })
      .sort((a, b) => a.age - b.age);

    // Two visits recorded within the same calendar month share the same
    // whole-number age, which would otherwise plot both points at the exact
    // same x position — visually hiding one behind the other (and leaving no
    // visible connecting line) even though both are present in the data.
    // The x-axis is a fixed 0-60 month window, so the nudge must be large
    // enough to actually separate on that scale (1.5 months ≈ 2.5% of the
    // axis) — a smaller nudge like 0.15 is invisible on a 0-60 range.
    const seenAgeCounts = {};
    mapped.forEach((m) => {
      const occurrence = seenAgeCounts[m.age] || 0;
      seenAgeCounts[m.age] = occurrence + 1;
      m.age = m.age + occurrence * 1.5;
    });

    return mapped;
  }, [apiResponse]);

  /* ---------------- REAL WHO PERCENTILE CURVES ---------------- */
  // Same WHOGrowthStandard source (P3/P15/P50/P85/P97) the print PDF uses —
  // no more fabricated placeholder curves. BMI has no WHO reference table in
  // this system, so its chart intentionally gets no percentile bands.
  const percentileByMetric = useMemo(() => {
    // Guards against the exact cause of "zig-zag"/looping reference curves:
    // if whoStandards ever contains more than one row for the same age (a
    // stray duplicate row, or rows for both genders slipping through), a
    // naive sort-by-age still plots two different values at that same x,
    // so the line jumps back and forth. Dedupe by age (keep the first valid
    // row), drop any row missing a percentile value, then sort ascending.
    const buildCurve = (p3Key, p15Key, p50Key, p85Key, p97Key) => {
      const source = Array.isArray(whoStandards) ? whoStandards : [];
      const byAge = new Map();

      source.forEach((s) => {
        const age = Number(s?.AgeInMonths);
        const p3 = Number(s?.[p3Key]);
        const p15 = Number(s?.[p15Key]);
        const p50 = Number(s?.[p50Key]);
        const p85 = Number(s?.[p85Key]);
        const p97 = Number(s?.[p97Key]);

        const isValid =
          Number.isFinite(age) &&
          age >= 0 &&
          age <= 60 &&
          [p3, p15, p50, p85, p97].every(Number.isFinite);

        if (!isValid || byAge.has(age)) return;

        byAge.set(age, {
          age,
          p3,
          p15,
          p50,
          p85,
          p97,
          // Stacked-area band segments (base + 4 deltas) so the zones between
          // percentile lines render as shaded bands, matching the print PDF.
          bandBase: p3,
          band1: p15 - p3,
          band2: p50 - p15,
          band3: p85 - p50,
          band4: p97 - p85,
        });
      });

      return Array.from(byAge.values()).sort((a, b) => a.age - b.age);
    };

    return {
      height: buildCurve("Height_P3", "Height_P15", "Height_P50", "Height_P85", "Height_P97"),
      weight: buildCurve("Weight_P3", "Weight_P15", "Weight_P50", "Weight_P85", "Weight_P97"),
      ofc: buildCurve("Head_P3", "Head_P15", "Head_P50", "Head_P85", "Head_P97"),
      bmi: [],
    };
  }, [whoStandards]);

  const [globalActivePoint, setGlobalActivePoint] = useState(null);
  const [globalPopupPos, setGlobalPopupPos] = useState({ x: 0, y: 0 });
  return (
    <div
      style={{ background: "#f8f9fa", padding: 20 }}
      ref={refprint}
      id="print-area"
    >
      <div className="row g-4">
        {[
          { key: "height", label: "Height", unit: "cm" },
          { key: "weight", label: "Weight", unit: "kg" },
          { key: "bmi", label: "BMI", unit: "" },
          { key: "ofc", label: "OFC", unit: "cm" },
        ].map((config) => (
          <div className="col-md-6" key={config.key}>
            <ChartCard
              title={config.label}
              cardTitle={CHART_META[config.key].cardTitle}
              chartTitle={CHART_META[config.key].chartTitle}
              yDomain={CHART_META[config.key].yDomain}
              yTicks={CHART_META[config.key].yTicks}
              yLabel={`${config.label}${config.unit ? ` (${config.unit})` : ""}`}
              percentileData={percentileByMetric[config.key]}
              userPoints={measurements}
              dataKey={config.key}
              onPointClick={onEdit}
              activePoint={globalActivePoint}
              setActivePoint={setGlobalActivePoint}
              popupPos={globalPopupPos}
              setPopupPos={setGlobalPopupPos}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- CHART CARD ---------------- */
function ChartCard({
  title,
  cardTitle,
  chartTitle,
  yDomain,
  yTicks,
  yLabel,
  percentileData,
  userPoints,
  dataKey,
  onPointClick,
  activePoint,
  setActivePoint,
  popupPos,
  setPopupPos,
}) {
  const cardRef = useRef(null);
  const chartWrapperRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const POPUP_WIDTH = 260;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === chartWrapperRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      chartWrapperRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // const [activePoint, setActivePoint] = useState(null);
  // const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const formatAge = (ageLabel) => {
    const months = Number(ageLabel.split(" ")[0]);

    if (months >= 12) {
      return `${(months / 12).toFixed(1)} years`;
    }
    return `${months} months`;
  };
  return (
    <div
      // ref={cardRef}
      ref={chartWrapperRef}
      className="card border-0 shadow-sm p-3 chart-card"
      style={{
        background: "white",
        borderRadius: "12px",
        height: isFullscreen ? "100vh" : "auto",
        display: isFullscreen ? "flex" : "block",
        flexDirection: "column",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center mb-1"
        style={{ cursor: "pointer" }}
        onClick={toggleFullscreen}
      >
        <b style={{ fontSize: 14, color: "#2c3e50" }}>
          {cardTitle} <ChevronDown size={12} className="text-muted" />
        </b>
        {isFullscreen ? (
          <Minimize2 size={16} className="text-muted" />
        ) : (
          <Maximize2 size={16} className="text-muted" />
        )}
      </div>

      <div
        className="text-center"
        style={{ fontSize: 11, fontWeight: 700, color: "#37474f" }}
      >
        {chartTitle}
      </div>

      {!(percentileData?.length > 0) && (
        <div
          className="text-muted text-center"
          style={{ fontSize: 10, fontStyle: "italic" }}
        >
          WHO reference curve unavailable — showing patient trend only
        </div>
      )}

      <div
        style={{
          position: "relative",
          flex: isFullscreen ? 1 : "auto",
          minHeight: isFullscreen ? 0 : "auto",
          minWidth: isFullscreen ? 0 : "auto",
          height: isFullscreen ? "100%" : "auto",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height={isFullscreen ? "100%" : 260}
        >
        <ComposedChart
          margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
          id="print-area"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e6ed" />

          {/* <XAxis
            dataKey="age"
            type="number"
            domain={["dataMin", "dataMax + 0.5"]}
            tick={{ fontSize: 10 }}
            label={{
              value: "Age (Years)",
              position: "bottom",
              fontSize: 12,
            }}
          /> */}
          <XAxis
            xAxisId="ageAxis"
            dataKey="age"
            type="number"
            // Always exactly the 0-60 month (WHO 0-5y) window — fixed, not
            // auto-extending, per spec.
            domain={[0, 60]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            allowDecimals={false}
            ticks={[0, 10, 20, 30, 40, 50, 60]}
            tickFormatter={(value) => Math.round(value)}
            label={{
              value: "Age (Months)",
              position: "bottom",
              fontSize: 12,
            }}
          />

          <YAxis
            // Baseline WHO range, but stretches automatically if the patient's
            // actual value exceeds it instead of clipping the point off-chart.
            // BMI has no fixed WHO range (yDomain is the literal ["auto","auto"]
            // sentinel), so it must fall straight through to Recharts' own auto
            // scaling instead of being treated as a numeric baseline to extend
            // (Math.max("auto", dataMax) would otherwise resolve to NaN and blank
            // out the whole chart).
            domain={
              yDomain && yDomain[0] !== "auto"
                ? [yDomain[0], (dataMax) => Math.max(yDomain[1], dataMax)]
                : ["auto", "auto"]
            }
            ticks={yTicks}
            tick={{ fontSize: 10 }}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
            }}
          />

          {/* <Tooltip content={<CustomTooltip />} /> */}

          {percentileData?.length > 0 && (
            <>
              <Area
                data={percentileData}
                xAxisId="ageAxis"
                dataKey="bandBase"
                stackId="pct"
                stroke="none"
                fill="transparent"
                isAnimationActive={false}
              />
              <Area
                data={percentileData}
                xAxisId="ageAxis"
                dataKey="band1"
                stackId="pct"
                stroke="none"
                fill={PERCENTILE_COLORS.p3}
                fillOpacity={0.12}
                isAnimationActive={false}
              />
              <Area
                data={percentileData}
                xAxisId="ageAxis"
                dataKey="band2"
                stackId="pct"
                stroke="none"
                fill={PERCENTILE_COLORS.p50}
                fillOpacity={0.12}
                isAnimationActive={false}
              />
              <Area
                data={percentileData}
                xAxisId="ageAxis"
                dataKey="band3"
                stackId="pct"
                stroke="none"
                fill={PERCENTILE_COLORS.p85}
                fillOpacity={0.12}
                isAnimationActive={false}
              />
              <Area
                data={percentileData}
                xAxisId="ageAxis"
                dataKey="band4"
                stackId="pct"
                stroke="none"
                fill={PERCENTILE_COLORS.p97}
                fillOpacity={0.12}
                isAnimationActive={false}
              />
            </>
          )}

          {percentileData?.length > 0 &&
            PERCENTILE_KEYS.map((p) => (
              <Line
                key={p}
                data={percentileData}
                xAxisId="ageAxis"
                dataKey={p}
                type="natural"
                stroke={PERCENTILE_COLORS[p]}
                dot={false}
                strokeWidth={1}
                label={
                  <PercentileLabel
                    text={p.toUpperCase()}
                    color={PERCENTILE_COLORS[p]}
                    lastIndex={percentileData.length - 1}
                  />
                }
              />
            ))}

          <Line
            data={userPoints}
            xAxisId="ageAxis"
            type="natural"
            dataKey={dataKey}
            stroke="#10b981"
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, index, key } = props;
              if (cx == null || cy == null) return <React.Fragment key={key} />;
              const isLatest = index === userPoints.length - 1;
              return (
                <circle
                  key={key}
                  cx={cx}
                  cy={cy}
                  r={isLatest ? 6 : 4}
                  fill={isLatest ? "#10b981" : "#ffffff"}
                  stroke="#10b981"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={(props) => {
              const { cx, cy, payload } = props;
              if (cx == null || cy == null) return null;

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={7}
                  fill="#10b981"
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => {
                    const rect =
                      chartWrapperRef.current.getBoundingClientRect();

                    const rawX = rect.left + cx;
                    const safeX =
                      rawX + POPUP_WIDTH > window.innerWidth
                        ? rawX - POPUP_WIDTH - 12
                        : rawX + 12;

                    setActivePoint(payload);
                    setPopupPos({
                      x: safeX,
                      y: rect.top + cy,
                    });
                  }}
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      </div>

      {percentileData?.length > 0 && (
        <div
          className="d-flex flex-wrap justify-content-center align-items-center gap-3 mt-1"
          style={{ fontSize: 10, color: "#5a6b7b" }}
        >
          {PERCENTILE_KEYS.map((p) => (
            <span key={p} className="d-flex align-items-center gap-1">
              <span
                style={{
                  width: 16,
                  height: 2,
                  display: "inline-block",
                  background: PERCENTILE_COLORS[p],
                }}
              />
              {p.toUpperCase()}
            </span>
          ))}
          <span className="d-flex align-items-center gap-1">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                display: "inline-block",
                background: "#10b981",
              }}
            />
            Patient Measurement
          </span>
          <span className="d-flex align-items-center gap-1">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                display: "inline-block",
                border: "1.5px solid #10b981",
                background: "#fff",
              }}
            />
            Previous Visits
          </span>
        </div>
      )}

      {activePoint && (
        <>
          <div
            style={{
              position: "absolute",
              top: popupPos.y - 40,
              left: 0,
              right: 0,
              height: 80,
              background: "rgba(0,0,0,0.05)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "fixed",
              top: popupPos.y + 12,
              left: popupPos.x + 12,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
              padding: 12,
              width: 240,
              zIndex: 1000,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <strong>Measurements</strong>

              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{ cursor: "pointer", color: "#10b981" }}
                  onClick={() => onPointClick(activePoint)}
                >
                  ✏️
                </span>

                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setActivePoint(null)}
                >
                  ✕
                </span>
              </div>
            </div>

            {/* Body */}

            <div style={{ fontSize: 12 }}>
              <div>
                <b>Age:</b> {formatAge(activePoint.ageLabel)}
              </div>
              <div>Height: {activePoint.height} cm</div>
              <div>Weight: {activePoint.weight} kg</div>
              <div>BMI: {activePoint.bmi} kg/m²</div>
              <div>OFC: {activePoint.ofc} cm</div>
              <div>Updated: {activePoint.updatedAt}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- CUSTOM LABEL ---------------- */
const PercentileLabel = ({ x, y, index, text, color, lastIndex }) => {
  if (index === lastIndex) {
    return (
      <text x={x + 5} y={y} fill={color} fontSize={9} fontWeight="bold">
        {text}
      </text>
    );
  }
  return null;
};

/* ---------------- TOOLTIP ---------------- */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const userData = payload.find((p) => p.payload.updatedAt)?.payload;
  if (!userData) return null;

  return (
    <div
      style={{
        background: "#e0f7fa",
        borderRadius: 10,
        padding: 12,
        width: 220,
        fontSize: 12,
      }}
    >
      <strong>Measurements</strong>
      <hr />
      <div>Age: {userData.ageLabel}</div>
      <div>Height: {userData.height} cm</div>
      <div>Weight: {userData.weight} kg</div>
      <div>BMI: {userData.bmi}</div>
      <div>Date: {userData.updatedAt}</div>
      <div>Grouth-Status: {userData.GrowthStatus}</div>
    </div>
  );
};
