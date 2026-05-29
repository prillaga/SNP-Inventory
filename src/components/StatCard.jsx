export default function StatCard({ label, value, change, color }) {
  return (
    <article className={`rounded-2xl border p-4 shadow-card sm:p-5 ${color}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 font-[Poppins] text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs font-medium opacity-70 sm:text-sm">{change}</p>
    </article>
  );
}
