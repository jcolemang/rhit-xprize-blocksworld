import json
import sys

def generate_config(isLocal):
    config = add_common_config({})
    config = add_specific_config(config, isLocal)
    fill_server_options(config)

    return config

def add_common_config(config):
    with open('commonConfig.json') as commonConfig:
        return dict(config, **json.load(commonConfig))

def add_specific_config(config, isLocal):
    if isLocal:
        specificConfigFile = 'localConfig.json'
    else:
        specificConfigFile = 'nonLocalConfig.json'

    with open(specificConfigFile) as specificConfig:
        return dict(config, **json.load(specificConfig))

def fill_server_options(config):
    for var, fileName in config['serverOptions'].items():
        try:
            with open(fileName) as fileData:
                config['serverOptions'][var] = fileData
        except IOError:
            print("Failed to open file " + fileName + ". Aborting launch.")
            sys.exit()
