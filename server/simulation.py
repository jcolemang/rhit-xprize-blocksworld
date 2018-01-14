import sys

import config as cfg

def main():
    config = cfg.generate_config(get_is_local())

def get_is_local():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

if __name__ == '__main__':
    main()
