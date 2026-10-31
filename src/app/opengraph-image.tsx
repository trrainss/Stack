import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "STACKLAB — разработка сайтов для бизнеса";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080808",
          padding: "72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, #1c1c1c 1px, transparent 1px), linear-gradient(to bottom, #1c1c1c 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            opacity: 0.55,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "46px" }}>
            <div style={{ height: "7px", width: "46px", backgroundColor: "#f5f5f5" }} />
            <div style={{ height: "7px", width: "28px", backgroundColor: "#8e8e8e" }} />
            <div style={{ height: "7px", width: "46px", backgroundColor: "#f5f5f5" }} />
          </div>
          <div
            style={{
              color: "#f5f5f5",
              fontSize: "26px",
              letterSpacing: "8px",
              fontWeight: 600,
            }}
          >
            STACKLAB
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              color: "#f5f5f5",
              fontSize: "96px",
              lineHeight: 0.95,
              letterSpacing: "-4px",
              fontWeight: 600,
              maxWidth: "1000px",
            }}
          >
            Сайты для бизнеса за 5 дней
          </div>
          <div style={{ color: "#34d399", fontSize: "28px", letterSpacing: "1px" }}>
            Запуск до 5 дней · Ответ за 2 часа · Чистый код
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #292929",
            paddingTop: "24px",
            color: "#7c7c7c",
            fontSize: "20px",
            letterSpacing: "2px",
          }}
        >
          <span>STACKLAB</span>
          <span>stacklab7@gmail.com</span>
        </div>
      </div>
    ),
    size,
  );
}
