from geopy import distance

def get_distance(ap_co_1st: tuple, ap_co_2nd: tuple) -> float:
    # print(ap_co_1st)
    latitude1 = ap_co_1st[0]
    longitude1= ap_co_1st[1]
    latitude2= ap_co_2nd[0]
    longitude2 = ap_co_2nd[1]
    airport1 = (latitude1, longitude1)
    airport2 = (latitude2, longitude2)
    distance_airports = distance.distance(airport1, airport2).km
    # print(f"{distance_airports:.0f}")
    return distance_airports