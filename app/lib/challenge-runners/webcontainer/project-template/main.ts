import { createApp } from "vue";

// @ts-ignore The challenge file path is replaced before this source is mounted.
import Challenge from "./__CHALLENGE_FILE__";

createApp(Challenge).mount("#app");
