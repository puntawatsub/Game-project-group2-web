def story_telling():
    CYAN = "\033[36m"       # Color for "clean energy"
    RED = "\033[31m"        # Color for "limited carbon emission restrictions"
    GREEN = "\033[32m"      # Color for "good luck"
    RESET = "\033[0m"       # Reset to default color

    story_introduction = f"""
    Welcome to the world of "Carbon Code: The Spy Energy Race!"

    In the year 2200, the world is depleted of resources, and countries are engaged in fierce competition to find {CYAN}clean energy{RESET}. 
    
    You will play the role of a spy, infiltrating different countries to locate inventor teams and steal their research.

    As a spy, you must work within the {RED}limited carbon emission restrictions{RESET}, 
    searching for clues, gathering information, and ensuring that your country stays ahead in the clean energy race.

    Your mission begins now, and {GREEN}good luck!{RESET}
    """

    print(story_introduction)