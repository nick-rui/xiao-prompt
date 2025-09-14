// Energy and cost calculation constants
export const ENERGY_CONSTANTS = {
  // Massachusetts average electricity rate (as of 2024)
  ELECTRICITY_COST_PER_KWH: 0.305, // $0.305 per kWh
  
  // Grid carbon intensity (Massachusetts average)
  GRID_CARBON_INTENSITY: 416, // grams CO2 equivalent per kWh
  
  // Original methodology rates (from sample data analysis)
  ORIGINAL_ENERGY_PER_TOKEN: 0.00004, // 0.04 kWh per 1000 tokens (from sample data)
  ORIGINAL_EMISSIONS_PER_TOKEN: 0.0000267, // kg CO2 per token (from sample data)
  ORIGINAL_COST_PER_TOKEN: 0.00015, // $0.00015 per token (from sample data)
  
  // Updated methodology using Massachusetts rates
  ENERGY_PER_TOKEN: 0.00004, // Keep original energy consumption rate
  COST_PER_TOKEN: 0.002, // $0.002 per token saved (as requested)
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

// Calculate money saved from token optimization (API costs, not energy costs)
export function calculateMoneySaved(tokensSaved: number): number {
  return tokensSaved * ENERGY_CONSTANTS.COST_PER_TOKEN
}

// Calculate emissions saved based on energy consumption and Massachusetts grid carbon intensity
export function calculateEmissionsSaved(tokensSaved: number): number {
  const energyKwh = tokensSaved * ENERGY_CONSTANTS.ENERGY_PER_TOKEN
  // Convert grams to kg (416 g CO2/kWh = 0.416 kg CO2/kWh)
  return energyKwh * (ENERGY_CONSTANTS.GRID_CARBON_INTENSITY / 1000)
}

// Calculate energy cost savings using Massachusetts electricity rate
export function calculateEnergyCostSavings(tokensSaved: number): number {
  const energyKwh = tokensSaved * ENERGY_CONSTANTS.ENERGY_PER_TOKEN
  return energyKwh * ENERGY_CONSTANTS.ELECTRICITY_COST_PER_KWH
}
