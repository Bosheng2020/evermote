import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background:
            "radial-gradient(circle at 78% 20%, rgba(197, 242, 124, 0.17), transparent 32%), linear-gradient(145deg, #18231d 0%, #0e1511 68%, #121a16 100%)",
          color: "#f2f5e9",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 80px",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
          <div
            style={{
              alignItems: "center",
              background: "#f0bd69",
              border: "2px solid rgba(255,255,255,0.45)",
              borderRadius: 999,
              boxShadow: "0 0 0 12px rgba(240,189,105,0.09)",
              display: "flex",
              height: 34,
              justifyContent: "center",
              width: 34,
            }}
          >
            <div
              style={{
                background: "#fff0ca",
                borderRadius: 999,
                height: 9,
                marginLeft: -7,
                marginTop: -7,
                width: 9,
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: "-0.02em" }}>
            Evermote
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div
            style={{
              color: "#c9ee8b",
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.14em",
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            Open source · user directed · approval gated
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, serif",
              fontSize: 68,
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
            }}
          >
            A personal agent with boundaries you can inspect.
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            color: "#a9b4a8",
            display: "flex",
            fontSize: 20,
            justifyContent: "space-between",
            paddingTop: 25,
          }}
        >
          <div style={{ display: "flex" }}>
            Resumable threads · scoped memory · read-only research
          </div>
          <div style={{ color: "#dfe8d7", display: "flex" }}>evermote</div>
        </div>
      </div>
    ),
    IMAGE_SIZE,
  );
}
