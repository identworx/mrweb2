"use client";

interface UsageEntry {
  model: string;
  count: number;
}

export default function MediaUsageList({ usage }: { usage: UsageEntry[] }) {
  if (usage.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">Nicht verwendet.</p>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
      <p className="font-medium mb-1">Verwendet in:</p>
      <ul className="space-y-0.5">
        {usage.map((u, i) => (
          <li key={i}>
            <span className="font-medium">{u.model}</span>: {u.count}x
          </li>
        ))}
      </ul>
    </div>
  );
}
