import os
import json

folder_path = r'/u' # Put filepath here
add_fields = {'Ratings': [], 'Favorites': []}  # Fields to add
remove_fields = ['Rating', 'Favorites']     # Fields to remove

def add_field_to_json(json_data, field_name, field_value):
    for entry in json_data:
        entry[field_name] = field_value

def remove_field_from_json(json_data, field_name):
    for entry in json_data:
        if field_name in entry:
            del entry[field_name]

def process_json_file(file_path, add_fields=None, remove_fields=None):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if remove_fields:
        for field in remove_fields:
            remove_field_from_json(data, field)
    
    if add_fields:
        for field, value in add_fields.items():
            add_field_to_json(data, field, value)
    
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

def process_folder(folder_path, add_fields=None, remove_fields=None):
    for root, _, files in os.walk(folder_path):
        for file_name in files:
            if file_name.endswith('.json'):
                file_path = os.path.join(root, file_name)
                process_json_file(file_path, add_fields, remove_fields)

process_folder(folder_path, add_fields=add_fields, remove_fields=remove_fields)