import { ImageResponse } from "next/og";
import { STORE } from "@/lib/constants";

export const alt = `${STORE.name} — Watches, Ladies Bags & Accessories`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #00341F 0%, #006039 100%)",
          color: "#F5F1E8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#D4AF37",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          Est. {STORE.foundedYear} · {STORE.address.city}
        </div>

        <div style={{ display: "flex", fontSize: 84, marginTop: 28, lineHeight: 1.05 }}>
          {STORE.name}
        </div>

        <div
          style={{
            display: "flex",
            width: 120,
            height: 2,
            background: "#D4AF37",
            marginTop: 36,
            marginBottom: 36,
          }}
        />

        <div style={{ display: "flex", fontSize: 34, color: "rgba(245,241,232,0.8)", maxWidth: 820 }}>
          Watches, ladies bags and accessories — browse here, order on WhatsApp.
        </div>
      </div>
    ),
    size,
  );
}
