import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function githubPagesBase() {
  if (process.env.GITHUB_ACTIONS !== "true") return "/";

  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (!repository || repository.endsWith(".github.io")) return "/";

  return `/${repository}/`;
}

export default defineConfig({
  plugins: [react()],
  base: githubPagesBase(),
});
