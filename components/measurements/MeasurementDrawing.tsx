import type { DrawingType } from "@/lib/mosaroma/measurements";

const STROKE = "#2D2D2D";
const STROKE_LIGHT = "#B8B8B8";
const DIM_COLOR = "#2D2D2D";
const ACCENT = "#E07B12";

function DimLine({
  x1, y1, x2, y2, label, offset = 0, side = "top",
}: {
  x1: number; y1: number; x2: number; y2: number;
  label: string; offset?: number; side?: "top" | "bottom" | "left" | "right";
}) {
  const tickLen = 6;
  const isHorizontal = y1 === y2;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  let textAnchor: "middle" | "start" | "end" = "middle";
  let tx = midX;
  let ty = midY;
  let ticks: React.ReactNode = null;

  if (isHorizontal) {
    ty = side === "top" ? y1 - 8 - offset : y1 + 14 + offset;
    ticks = (
      <>
        <line x1={x1} y1={y1 - tickLen / 2} x2={x1} y2={y1 + tickLen / 2} stroke={DIM_COLOR} strokeWidth="0.8" />
        <line x1={x2} y1={y2 - tickLen / 2} x2={x2} y2={y2 + tickLen / 2} stroke={DIM_COLOR} strokeWidth="0.8" />
      </>
    );
  } else {
    textAnchor = side === "left" ? "end" : "start";
    tx = side === "left" ? x1 - 8 - offset : x1 + 8 + offset;
    ty = midY + 4;
    ticks = (
      <>
        <line x1={x1 - tickLen / 2} y1={y1} x2={x1 + tickLen / 2} y2={y1} stroke={DIM_COLOR} strokeWidth="0.8" />
        <line x1={x2 - tickLen / 2} y1={y2} x2={x2 + tickLen / 2} y2={y2} stroke={DIM_COLOR} strokeWidth="0.8" />
      </>
    );
  }

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DIM_COLOR} strokeWidth="0.8" />
      {ticks}
      <text x={tx} y={ty} textAnchor={textAnchor} fill={DIM_COLOR} fontSize="11" fontFamily="sans-serif" fontWeight="600">
        {label}
      </text>
    </g>
  );
}

function SquareCushion({ size }: { size: number }) {
  const w = 200, h = 180;
  const cx = w / 2, cy = h / 2 + 8;
  const s = 80;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx="6" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <path d={`M${cx - s / 2 + 6},${cy - s / 2 + 6} Q${cx},${cy - s / 2 + 16} ${cx + s / 2 - 6},${cy - s / 2 + 6}`} fill="none" stroke={STROKE_LIGHT} strokeWidth="0.6" />
      <path d={`M${cx - s / 2 + 6},${cy + s / 2 - 6} Q${cx},${cy + s / 2 - 16} ${cx + s / 2 - 6},${cy + s / 2 - 6}`} fill="none" stroke={STROKE_LIGHT} strokeWidth="0.6" />
      <DimLine x1={cx - s / 2} y1={cy - s / 2 - 16} x2={cx + s / 2} y2={cy - s / 2 - 16} label={`${size} cm`} side="top" />
      <DimLine x1={cx + s / 2 + 16} y1={cy - s / 2} x2={cx + s / 2 + 16} y2={cy + s / 2} label={`${size} cm`} side="right" />
    </svg>
  );
}

function SeatCushion() {
  const w = 220, h = 200;
  const ox = 30, oy = 50;
  const pw = 120, ph = 100;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <path d={`M${ox},${oy + 20} Q${ox},${oy} ${ox + 20},${oy} L${ox + pw - 20},${oy} Q${ox + pw},${oy} ${ox + pw},${oy + 20} L${ox + pw},${oy + ph - 10} L${ox},${oy + ph - 10} Z`} fill="none" stroke={STROKE} strokeWidth="1.2" />
      <line x1={ox + pw + 12} y1={oy + ph - 10} x2={ox + pw + 12} y2={oy + ph - 10 - 22} stroke={ACCENT} strokeWidth="1" />
      <line x1={ox + pw + 8} y1={oy + ph - 10} x2={ox + pw + 16} y2={oy + ph - 10} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + pw + 8} y1={oy + ph - 10 - 22} x2={ox + pw + 16} y2={oy + ph - 10 - 22} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + pw + 20} y1={oy + ph - 10 - 30} x2={ox + pw + 20} y2={oy + ph - 10 - 12} stroke={STROKE_LIGHT} strokeWidth="0.5" strokeDasharray="2,2" />
      <DimLine x1={ox} y1={oy - 16} x2={ox + pw} y2={oy - 16} label="46 cm" side="top" />
      <DimLine x1={ox + pw + 28} y1={oy} x2={ox + pw + 28} y2={oy + ph - 10} label="45 cm" side="right" />
    </svg>
  );
}

