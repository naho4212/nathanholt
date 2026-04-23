"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalInit() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "meeting" });
      cal("ui", { theme: "dark", hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return null;
}
