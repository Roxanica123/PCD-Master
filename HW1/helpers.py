import struct


def build_message(message):
    return struct.pack(f'i{len(message)}s', len(message), message)


def pack_length(length):
    return struct.pack('ii', 4, length)


def unpack_length(length):
    return struct.unpack('i', length)[0]


def unpack_message(length, message):
    return struct.unpack(f'{length}s', message)[0]
