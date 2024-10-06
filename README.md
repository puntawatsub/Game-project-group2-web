# Carbon Code: The Spy Energy Race

🌏 Worldview: The story takes place in the year 2200, when the world is depleted of non-renewable resources and countries are trying to find and use clean energy by all means. 
In this war without smoke, the world is gradually divided into three different roles: ordinary people, inventors and information spies. 

🔬The Inventors are a group of brilliant scientific geniuses who want to use their knowledge to save the dying planet, but don't want to be beholden to any government, so they cleverly move around the world's continents, secretly accepting funding from anarchic organizations to carry out clandestine research, and their goal is to research as much clean energy as possible as quickly as possible. 

🕵️‍♀️And while countries are forming their own research teams, they are so hungry for the knowledge that these teams of scientists possess that information spies organizations are being created. ......

🎯Player's mission: The player's identity is an intelligence spy belonging to a certain country (the initial country is chosen by the player himself), and he needs to find the exact location of the inventor's team by collecting information between different countries, steal their latest knowledge of energy development and transport it back to his home country as soon as possible. Different countries have different Initial Inventive Capability values (Initial Inventive Capability means the country's ability to produce and utilize clean energy; the higher the value, the more efficiently the country can utilize clean energy, generating fewer carbon emissions and significantly improving its air and water quality).

♻️The player's main motivation or psychological incentive: as a member of the community, the player must find a team of inventors more quickly while conserving his or her own carbon emissions in order for his or her country to better earn the respect of the rest of the world, and for his or her country's people to have better air quality and water resources.

## Player instructions (For bash terminal) Run these commands one-by-one:
1. Clone this repository and chance the directory of the current terminal
```
git clone https://github.com/YUEZHANG-metro/Game-project-group2-python.git && cd Game-project-group2-python
```
2. Create python virtual environment
```
python -m venv .venv
```
3. Activate python environment
```
source .venv/bin/activate
```
4. Install the required modules
```
pip install -r requirements.txt
```
5. Rename and edit the SQL database info
```
mv .env.template .env && nano .env
```
6. Run the game
```
python spy.py
```
7. After you've finished the game, don't forget to deactivate the environment
```
deactivate
```
### To run the game after the first time:
```
cd Game-project-group2-python && source .venv/bin/activate
```
```
python spy.py
```
## Player instructions (For Windows PowerShell) run these commands one-by-one:
1. Clone this repository
```
git clone https://github.com/YUEZHANG-metro/Game-project-group2-python.git
```
2. Change the current directory
```
cd .\Game-project-group2-python\
```
3. Create a virtual python environment
```
python -m venv .venv
```
4. Activate the python environment
```
.\.venv\Scripts\activate
```
5. Install the required modules
```
pip install -r requirements.txt
```
6. Rename .env.template to .env
```
mv .env.template .env
```
7. Edit SQL Database info
```
notepad .env
```
8. Run the game
```
python spy.py
```
### To run the game after the first time:
```
cd .\Game-project-group2-python\
```
```
.\.venv\Scripts\activate
```
```
python spy.py
```

## Contribution instructions:
1. Create a new branch.
2. Commit changes to the new branch created.
3. If you are done with your changes, create a pull request to the main branch, and describe your changes.
4. Wait for everyone's approval before merging your pull request.

### WARNING: DO NOT commit directly to the main branch.

Any questions regarding the instructions must be discussed with group members.


### The current main functionality of the game are:
- [x] Select starting country
- [x] Select first and subsequent destinations
- [x] Get clues and invention score
- [x] Able to calculate distance
- [x] The player can win the game if the invention score is 200 or above
- [x] Player will lose the game if they exceed carbon limit
- [x] Competitors (computer)
- [x] Carbon emission calculation


### In the future:
- [ ] More consequences of carbon emission
- [ ] Diplomatic relations between player country and game country
- [ ] Possibility to upgrade aircraft using invention point (to reduce carbon emission)
