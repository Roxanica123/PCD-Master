import argparse
import socket
import sys

from helpers import build_message, unpack_length, unpack_message

HOST = "127.0.0.1"
PORT = 55555


def tcp_client():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(build_message(b"Hello, world"))
        length = unpack_length(s.recv(4))
        data = unpack_message(length, s.recv(length))
    print(f"Received {data}")


def udp_client():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.sendto(b"Hello, world", (HOST, PORT))
        data = s.recvfrom(1024)
    print(f"Received {data!r}")


SERVER = {"TCP": tcp_client, "UDP": udp_client}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Does some awesome things.")
    parser.add_argument('--protocol', "-p", default="TCP", type=str, help="Pick TCP or UDP")
    parser.add_argument('--size', "-s", default=30, type=int, help="Message size")
    args = parser.parse_args(sys.argv[1:])
    option = args.protocol
    SERVER[option].__call__(args.size)
