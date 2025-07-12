import { env } from "@/env";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

import { GoogleAdSense } from "./GoogleAdSense";
import { AdWrapper } from "./AdWrapper";

export function HorizontalBottomBanner({ adSlot }: { adSlot: string }) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!env.NEXT_PUBLIC_AD_CLIENT) {
    return null;
  }

  return (
    <AdWrapper>
      <div className="w-full max-w-full" style={{ minHeight: "auto !important", maxHeight: "90px", width: "100%", overflow: "hidden" }}>
        {isDevelopment ? (
          <AdPlaceholder height="70px" type="Ad Banner (Bottom)" width="100%" />
        ) : (
          <GoogleAdSense
            adClient={env.NEXT_PUBLIC_AD_CLIENT}
            adFormat="horizontal"
            adSlot={adSlot}
            style={{ display: "inline-block", width: "300px", height: "50px" }}
          />
        )}
      </div>
    </AdWrapper>
  );
}
