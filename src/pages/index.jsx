import { useRouter } from 'next/router';
import React, { useState } from 'react';
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("@/components/Map.js"), { ssr:false })

export default function Home() {
  return (
    <div>
      <MapComponent />
    </div>
  );
}
