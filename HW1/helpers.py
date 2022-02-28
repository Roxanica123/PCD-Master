import os
import struct
import sys


def build_message(message):
    return struct.pack(f'i{len(message)}s', len(message), message)


def pack_length(length):
    return struct.pack('i', length)


def unpack_length(length):
    return struct.unpack('i', length)[0]


def unpack_message(length, message):
    return struct.unpack(f'{length}s', message)[0]


def get_file_size():
    with open("dummy_file.txt", "rb") as file:
        file.seek(0, os.SEEK_END)
        return file.tell()


# Progress method is from https://gist.github.com/vladignatyev/06860ec2040cb497f0f3
def progress(count, total, status=''):
    bar_len = 60
    filled_len = int(round(bar_len * count / float(total)))

    percents = round(100.0 * count / float(total), 1)
    bar = '=' * filled_len + '-' * (bar_len - filled_len)

    sys.stdout.write('[%s] %s%s ...%s\r' % (bar, percents, '%', status))
    sys.stdout.flush()
