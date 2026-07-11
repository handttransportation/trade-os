"use client";

import { useState } from "react";

export function useRiskSettings() {
  const [accountSize, setAccountSize] =
    useState(5000);

  const [riskPercent, setRiskPercent] =
    useState(1);

  return {
    accountSize,
    riskPercent,
    setAccountSize,
    setRiskPercent,
  };
}
