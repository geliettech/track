export default function NotificationsPage() {
  return (
    <section className="space-y-6 p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Alerts</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Notifications</h1>
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Important updates and reminders will appear here.</p>
      </div>
    </section>
  );
}
