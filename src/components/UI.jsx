import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { whatsappHref } from "../lib.mjs";
import { track } from "../tracking.mjs";
export function Arrow({ diagonal = false, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M3 12h17m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
export function Mark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M6 31V9l14 22L34 9v22M6 9l14 22L34 9M10 8c26-5 24 30 2 24"
        stroke="currentColor"
        strokeWidth=".8"
      />
    </svg>
  );
}
export function Contact({
  position = "hero",
  label = "minha avaliação",
  children = "Agendar avaliação",
  variant = "solid",
  className = "",
}) {
  const [href, setHref] = useState(whatsappHref({ label, position }));
  useEffect(
    () => setHref(whatsappHref({ label, position, search: location.search })),
    [label, position],
  );
  return (
    <motion.a
      whileTap={{ scale: 0.98 }}
      href={href}
      className={`contact contact-${variant} ${className}`}
      onClick={() => track("contact_click", { position })}
    >
      <span>{children}</span>
      <Arrow diagonal />
    </motion.a>
  );
}
export function Portrait({ priority = false }) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/images/mariana-400.avif 400w, /images/mariana-800.avif 683w"
        sizes="(max-width:700px) 85vw, 40vw"
      />
      <img
        src="/images/mariana-800.webp"
        srcSet="/images/mariana-400.webp 400w, /images/mariana-800.webp 683w"
        sizes="(max-width:700px) 85vw, 40vw"
        width="683"
        height="1024"
        alt="Mariana Strey em seu ambiente de atendimento"
        loading={priority ? "eager" : "lazy"}
      />
    </picture>
  );
}
