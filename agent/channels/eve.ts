import { eveChannel } from "eve/channels/eve";
import { localDev, placeholderAuth, vercelOidc } from "eve/channels/auth";

export default eveChannel({
  auth: [
    // Lets the eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
    // This placeholder will not allow browser requests in production.
    // Replace it with your app's auth provider, like Auth.js or Clerk,
    // or use none() for a public demo.
    placeholderAuth(),
  ],
});

// SECURITY: route authentication is not a per-session ownership ACL. This
// scaffold deliberately stays closed to ordinary production browser traffic.
// Before replacing placeholderAuth() for a multi-user deployment, enforce that
// create/read/stream/message/cancel/clear/reset requests may access only a
// session owned by the verified user (and tenant) in a trusted proxy or custom
// channel. A random session id is not an authorization boundary.
