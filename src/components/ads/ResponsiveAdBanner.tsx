"use client";

import { env } from "@/env";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

import { GoogleAdSense } from "./GoogleAdSense";
import { AdWrapper } from "./AdWrapper";

interface ResponsiveAdBannerProps {
  adSlot: string;
  type: "top" | "bottom";
}

export function ResponsiveAdBanner({ adSlot, type }: ResponsiveAdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!env.NEXT_PUBLIC_AD_CLIENT) {
    return null;
  }

  const getResponsiveStyle = () => ({
    display: "inline-block",
    width: "100%",
    // Mobile: 320x50
    height: "50px",
    maxWidth: "320px",
    // Tablet: 468x60
    "@media (min-width: 481px) and (max-width: 768px)": {
      height: "60px",
      maxWidth: "468px",
    },
    // Desktop: 728x90
    "@media (min-width: 769px)": {
      height: "90px",
      maxWidth: "728px",
    },
  });

  const getContainerClass = () => {
    return "w-full max-w-full overflow-hidden";
  };

  const getContainerStyle = () => ({
    minHeight: "auto !important",
    // Mobile
    maxHeight: "50px",
    width: "100%",
    // Tablet
    "@media (min-width: 481px) and (max-width: 768px)": {
      maxHeight: "60px",
    },
    // Desktop
    "@media (min-width: 769px)": {
      maxHeight: "90px",
    },
  });

  const getPlaceholderDimensions = () => {
    // En développement, on simule les dimensions desktop par défaut
    return {
      width: "100%",
      height: "90px", // Desktop par défaut
    };
  };

  return (
    <AdWrapper>
      <div className={getContainerClass()} style={getContainerStyle()}>
        <div className="px-4 py-1 flex justify-center">
          {isDevelopment ? (
            <AdPlaceholder {...getPlaceholderDimensions()} type={`Ad Banner (${type === "top" ? "Top" : "Bottom"})`} />
          ) : (
            <GoogleAdSense
              adClient={env.NEXT_PUBLIC_AD_CLIENT}
              adFormat="horizontal"
              adSlot={adSlot}
              className="responsive-ad-banner"
              fullWidthResponsive={true}
              style={getResponsiveStyle()}
            />
          )}
        </div>
      </div>
      <style jsx>{`
        .responsive-ad-banner {
          /* Mobile: 320x50 */
          width: 100% !important;
          max-width: 320px !important;
          height: 50px !important;
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .responsive-ad-banner {
            /* Tablet: 468x60 */
            max-width: 468px !important;
            height: 60px !important;
          }
        }

        @media (min-width: 769px) {
          .responsive-ad-banner {
            /* Desktop: 728x90 */
            max-width: 728px !important;
            height: 90px !important;
          }
        }
      `}</style>
    </AdWrapper>
  );
}
