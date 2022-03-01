import argparse
import socket
import sys
import time

from helpers import get_file_size, pack_length, progress, pack_length_and_stop_and_wait_flag

HOST = "20.126.73.12"
PORT = 55555
SIZE = None


def send_tcp_message(chunk_size, p_socket, stop_and_wait, file):
    print(stop_and_wait)
    p_socket.send(pack_length_and_stop_and_wait_flag(chunk_size, stop_and_wait))
    bytes_send = 0
    messages_send = 0

    with open(file, "rb") as file:
        transmission_start = time.time()
        while True:
            bytes_read = file.read(chunk_size)
            if len(bytes_read) != 0:
                if stop_and_wait:
                    p_socket.send(pack_length(len(bytes_read)))
                bytes_send += p_socket.send(bytes_read)
                if stop_and_wait:
                    p_socket.recv(4)
                messages_send += 1
            else:
                break
            progress(bytes_send, SIZE)
        transmission_end = time.time()
    return bytes_send, messages_send, transmission_end - transmission_start


def tcp_client(chunk_size, stop_and_wait, file):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        bytes_send, messages_send, transmission_time = send_tcp_message(chunk_size, s, stop_and_wait, file)
        s.close()
        return bytes_send, messages_send, transmission_time


def udp_client(chunk_size, stop_and_wait, file):
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.sendto(pack_length_and_stop_and_wait_flag(chunk_size, stop_and_wait), (HOST, PORT))
        bytes_send = 0
        messages_send = 0

        with open(file, "rb") as file:
            transmission_start = time.time()
            while True:
                bytes_read = file.read(chunk_size)
                if len(bytes_read) != 0:
                    ack = False
                    while ack is False:
                        if stop_and_wait:
                            ack_length = False
                            while ack_length is False:
                                s.sendto(pack_length(len(bytes_read)), (HOST, PORT))
                                try:
                                    s.settimeout(30)
                                    s.recvfrom(4)
                                    ack_length = True
                                    print("am primit")
                                except:
                                    ack_length = False

                        bytes_send += s.sendto(bytes_read, (HOST, PORT))
                        if stop_and_wait:
                            try:
                                s.settimeout(10)
                                s.recvfrom(4)
                                ack = True
                            except:
                                ack = False
                        else:
                            ack = True
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
    parser.add_argument('--size', "-s", default=60000, type=int, help="Message size")
    parser.add_argument('--wait', "-w", default=1, type=int, help="Stop and wait")
    parser.add_argument('--file', "-f", default="dummy_file100.txt", type=str, help="File path")
    args = parser.parse_args(sys.argv[1:])
    option = args.protocol
    SIZE = get_file_size(args.file)
    print("\n", SERVER[option].__call__(args.size, args.wait == 1, args.file))
