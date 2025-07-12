"use client";

import { useEffect, useRef } from "react";

interface GoogleAdSenseProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  position?: "top" | "bottom"; // Pour gérer le timing différent
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
  position = "top",
}: GoogleAdSenseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Délai supplémentaire pour les bottom banners (problème de timing)
    const initialDelay = position === "bottom" ? 300 : 100;

    const loadAdSense = () => {
      if (!containerRef.current) return false;

      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      // Vérification plus stricte pour bottom banner
      if (width > 0 && height > 0) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          return true;
        } catch (error) {
          console.error(`Error loading Google AdSense (${position}):`, error);
          return false;
        }
      }
      return false;
    };

    // Délai initial avant de commencer les vérifications
    const startTimer = setTimeout(() => {
      // Méthode avec ResizeObserver (plus élégante)
      if (typeof ResizeObserver !== "undefined") {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
              try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              } catch (error) {
                console.error(`Error loading Google AdSense (${position}):`, error);
              }
              resizeObserver.disconnect();
              break;
            }
          }
        });

        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }
      } else {
        // Fallback avec setInterval
        const checkInterval = setInterval(() => {
          if (loadAdSense()) {
            clearInterval(checkInterval);
          }
        }, 100);
      }
    }, initialDelay);

    return () => {
      clearTimeout(startTimer);
    };
  }, [position]);

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
