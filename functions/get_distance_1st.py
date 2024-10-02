from geopy import distance

def get_distance_1st(initial_ap_co,des_ap_co):
    latitude1= initial_ap_co[0]
    longitude1= initial_ap_co[1]
    latitude2= des_ap_co[0]
    longitude2 = des_ap_co[1]
    airport1 = (latitude1, longitude1)
    airport2 = (latitude2, longitude2)
    distance_airports = distance.distance(airport1, airport2).km
    print(f"{distance_airports:.0f}")
    return distance_airports