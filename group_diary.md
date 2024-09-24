## Outcome of the second discussion
## Game Mechanics
1. Players choose the country they belong to, corresponding to the initial ability value;
   
2. the player is given 20 choices, 10 of which contain clues to the different levels of the country;
   
3. the player chooses for himself which city he wants to fly to;
   
4. after choosing the flight destination, python calculates the distance between the two places by calling the latitude and longitude information, and calculates the carbon emission value;
    
5. After the player arrives at the destination, it will show whether he/she has encountered a clue or not, and loops until the player finds a clue value of 20 points.
   
6. When the player has found 20 clue values and has not reached the carbon emissions limit, an inventor message is activated. This is accomplished by the rand function in the sql statement, giving the country location information for one of the table inventors specifying the inventor number and contribution, but not shown to the player;
   ```
   UPDATE inventor 
   SET inventor.position = (SELECT country_id FROM country ORDER BY RAND() LIMIT 1);
   ```
   **???? need to confirm**

7. The player needs to fly to this location to find the inventor, but the player does not know the exact level of the inventor until he flies to the location. If the trigger is a high level inventor, then it is possible to complete the target value of 200. If it is not completed, then the player needs to continue to collect clue values by choosing destinations in 20 countries.
   
8. The game is won after the country the player belongs to has reached the ability value of 200, and provided the player has not exhausted his or her indicator limit.

https://app.diagrams.net/#G17-85gWbEMemvSinR606XYFjRAX3kZG_M#%7B%22pageId%22%3A%22C5RBs43oDa-KdzZeNtuy%22%7D
(also in our Google drive)

## create new table sql query
```
SELECT airport.iso_country, country.name, airport.name,airport.ident
FROM airport
JOIN country
ON country.iso_country = airport.iso_country
WHERE country.name IN ('Luxembourg', 'Singapore', 'Ireland', 'Norway', 'Qatar', 'United Arab Emirates', 'Switzerland', 'United States', 'Denmark', 'Netherlands', 'Brunei', 'Iceland', 'Austria', 'Belgium', 'Sweden', 'Germany', 'Australia', 'Bahrain', 'Saudi Arabia', 'Finland')
and airport.type like '%large%'
group by airport.iso_country;
```
Reference:
GDP per Capita - Worldometer. (n.d.). https://www.worldometers.info/gdp/gdp-per-capita/#google_vignette


## Next Step for Third Discussion
1. A linear function between distance and consumption needs to be established, and it is known that the take-off and landing phases take about 40 minutes regardless of the distance, and the fuel consumed during the take-off and landing phases is roughly 30% to 40% of the total range. (Varies according to model)
2. Start writing the code:
    a. It is necessary to start building the tables in the database, confirming the data type of each item of the database that has been designed;
    b. Begin to test whether the values of each item in the initial version are too high or too low.
