import requests
from bs4 import BeautifulSoup
import json  
from ics import Calendar, Event
from datetime import datetime, timedelta


url = f"https://planzajec.uek.krakow.pl/"
response = requests.get(url)
response.encoding = 'utf-8' 
html_content = response.text

soup = BeautifulSoup(html_content, 'html.parser')

group_div = soup.find_all("div", {"class": "kategorie"})[1]

group_folder = {}

loop = 0

for group in group_div.find_all("a"):
    group_name = group["href"].split("=")[-1]
    group_url = f'https://planzajec.uek.krakow.pl/index.php?typ=G&grupa={group_name}'
    response = requests.get(group_url)
    response.encoding = 'utf-8'
    html_content = response.text
    group_soup = BeautifulSoup(html_content, 'html.parser')
    group_name = group_soup.find_all("div", {"class": "grupa"})[0].text
    
    group_folder[group_name] = []
    
    for group_col in group_soup.find_all("div", {"class": "kolumny"}):
        for group_row in group_col.find_all("a"):
            group_id = group_row["href"].split("=")[-2].split("&")[0]
            group_sub_name = group_row.text
            group_folder[group_name].append((group_sub_name, group_id))
    
 
with open('group_folder.json', 'w', encoding='utf-8') as json_file:
    json.dump(group_folder, json_file, ensure_ascii=False, indent=4)

print("Data saved to group_folder.json")

