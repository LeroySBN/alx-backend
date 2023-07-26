#!/usr/bin/python3
""" LFU Caching
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ LFU caching system
    """

    def __init__(self):
        """ Initialize
        """
        super().__init__()
        self.queue = []
        self.count = {}

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
                self.count[key] += 1
            else:
                if len(self.cache_data) >= self.MAX_ITEMS:
                    discard = self.queue.pop(0)
                    del self.cache_data[discard]
                    del self.count[discard]
                    print("DISCARD: {}".format(discard))
                self.queue.append(key)
                self.cache_data[key] = item
                self.count[key] = 1

    def get(self, key):
        """ Get an item by key
        """
        if key and key in self.cache_data:
            self.count[key] += 1
            return self.cache_data[key]
        return None
