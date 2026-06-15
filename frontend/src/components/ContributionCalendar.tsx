type ContributionCalendarProps = {
  // Mapa fecha (YYYY-MM-DD) → número de actividades ese día
  activity: Record<string, number>;
};

const WEEKS = 53;

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function level(count: number): number {
  if (!count) return 0;
  if (count === 1) return 1;
  if (count <= 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function ContributionCalendar({ activity }: ContributionCalendarProps) {
  const today = new Date();

  // Empezamos hace WEEKS semanas, alineado al domingo
  const start = new Date(today);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));
  start.setDate(start.getDate() - start.getDay());

  const weeks: { date: string; count: number; month: number }[][] = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const week: { date: string; count: number; month: number }[] = [];
    for (let d = 0; d < 7 && cursor <= today; d++) {
      const key = dateKey(cursor);
      week.push({ date: key, count: activity[key] ?? 0, month: cursor.getMonth() });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  const total = Object.values(activity).reduce((sum, n) => sum + n, 0);

  // Etiquetas de mes: muestra el mes en la primera semana donde aparece
  let lastMonth = -1;

  return (
    <div className="calendar">
      <div className="calendar-months">
        {weeks.map((week, wi) => {
          const month = week[0]?.month ?? 0;
          const show = month !== lastMonth && (week[0]?.date.slice(8) <= "07");
          if (show) lastMonth = month;
          return (
            <span key={wi} className="calendar-month-label">
              {show ? MONTHS[month] : ""}
            </span>
          );
        })}
      </div>

      <div className="calendar-grid">
        {weeks.map((week, wi) => (
          <div className="calendar-week" key={wi}>
            {week.map((cell) => (
              <div
                key={cell.date}
                className={`calendar-cell calendar-cell--l${level(cell.count)}`}
                title={`${cell.count} actividad(es) · ${cell.date}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="calendar-footer">
        <span>{total} actividad(es) en el último año</span>
        <div className="calendar-legend">
          <span>Menos</span>
          <div className="calendar-cell calendar-cell--l0" />
          <div className="calendar-cell calendar-cell--l1" />
          <div className="calendar-cell calendar-cell--l2" />
          <div className="calendar-cell calendar-cell--l3" />
          <div className="calendar-cell calendar-cell--l4" />
          <span>Más</span>
        </div>
      </div>
    </div>
  );
}
