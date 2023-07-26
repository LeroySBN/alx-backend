#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Returns a dictionary with the following key-value pairs:
            index: the current start index of the return page.
            next_index: the next index to query with.
            page_size: the current page size.
            data: the actual page of the dataset.
        """
        assert type(index) == int or index is None
        assert type(page_size) == int and page_size > 0

        indexed_dataset = self.indexed_dataset()
        data_len = len(indexed_dataset)

        if index is None or index >= data_len:
            index = 0

        valid_indices = [i for i in range(data_len) if i in indexed_dataset]

        next_index = index + page_size
        if next_index >= data_len:
            next_index = None

        data = [indexed_dataset[i] for i in valid_indices[index:next_index]]

        # if next index exists in the dataset else find next available index
        while next_index is not None and next_index not in indexed_dataset:
            next_index += 1

        return {
            'index': index,
            'data': data,
            'page_size': page_size,
            'next_index': next_index
        }