function SquarePad() {
  const w = 200, h = 170;
  const ox = 45, oy = 40;
  const pw = 100, ph = 90;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <rect x={ox} y={oy} width={pw} height={ph} rx="2" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <line x1={ox + pw + 12} y1={oy + ph} x2={ox + pw + 12} y2={oy + ph - 8} stroke={ACCENT} strokeWidth="1" />
      <line x1={ox + pw + 8} y1={oy + ph} x2={ox + pw + 16} y2={oy + ph} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + pw + 8} y1={oy + ph - 8} x2={ox + pw + 16} y2={oy + ph - 8} stroke={ACCENT} strokeWidth="0.8" />
      <text x={ox + pw + 22} y={oy + ph - 2} fill={DIM_COLOR} fontSize="9" fontFamily="sans-serif">2 cm</text>
      <DimLine x1={ox} y1={oy - 16} x2={ox + pw} y2={oy - 16} label="40 cm" side="top" />
      <DimLine x1={ox - 18} y1={oy} x2={ox - 18} y2={oy + ph} label="40 cm" side="left" />
    </svg>
  );
}

function RoundedPad() {
  const w = 220, h = 180;
  const ox = 50, oy = 45;
  const pw = 110, ph = 90;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <path d={`M${ox},${oy + ph} L${ox},${oy + 20} Q${ox},${oy} ${ox + 20},${oy} L${ox + pw - 20},${oy} Q${ox + pw},${oy} ${ox + pw},${oy + 20} L${ox + pw},${oy + ph} Q${ox + pw / 2},${oy + ph + 12} ${ox},${oy + ph}`} fill="none" stroke={STROKE} strokeWidth="1.2" />
      <line x1={ox + pw + 12} y1={oy + ph} x2={ox + pw + 12} y2={oy + ph - 8} stroke={ACCENT} strokeWidth="1" />
      <line x1={ox + pw + 8} y1={oy + ph} x2={ox + pw + 16} y2={oy + ph} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + pw + 8} y1={oy + ph - 8} x2={ox + pw + 16} y2={oy + ph - 8} stroke={ACCENT} strokeWidth="0.8" />
      <text x={ox + pw + 22} y={oy + ph - 2} fill={DIM_COLOR} fontSize="9" fontFamily="sans-serif">2 cm</text>
      <DimLine x1={ox} y1={oy - 16} x2={ox + pw} y2={oy - 16} label="38 cm" side="top" />
      <DimLine x1={ox - 18} y1={oy} x2={ox - 18} y2={oy + ph} label="40 cm" side="left" />
    </svg>
  );
}

function HighBack() {
  const w = 220, h = 240;
  const ox = 50, oy = 20;
  const bw = 70, bh = 130, sw = 70, sh = 44;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <rect x={ox} y={oy} width={bw} height={bh} rx="4" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <rect x={ox} y={oy + bh} width={sw} height={sh} rx="2" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <DimLine x1={ox} y1={oy - 14} x2={ox + bw} y2={oy - 14} label="48 cm" side="top" />
      <DimLine x1={ox + bw + 18} y1={oy} x2={ox + bw + 18} y2={oy + bh + sh} label="120 cm" side="right" offset={2} />
      <line x1={ox + bw + 10} y1={oy + bh} x2={ox + bw + 28} y2={oy + bh} stroke={STROKE_LIGHT} strokeWidth="0.5" strokeDasharray="2,2" />
      <text x={ox + bw / 2} y={oy + bh + sh + 18} textAnchor="middle" fill={DIM_COLOR} fontSize="9" fontFamily="sans-serif" fontWeight="600">
        48 cm
      </text>
      <line x1={ox + bw + 10} y1={oy + bh + sh} x2={ox + bw + 10 + 6} y2={oy + bh + sh} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + bw + 10} y1={oy + bh + sh - 16} x2={ox + bw + 10 + 6} y2={oy + bh + sh - 16} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + bw + 10} y1={oy + bh + sh} x2={ox + bw + 10} y2={oy + bh + sh - 16} stroke={ACCENT} strokeWidth="0.8" />
      <text x={ox - 8} y={oy + bh + sh - 5} textAnchor="end" fill={DIM_COLOR} fontSize="9" fontFamily="sans-serif">6 cm</text>
    </svg>
  );
}

