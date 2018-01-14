import sys

import config as cfg

def main():
    config = cfg.generateConfig(getIsLocal())

def getIsLocal():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

if __name__ == '__main__':
    main()
