import { defineSandbox } from "eve/sandbox";
import { JustBashSandbox } from "eve/sandbox/just-bash";

// Evermote exposes no shell or filesystem tools today. Selecting just-bash
// explicitly still gives Eve a deterministic, portable session filesystem
// without requiring Docker, a VM runtime, or environment-dependent probing.
// It is not a security boundary for future executable tools; revisit this
// choice before adding any capability that runs untrusted commands.
export const environment = JustBashSandbox.environment({ autoInstall: false });

export default defineSandbox(() => environment.open());
