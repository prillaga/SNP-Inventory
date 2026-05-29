export default function PageHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h1 className="font-[Poppins] text-2xl font-semibold text-slate-800">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
