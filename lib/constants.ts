// Energy and cost calculation constants
export const ENERGY_CONSTANTS = {
  // Massachusetts average electricity rate (as of 2024)
  ELECTRICITY_COST_PER_KWH: 0.305, // $0.305 per kWh
  
  // Energy consumption estimates for AI models
  ENERGY_PER_TOKEN: 0.00001, // 0.01 kWh per 1000 tokens (rough estimate)
  
  // Token cost estimates
  COST_PER_TOKEN: 0.002, // $0.002 per token saved
  
  // Emissions estimates
  EMISSIONS_PER_TOKEN: 0.0005, // kg CO2 per token
} as const

// Calculate energy cost based on tokens saved
export function calculateEnergyCost(tokensSaved: number): number {
  const energyKwh = tokensSaved * ENERGY_CONSTANTS.ENERGY_PER_TOKEN
  return energyKwh * ENERGY_CONSTANTS.ELECTRICITY_COST_PER_KWH
}

// Calculate energy saved in kWh
export function calculateEnergySaved(tokensSaved: number): number {
  return tokensSaved * ENERGY_CONSTANTS.ENERGY_PER_TOKEN
}

// Calculate money saved from token optimization
export function calculateMoneySaved(tokensSaved: number): number {
  return tokensSaved * ENERGY_CONSTANTS.COST_PER_TOKEN
}

// Calculate emissions saved
export function calculateEmissionsSaved(tokensSaved: number): number {
  return tokensSaved * ENERGY_CONSTANTS.EMISSIONS_PER_TOKEN
}
