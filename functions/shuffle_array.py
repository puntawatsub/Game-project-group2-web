import random

def shuffle_array(arr: []) -> []:
    final_array = []
    for i in range(len(arr)):
        rand_index = random.randint(0, len(arr) - 1)
        final_array.append(arr[rand_index])
        arr.pop(rand_index)
    return final_array

