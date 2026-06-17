"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
}

export default function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-2 text-3xl sm:text-4xl font-bold text-navy">{value}</p>
      {detail && <p className="mt-1 text-xs text-gray-400">{detail}</p>}
    </div>
  );
}
