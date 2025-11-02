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
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FF6347",
          borderRadius: "6px",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Chef's hat */}
          <path
            d="M19 10C19 8.34315 17.6569 7 16 7C15.8096 7 15.6239 7.01817 15.4446 7.05313C14.9803 5.27374 13.3569 4 11.5 4C9.64308 4 8.01972 5.27374 7.55536 7.05313C7.37606 7.01817 7.19039 7 7 7C5.34315 7 4 8.34315 4 10C4 10.7403 4.28885 11.4119 4.76389 11.9C4.28885 12.3881 4 13.0597 4 13.8V17C4 18.1046 4.89543 19 6 19H17C18.1046 19 19 18.1046 19 17V13.8C19 13.0597 18.7111 12.3881 18.2361 11.9C18.7111 11.4119 19 10.7403 19 10Z"
            fill="white"
          />
          {/* Chef's hat band */}
          <rect
            x="4"
            y="15"
            width="15"
            height="2"
            rx="0.5"
            fill="white"
            fillOpacity="0.7"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
