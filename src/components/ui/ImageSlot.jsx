export default function ImageSlot({ id, placeholder = "Image", style }) {
  return (
    <div
      data-slot-id={id}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 80,
        background: "linear-gradient(145deg, #150C20 0%, #1A1028 45%, #241933 100%)",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(198,160,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(198,160,255,.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          position: "relative",
          font: "500 10px 'JetBrains Mono', monospace",
          letterSpacing: ".14em",
          color: "#6E5C86",
          textTransform: "uppercase",
          textAlign: "center",
          padding: 12,
        }}
      >
        {placeholder}
      </span>
    </div>
  );
}
