## create new table
'''
SELECT  airport.iso_country, country.name, airport.name,airport.ident
FROM airport
JOIN country
ON country.iso_country = airport.iso_country
WHERE country.name IN ('Luxembourg', 'Singapore', 'Ireland', 'Norway', 'Qatar', 'United Arab Emirates', 'Switzerland', 'United States', 'Denmark', 'Netherlands', 'Brunei', 'Iceland', 'Austria', 'Belgium', 'Sweden', 'Germany', 'Australia', 'Bahrain', 'Saudi Arabia', 'Finland')
and airport.type like '%large%'
group by airport.iso_country;
'''
