import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
const UPCOMING_DAYS = 7;

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseUsers(payload: string): string[] {
  return safeDecode(payload)
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

function getCalendarDayNumber(date: Date): number {
  const currentDayUtc = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const yearStartUtc = Date.UTC(date.getFullYear(), 0, 1);
  return Math.floor((currentDayUtc - yearStartUtc) / DAY_MS);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default define.page(function KitchenSchedule(ctx) {
  const users = parseUsers(ctx.params.users ?? "");

  if (users.length === 0) {
    return (
      <main class="page-shell">
        <Head>
          <title>Kitchen Day</title>
        </Head>
        <section class="panel intro fade-in">
          <p class="eyebrow">Kitchen Day</p>
          <h1>Add Names to the URL</h1>
          <p>Use this pattern to start:</p>
          <code class="route">/user1,user2,user3,user4</code>
          <a class="primary-link" href="/user1,user2,user3,user4">
            Open Example Schedule
          </a>
        </section>
      </main>
    );
  }

  const today = new Date();
  const dayNumber = getCalendarDayNumber(today);
  const slot = dayNumber % users.length;
  const currentPerson = users[slot];

  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(today);

  const queue = Array.from({ length: UPCOMING_DAYS }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 1);
    return {
      key: `${date.toISOString()}-${index}`,
      label: formatDate(date),
      person: users[(slot + index + 1) % users.length],
    };
  });

  return (
    <main class="page-shell">
      <Head>
        <title>Kitchen Day | {currentPerson}</title>
      </Head>

      <section class="panel main-card fade-in">
        <p class="eyebrow">{todayLabel}</p>
        <h1 class="center-name">{currentPerson}</h1>
        <p class="muted">Kitchen duty for today</p>
      </section>

      <section class="panel queue-panel fade-in delayed">
        <h2>Upcoming Queue</h2>
        <ol class="queue-list">
          {queue.map((item) => (
            <li class="queue-item" key={item.key}>
              <span class="queue-date">{item.label}</span>
              <strong class="queue-name">{item.person}</strong>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
});
