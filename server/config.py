import json

def generateConfig(isLocal):
    config = addCommonConfig({})
    config = addSpecificConfig(config, isLocal)
    fillServerOptions(config)

    return config

def addCommonConfig(config):
    with open('commonConfig.json') as commonConfig:
        return dict(config, **json.load(commonConfig))

def addSpecificConfig(config, isLocal):
    if isLocal:
        specificConfigFile = 'localConfig.json'
    else:
        specificConfigFile = 'nonLocalConfig.json'

    with open(specificConfigFile) as specificConfig:
        return dict(config, **json.load(specificConfig))

def fillServerOptions(config):
    for var, fileName in config['serverOptions'].items():
        with open(fileName) as fileData:
            config['serverOptions'][var] = fileData
