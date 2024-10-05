# LTO period cost 2.5 times fuel than cruise period, every flight will take 30 min approximately no matter the distance.
# Total cost = cruise_time * fuel_cost + LOT_time * 2.5 * fuel cost
# fuel cost per hour 2.4 tons

def emission_cost(game_ct_dis):
    avager_speed_aircraft = 800 # km/h
    lot_time = 0.5 #30min
    unit_fuel_cost = 2.4 #tons
    total_fuel_cost = ((game_ct_dis / avager_speed_aircraft - lot_time) * unit_fuel_cost +
                       lot_time * unit_fuel_cost * 2.5)
    emission_cost = total_fuel_cost * 10
    return emission_cost