function LowBack() {
  const w = 220, h = 220;
  const ox = 50, oy = 30;
  const bw = 70, bh = 100, sw = 70, sh = 44;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <rect x={ox} y={oy} width={bw} height={bh} rx="4" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <rect x={ox} y={oy + bh} width={sw} height={sh} rx="2" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <DimLine x1={ox} y1={oy - 14} x2={ox + bw} y2={oy - 14} label="48 cm" side="top" />
      <DimLine x1={ox + bw + 18} y1={oy} x2={ox + bw + 18} y2={oy + bh + sh} label="105 cm" side="right" offset={2} />
      <line x1={ox + bw + 10} y1={oy + bh} x2={ox + bw + 28} y2={oy + bh} stroke={STROKE_LIGHT} strokeWidth="0.5" strokeDasharray="2,2" />
      <text x={ox + bw / 2} y={oy + bh + sh + 18} textAnchor="middle" fill={DIM_COLOR} fontSize="9" fontFamily="sans-serif" fontWeight="600">
        48 cm
      </text>
      <line x1={ox + bw + 10} y1={oy + bh + sh} x2={ox + bw + 10 + 6} y2={oy + bh + sh} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + bw + 10} y1={oy + bh + sh - 16} x2={ox + bw + 10 + 6} y2={oy + bh + sh - 16} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + bw + 10} y1={oy + bh + sh} x2={ox + bw + 10} y2={oy + bh + sh - 16} stroke={ACCENT} strokeWidth="0.8" />
      <text x={ox - 8} y={oy + bh + sh - 5} textAnchor="end" fill={DIM_COLOR} fontSize="9" fontFamily="sans-serif">6 cm</text>
    </svg>
  );
}

function BenchPad() {
  const w = 440, h = 120;
  const ox = 30, oy = 30;
  const pw = 370, ph = 36;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <rect x={ox} y={oy} width={pw} height={ph} rx="3" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <DimLine x1={ox} y1={oy - 14} x2={ox + pw} y2={oy - 14} label="50 cm – 170 cm" side="top" />
      <DimLine x1={ox + pw + 16} y1={oy} x2={ox + pw + 16} y2={oy + ph} label="7 cm" side="right" />
      <text x={ox - 6} y={oy + ph / 2 + 4} textAnchor="end" fill={DIM_COLOR} fontSize="10" fontFamily="sans-serif" fontWeight="600">
        49 cm
      </text>
    </svg>
  );
}

function PoufSmall() {
  const w = 180, h = 180;
  const cx = w / 2, cy = h / 2 + 5;
  const rx = 42, ry = 16;
  const bodyH = 50;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <ellipse cx={cx} cy={cy + bodyH} rx={rx} ry={ry} fill="none" stroke={STROKE} strokeWidth="1.2" />
      <line x1={cx - rx} y1={cy} x2={cx - rx} y2={cy + bodyH} stroke={STROKE} strokeWidth="1.2" />
      <line x1={cx + rx} y1={cy} x2={cx + rx} y2={cy + bodyH} stroke={STROKE} strokeWidth="1.2" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={STROKE} strokeWidth="1.2" />
      <DimLine x1={cx - rx} y1={cy - ry - 16} x2={cx + rx} y2={cy - ry - 16} label="45 cm" side="top" />
      <DimLine x1={cx + rx + 18} y1={cy} x2={cx + rx + 18} y2={cy + bodyH} label="45 cm" side="right" />
    </svg>
  );
}

