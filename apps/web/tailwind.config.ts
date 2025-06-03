import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  content: ["./src/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
  presets: [sharedConfig],
  plugins: [typography],
};

export default config;
