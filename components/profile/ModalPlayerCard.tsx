"use client";

interface ModalPlayerData {
  country: { value: string; count: number; pct: number };
  foot: { value: string; count: number; pct: number };
  birth_month: { value: string; month_num: number; count: number; pct: number };
  position: { value: string; count: number; pct: number };
  primary_position: { value: string; count: number; pct: number };
  league: { value: string; count: number; pct: number };
  avg_height: number;
  avg_weight: number;
  avg_overall: number;
  total_players: number;
}

interface ModalPlayerCardProps {
  data: ModalPlayerData;
}

export default function ModalPlayerCard({ data }: ModalPlayerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">
        The Typical FIFA Player
      </h3>
      <p className="text-xs text-gray-400 mb-6">
        The most common value for each attribute across all {data.total_players.toLocaleString()} players
      </p>

      {/* FIFA-style card */}
      <div className="max-w-sm mx-auto">
        <div className="relative bg-gradient-to-br from-navy to-navy-light rounded-2xl overflow-hidden text-white p-6 shadow-lg">
          {/* Rating badge */}
          <div className="absolute top-4 left-4">
            <div className="text-4xl font-black leading-none">{data.avg_overall.toFixed(0)}</div>
            <div className="text-[10px] uppercase tracking-widest text-blue-200 mt-0.5">OVR</div>
          </div>

          {/* Position badge */}
          <div className="absolute top-4 right-4 text-right">
            <div className="text-lg font-bold">{data.primary_position.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-blue-200">{data.position.value}</div>
          </div>

          {/* Center content */}
          <div className="text-center pt-14 pb-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center text-4xl mb-3 border-2 border-white/20">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-white/60" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="text-xl font-bold tracking-wide">Modal Player</div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="text-sm text-blue-200">{data.country.value}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 my-4" />

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold">{data.avg_height.toFixed(0)}</div>
              <div className="text-[10px] uppercase tracking-widest text-blue-200">Height cm</div>
            </div>
            <div>
              <div className="text-lg font-bold">{data.avg_weight.toFixed(0)}</div>
              <div className="text-[10px] uppercase tracking-widest text-blue-200">Weight kg</div>
            </div>
            <div>
              <div className="text-lg font-bold">{data.foot.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-blue-200">Foot</div>
            </div>
          </div>
        </div>

        {/* Detail rows below the card */}
        <div className="mt-6 space-y-2">
          {[
            { label: "Most Common Country", value: data.country.value, detail: `${data.country.pct}% of all players (${data.country.count.toLocaleString()})` },
            { label: "Most Common Position", value: data.position.value, detail: `${data.position.pct}% (${data.position.count.toLocaleString()} players)` },
            { label: "Most Common Foot", value: data.foot.value, detail: `${data.foot.pct}% of all players` },
            { label: "Most Common Birth Month", value: data.birth_month.value, detail: `${data.birth_month.pct}% of all players` },
            { label: "Most Common League", value: data.league.value, detail: `${data.league.pct}% of all players` },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5"
            >
              <div>
                <div className="text-xs text-gray-500">{row.label}</div>
                <div className="text-sm font-semibold text-navy">{row.value}</div>
              </div>
              <div className="text-xs text-gray-400 text-right">{row.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
