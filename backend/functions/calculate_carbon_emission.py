def calculate_carbon_emission(game_country_distance) -> float:
    result = 200 + (0.15 * game_country_distance)
    return result