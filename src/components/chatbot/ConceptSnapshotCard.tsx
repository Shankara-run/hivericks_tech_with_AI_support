import type { SnapshotData } from "./useChat";

type Props = {
  snapshot: SnapshotData;
};

export function ConceptSnapshotCard({ snapshot }: Props) {
  const rows: [string, string][] = [
    ["Idea", snapshot.idea],
    ["Domain", snapshot.domain],
    ["Problem", snapshot.problem],
    ["Current status", snapshot.status],
    ["Scale", snapshot.scale],
    ["Tech direction", snapshot.tech],
  ];
  return (
    <div className="mt-3 bg-white border border-[#bdd8fc] rounded-[10px] p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#48a0f8]">
        <span>📋</span>
        <span>Concept Snapshot</span>
      </div>
      <div className="my-3 h-px bg-[#e8ecf2]" />
      <dl className="space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-[12px] font-medium text-[#6b7280] uppercase tracking-wide">
              {label}
            </dt>
            <dd className="text-[13px] text-[#1a1a1a]">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
