import argparse
import socket
import sys
import time

from helpers import get_file_size, pack_length, progress

HOST = "127.0.0.1"
PORT = 55555
SIZE = get_file_size()


def send_tcp_message(chunk_size, p_socket):
    p_socket.send(pack_length(chunk_size))
    bytes_send = 0
    messages_send = 0

    with open("dummy_file.txt", "rb") as file:
        transmission_start = time.time()
        while True:
            bytes_read = file.read(chunk_size)
            if len(bytes_read) != 0:
                bytes_send += p_socket.send(bytes_read)
                messages_send += 1
            else:
                break
            progress(bytes_send, SIZE)
        transmission_end = time.time()
    return bytes_send, messages_send, transmission_end - transmission_start


def tcp_client(chunk_size):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        bytes_send, messages_send, transmission_time = send_tcp_message(chunk_size, s)
        s.close()
        return bytes_send, messages_send, transmission_time


def udp_client(chunk_size):
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.sendto(pack_length(chunk_size), (HOST, PORT))
        bytes_send = 0
        messages_send = 0

        with open("dummy_file.txt", "rb") as file:
            transmission_start = time.time()
            while True:
                bytes_read = file.read(chunk_size)
                if len(bytes_read) != 0:
                    bytes_send += s.sendto(bytes_read, (HOST, PORT))
                    messages_send += 1
                else:
                    break
                progress(bytes_send, SIZE)
            transmission_end = time.time()
        return bytes_send, messages_send, transmission_end - transmission_start


SERVER = {"TCP": tcp_client, "UDP": udp_client}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Does some awesome things.")
    parser.add_argument('--protocol', "-p", default="TCP", type=str, help="Pick TCP or UDP")
    parser.add_argument('--size', "-s", default=100, type=int, help="Message size")
    args = parser.parse_args(sys.argv[1:])
    option = args.protocol
    print("\n", SERVER[option].__call__(args.size))
