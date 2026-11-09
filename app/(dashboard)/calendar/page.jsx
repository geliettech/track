export default function CalendarPage() {
  return (
    <section className="space-y-6 p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Calendar</h1>
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Your upcoming schedule and milestones will appear here.</p>
      </div>
    </section>
  );
}
