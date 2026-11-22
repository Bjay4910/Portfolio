/*
 * Site configuration (plain script, no build step).
 *
 * demos: paste a public demo URL (video or live app, must start with https://)
 *        to show a "Watch demo" button on that project's card and in its detail
 *        dialog. Leave "" to hide the button.
 * repos: repository URLs. A GitHub button is added to a card only when the URL
 *        is non-empty and the card does not already link to it.
 */
window.SITE_CONFIG = {
    demos: {
        powerManager: "",
        memoryHub: "",
        vigil: "",
        lyra: "",
        syncscript: ""
    },
    repos: {
        powerManager: "https://github.com/Bjay4910/agent-aware-power-manager",
        memoryHub: "https://github.com/Bjay4910/multi-agent-memory-hub",
        lyra: "",
        vigil: "",
        syncscript: ""
    }
};
