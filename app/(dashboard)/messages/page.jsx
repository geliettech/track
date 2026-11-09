export default function MessagesPage() {
  return (
    <section className="space-y-6 p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Communication</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Messages</h1>
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Team messages and conversations will appear here.</p>
      </div>
    </section>
  );
}
