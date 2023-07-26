#!/usr/bin/python3
""" Basic dictionary
"""
BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """ BasicCache class:
        Can assign items from dictionary
        print in FIFO order
    """

    def put(self, key, item):
        """ Assign items from dictionary
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """ Return value of cache_data linked to key
        """
        if key is None or key not in self.cache_data.keys():
            return None
        return self.cache_data[key]
