import React from 'react';

export function LineChart({ labels = [], series = [], height = 220, colors = ['#3b82f6', '#f59e0b', '#10b981'] }) {
  const width = 600; // logical width for viewBox
  const margin = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const maxY = Math.max(1, ...series.flatMap(s => s.values));
  const minY = 0;
  const xStep = labels.length > 1 ? innerW / (labels.length - 1) : innerW;
  const yScale = (v) => innerH - ((v - minY) / (maxY - minY)) * innerH;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      {/* axes */}
      <g transform={`translate(${margin.left},${margin.top})`}>
        <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#cbd5e1" />
        <line x1={0} y1={0} x2={0} y2={innerH} stroke="#cbd5e1" />
        {/* x labels */}
        {labels.map((lab, i) => (
          <text key={lab + i} x={i * xStep} y={innerH + 20} textAnchor="middle" fontSize="10" fill="#475569">
            {lab}
          </text>
        ))}
        {/* y ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
          const y = yScale(minY + t * (maxY - minY));
          const val = Math.round(minY + t * (maxY - minY));
          return (
            <g key={idx}>
              <line x1={0} y1={y} x2={innerW} y2={y} stroke="#e2e8f0" />
              <text x={-8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">{val}</text>
            </g>
          );
        })}
        {/* series */}
        {series.map((s, si) => {
          const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${yScale(v)}`).join(' ');
          const color = colors[si % colors.length];
          return (
            <g key={s.label}>
              <path d={d} fill="none" stroke={color} strokeWidth={2} />
              {s.values.map((v, i) => (
                <circle key={i} cx={i * xStep} cy={yScale(v)} r={2.6} fill={color} />
              ))}
            </g>
          );
        })}
      </g>
      {/* legend */}
      <g transform={`translate(${margin.left},${margin.top - 6})`}>
        {series.map((s, si) => (
          <g key={s.label} transform={`translate(${si * 140},0)`}>
            <rect width="10" height="10" fill={colors[si % colors.length]} rx="2" />
            <text x="14" y="9" fontSize="11" fill="#334155">{s.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function BarChart({ data = [], height = 220, color = '#4f46e5' }) {
  const width = 600; // logical width for viewBox
  const margin = { top: 16, right: 16, bottom: 40, left: 36 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const maxV = Math.max(1, ...data.map(d => d.value));
  const barW = innerW / Math.max(1, data.length);
  const yScale = (v) => innerH - (v / maxV) * innerH;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${margin.left},${margin.top})`}>
        <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#cbd5e1" />
        {data.map((d, i) => (
          <g key={d.label} transform={`translate(${i * barW},0)`}>
            <rect x={barW * 0.15} width={barW * 0.7} y={yScale(d.value)} height={innerH - yScale(d.value)} fill={color} rx="6" />
            <text x={barW * 0.5} y={innerH + 14} textAnchor="middle" fontSize="10" fill="#475569">{d.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function DonutChart({ data = [], height = 220, innerRatio = 0.6 }) {
  const width = 600;
  const cx = width / 2;
  const cy = height / 2 + 4;
  const radius = Math.min(width, height) / 2 - 12;
  const innerR = radius * innerRatio;
  const total = data.reduce((a, b) => a + b.value, 0) || 1;

  let acc = 0;
  const arcs = data.map((d) => {
    const start = (acc / total) * Math.PI * 2;
    acc += d.value;
    const end = (acc / total) * Math.PI * 2;
    const largeArc = end - start > Math.PI ? 1 : 0;
    const x0 = cx + radius * Math.cos(start), y0 = cy + radius * Math.sin(start);
    const x1 = cx + radius * Math.cos(end), y1 = cy + radius * Math.sin(end);
    const xi0 = cx + innerR * Math.cos(end), yi0 = cy + innerR * Math.sin(end);
    const xi1 = cx + innerR * Math.cos(start), yi1 = cy + innerR * Math.sin(start);
    const dPath = [
      `M ${x0} ${y0}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1}`,
      `L ${xi0} ${yi0}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi1} ${yi1}`,
      'Z'
    ].join(' ');
    return { d, dPath };
  });

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      {arcs.map((a, i) => (
        <path key={i} d={a.dPath} fill={a.d.color || '#64748b'} stroke="white" strokeWidth="2" />
      ))}
      {/* Legend */}
      <g transform={`translate(16,16)`}>
        {data.map((d, i) => (
          <g key={d.label} transform={`translate(0, ${i * 18})`}>
            <rect width="10" height="10" fill={d.color || '#64748b'} rx="2" />
            <text x="14" y="9" fontSize="11" fill="#334155">{d.label} ({Math.round((d.value / total) * 100)}%)</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function StackedBarChart({ data = [], height = 220, palette = ['#22c55e','#f59e0b','#3b82f6','#64748b'] }) {
  const width = 600;
  const margin = { top: 24, right: 16, bottom: 40, left: 16 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const barW = innerW / Math.max(1, data.length);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((d, i) => {
          const total = d.segments.reduce((a, s) => a + s.value, 0) || 1;
          let acc = 0;
          return (
            <g key={d.label} transform={`translate(${i * barW},0)`}>
              <rect x={0} y={0} width={barW * 0.9} height={innerH} fill="#eef2ff" rx="8" />
              {d.segments.map((s, si) => {
                const frac = s.value / total;
                const w = (barW * 0.9) * frac;
                const x = (barW * 0.0) + (barW * 0.9) * (acc / total);
                acc += s.value;
                const color = s.color || palette[si % palette.length];
                const showPct = frac >= 0.08;
                return (
                  <g key={s.label}>
                    <rect x={x} y={0} width={w} height={innerH} fill={color} rx="8" />
                    {showPct && (
                      <text x={x + w / 2} y={innerH / 2} textAnchor="middle" fontSize="12" fill="#ffffff" fontWeight="700">
                        {Math.round(frac * 100)}%
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={barW * 0.45} y={innerH + 16} textAnchor="middle" fontSize="11" fill="#334155">{d.label}</text>
            </g>
          );
        })}
      </g>
      {/* Legend */}
      {data[0] && data[0].segments && (
        <g transform={`translate(${margin.left},${margin.top - 8})`}>
          {data[0].segments.map((s, si) => (
            <g key={s.label} transform={`translate(${si * 180},0)`}>
              <rect width="10" height="10" fill={s.color || palette[si % palette.length]} rx="2" />
              <text x="14" y="9" fontSize="11" fill="#334155">{s.label}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export function FunnelChart({
  steps = [],
  height = 240,
  palette = ['#ef4444', '#f59e0b', '#a855f7', '#fb7185', '#f97316'] // warm tones: red -> orange -> violet
}) {
  const width = 600;
  const margin = { top: 16, right: 16, bottom: 24, left: 160 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const n = Math.max(1, steps.length);
  const gap = 6;
  const bandH = (innerH - gap * (n - 1)) / n;
  const base = steps[0] ? (steps[0].value || 1) : 1;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      <g transform={`translate(${margin.left},${margin.top})`}>
        {steps.map((s, i) => {
          const topFrac = Math.max(0, (s.value || 0) / base);
          // For the last step, gently taper by 15% for visual flow
          const nextFrac = steps[i + 1] ? Math.max(0, (steps[i + 1].value || 0) / base) : Math.max(0.1, topFrac * 0.85);
          const yTop = i * (bandH + gap);
          const yBot = yTop + bandH;
          const wTop = innerW * topFrac;
          const wBot = innerW * nextFrac;
          const cx = innerW / 2;
          const xLT = cx - wTop / 2;
          const xRT = cx + wTop / 2;
          const xLB = cx - wBot / 2;
          const xRB = cx + wBot / 2;
          const color = s.color || palette[i % palette.length];
          const pct = Math.round(topFrac * 100);

          const dPath = [
            `M ${xLT} ${yTop}`,
            `L ${xRT} ${yTop}`,
            `L ${xRB} ${yBot}`,
            `L ${xLB} ${yBot}`,
            'Z'
          ].join(' ');

          return (
            <g key={s.label || i}>
              <path d={dPath} fill={color} opacity={0.9} stroke="#ffffff" strokeWidth="2" />
              {/* Left labels */}
              <text x={-12} y={yTop + bandH / 2} textAnchor="end" dominantBaseline="middle" fontSize="12" fill="#0f172a" fontWeight="600">
                {s.label}
              </text>
              {/* Right percentage */}
              <text x={innerW + 8} y={yTop + bandH / 2} textAnchor="start" dominantBaseline="middle" fontSize="12" fill="#334155" fontWeight="700">
                {pct}%
              </text>
            </g>
          );
        })}
      </g>
      {/* Header labels for context */}
      {steps.length > 0 && (
        <g transform={`translate(0, ${margin.top - 6})`}>
          <text x={margin.left - 12} y={0} textAnchor="end" fontSize="11" fill="#64748b">Etapa</text>
          <text x={width - margin.right} y={0} textAnchor="end" fontSize="11" fill="#64748b">% sobre denuncias</text>
        </g>
      )}
    </svg>
  );
}
