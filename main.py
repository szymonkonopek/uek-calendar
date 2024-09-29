import json
from scripts.generate_schedule import generate_isc_files


# Load the JSON file
with open('group_folder.json', 'r', encoding='utf-8') as json_file:
    group_data = json.load(json_file)

generate_isc_files(group_data, schedules_dir="schedules", resume=True)