function PoufLarge() {
  const w = 220, h = 160;
  const cx = w / 2, cy = h / 2 + 5;
  const rx = 58, ry = 18;
  const bodyH = 36;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <ellipse cx={cx} cy={cy + bodyH} rx={rx} ry={ry} fill="none" stroke={STROKE} strokeWidth="1.2" />
      <line x1={cx - rx} y1={cy} x2={cx - rx} y2={cy + bodyH} stroke={STROKE} strokeWidth="1.2" />
      <line x1={cx + rx} y1={cy} x2={cx + rx} y2={cy + bodyH} stroke={STROKE} strokeWidth="1.2" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={STROKE} strokeWidth="1.2" />
      <DimLine x1={cx - rx} y1={cy - ry - 16} x2={cx + rx} y2={cy - ry - 16} label="70 cm" side="top" />
      <DimLine x1={cx + rx + 18} y1={cy} x2={cx + rx + 18} y2={cy + bodyH} label="36 cm" side="right" />
    </svg>
  );
}

function Placemat() {
  const w = 220, h = 170;
  const ox = 40, oy = 40;
  const pw = 130, ph = 90;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <rect x={ox} y={oy} width={pw} height={ph} rx="2" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <DimLine x1={ox} y1={oy - 16} x2={ox + pw} y2={oy - 16} label="45 cm" side="top" />
      <DimLine x1={ox - 18} y1={oy} x2={ox - 18} y2={oy + ph} label="35 cm" side="left" />
      <line x1={ox + pw + 10} y1={oy + ph} x2={ox + pw + 10} y2={oy + ph - 6} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + pw + 7} y1={oy + ph} x2={ox + pw + 13} y2={oy + ph} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + pw + 7} y1={oy + ph - 6} x2={ox + pw + 13} y2={oy + ph - 6} stroke={ACCENT} strokeWidth="0.8" />
      <text x={ox + pw + 20} y={oy + ph - 1} fill={DIM_COLOR} fontSize="9" fontFamily="sans-serif">0,6 cm</text>
    </svg>
  );
}

function TableRunner() {
  const w = 400, h = 130;
  const ox = 30, oy = 40;
  const pw = 330, ph = 50;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <rect x={ox} y={oy} width={pw} height={ph} rx="2" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <DimLine x1={ox} y1={oy - 16} x2={ox + pw} y2={oy - 16} label="120 cm & 130 cm" side="top" />
      <text x={ox - 8} y={oy + ph / 2 + 4} textAnchor="end" fill={DIM_COLOR} fontSize="10" fontFamily="sans-serif" fontWeight="600">
        35 cm & 47,5 cm
      </text>
      <line x1={ox + pw + 10} y1={oy + ph} x2={ox + pw + 10} y2={oy + ph - 6} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + pw + 7} y1={oy + ph} x2={ox + pw + 13} y2={oy + ph} stroke={ACCENT} strokeWidth="0.8" />
      <line x1={ox + pw + 7} y1={oy + ph - 6} x2={ox + pw + 13} y2={oy + ph - 6} stroke={ACCENT} strokeWidth="0.8" />
      <text x={ox + pw + 20} y={oy + ph - 1} fill={DIM_COLOR} fontSize="9" fontFamily="sans-serif">0,6 cm</text>
    </svg>
  );
}

const drawings: Record<DrawingType, React.ReactNode> = {
  "square-cushion": <SquareCushion size={48} />,
  "square-cushion-small": <SquareCushion size={45} />,
  "seat-cushion": <SeatCushion />,
  "square-pad": <SquarePad />,
  "rounded-pad": <RoundedPad />,
  "high-back": <HighBack />,
  "low-back": <LowBack />,
  "bench-pad": <BenchPad />,
  "pouf-small": <PoufSmall />,
  "pouf-large": <PoufLarge />,
  "placemat": <Placemat />,
  "table-runner": <TableRunner />,
};

export default function MeasurementDrawing({ type }: { type: DrawingType }) {
  return <>{drawings[type]}</>;
}
