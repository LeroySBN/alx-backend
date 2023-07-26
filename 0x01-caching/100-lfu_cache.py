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
        if key is not None and item is not None:
            if key in self.cache_data:
                self.cache_data[key] = item
                self.count[key] += 1
            else:
                if len(self.cache_data) >= self.MAX_ITEMS:
                    min_count = min(self.count.values())
                    least_frequent = [k for k in self.count if self.count[k] == min_count]

                    # Use LRU algorithm to discard the least recently used item
                    for idx in range(len(self.queue)):
                        if self.queue[idx] in least_frequent:
                            to_discard = self.queue.pop(idx)
                            break

                    del self.cache_data[to_discard]
                    del self.count[to_discard]
                    print("DISCARD: {}".format(to_discard))

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
