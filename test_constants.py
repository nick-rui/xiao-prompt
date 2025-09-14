# Energy and cost calculation constants for testing
# These should match the constants in lib/constants.ts

# Massachusetts rates
ELECTRICITY_COST_PER_KWH = 0.305  # $0.305 per kWh
GRID_CARBON_INTENSITY = 416  # grams CO2 equivalent per kWh

# Calculation rates
ENERGY_PER_TOKEN = 0.00004  # 0.04 kWh per 1000 tokens
COST_PER_TOKEN = 0.002  # $0.002 per token saved

def calculate_energy_saved(tokens_saved):
    """Calculate energy saved in kWh"""
    return tokens_saved * ENERGY_PER_TOKEN

def calculate_emissions_saved(tokens_saved):
    """Calculate emissions saved using Massachusetts grid carbon intensity"""
    energy_kwh = calculate_energy_saved(tokens_saved)
    return energy_kwh * (GRID_CARBON_INTENSITY / 1000)  # Convert grams to kg

def calculate_energy_cost_savings(tokens_saved):
    """Calculate energy cost savings using Massachusetts electricity rate"""
    energy_kwh = calculate_energy_saved(tokens_saved)
    return energy_kwh * ELECTRICITY_COST_PER_KWH

def calculate_money_saved(tokens_saved):
    """Calculate money saved from token optimization"""
    return tokens_saved * COST_PER_TOKEN
