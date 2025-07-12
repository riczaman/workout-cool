"use client";

import { useEffect, useRef } from "react";

interface GoogleAdSenseProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function GoogleAdSense({
  adClient,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = false,
  style = { display: "block" },
  className = "",
}: GoogleAdSenseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAdSense = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      if (width > 0) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error("Error loading Google AdSense:", error);
        }
        return true; // Chargement réussi
      }
      return false; // Pas encore prêt
    };

    // Méthode avec ResizeObserver (plus élégante)
    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (error) {
              console.error("Error loading Google AdSense:", error);
            }
            resizeObserver.disconnect();
            break;
          }
        }
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
    } else {
      // Fallback avec setInterval pour les navigateurs anciens
      const checkInterval = setInterval(() => {
        if (loadAdSense()) {
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  return (
    <div className="overflow-hidden" ref={containerRef} style={{ maxWidth: "100%", maxHeight: style?.maxHeight || "auto" }}>
      <ins
        className={`adsbygoogle ${className}`}
        data-ad-client={adClient}
        data-ad-format={adFormat}
        data-ad-slot={adSlot}
        data-full-width-responsive={fullWidthResponsive}
        style={style}
      />
    </div>
  );
}
