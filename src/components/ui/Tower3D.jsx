import { useEffect, useRef } from "react";

export default function Tower3D({ subjectX = 0.74, style, className, onLitChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("subject-x", String(subjectX));
    const handler = (e) => onLitChange?.(e.detail);
    el.addEventListener("litchange", handler);
    return () => el.removeEventListener("litchange", handler);
  }, [subjectX, onLitChange]);

  return <tower-3d ref={ref} className={className} style={style} />;
}
