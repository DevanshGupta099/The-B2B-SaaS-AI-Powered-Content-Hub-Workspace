import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 8,
          fontWeight: 800,
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)",
        }}
      >
        N
      </div>
    ),
    {
      ...size,
    }
  );
}
