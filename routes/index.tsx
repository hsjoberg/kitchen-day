import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

const exampleUsers = ["user1", "user2", "user3", "user4"];
const examplePath = `/${exampleUsers.join(",")}`;

export default define.page(function Home() {
  return (
    <main class="page-shell">
      <Head>
        <title>Kitchen Day</title>
      </Head>
      <section class="panel intro fade-in">
        <p class="eyebrow">Kitchen Day</p>
        <h1>Daily Kitchen Rotation</h1>
        <p>
          Put your team in the URL as a comma-separated list:
        </p>
        <code class="route">{examplePath}</code>
        <a class="primary-link" href={examplePath}>Open Example Schedule</a>
      </section>
    </main>
  );
});
