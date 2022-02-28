import argparse
import socket
import sys
import threading

from helpers import unpack_length, pack_length, unpack_length_and_stop_and_wait_flag

SOCKET_TYPE = {"TCP": socket.SOCK_STREAM, "UDP": socket.SOCK_DGRAM}


class Server:
    HOST = "0.0.0.0"
    PORT = 55555

    def __init__(self, option):
        self.messages_read = 0
        self.bytes_read = 0
        self.socket = socket.socket(socket.AF_INET, SOCKET_TYPE[option])
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind((self.HOST, self.PORT))

    def update_stats(self, messages_read, bytes_read):
        with threading.Lock():
            self.messages_read += messages_read
            self.bytes_read += bytes_read

    def start_server(self):
        pass

    def read_message(self, **kwargs):
        pass


class TCPServer(Server):
    def __init__(self):
        super().__init__("TCP")
        self.protocol = "TCP"

    def start_server(self):
        self.socket.listen(5)
        while True:
            conn, addr = self.socket.accept()
            threading.Thread(target=self.read_message, kwargs={"conn": conn, "addr": addr}).start()

    def read_message(self, **kwargs):
        conn = kwargs["conn"]
        addr = kwargs["addr"]
        print(f"Connected by {addr}", flush=True)
        chunk_size_bytes = conn.recv(5)
        chunk_size, stop_and_wait = unpack_length_and_stop_and_wait_flag(chunk_size_bytes)
        print(chunk_size, stop_and_wait, flush=True)
        messages_received = 0
        bytes_received = 0
        while True:
            if stop_and_wait:
                to_be_received_bytes = conn.recv(4)
                if not to_be_received_bytes:
                    break
                to_be_received = unpack_length(to_be_received_bytes)
            data = conn.recv(chunk_size)
            if stop_and_wait:
                while len(data) != to_be_received:
                    data = conn.recv(chunk_size - len(data))
                conn.send(pack_length(1))
            if not data:
                break
            messages_received += 1
            if stop_and_wait:
                bytes_received += to_be_received
            else:
                bytes_received += len(data)
        conn.close()
        print(messages_received, bytes_received, flush=True)


class UDPServer(Server):
    def __init__(self):
        super().__init__("UDP")
        self.protocol = "UDP"
        self.current_address = None

    def start_server(self):
        while True:
            msg, addr = self.socket.recvfrom(5)
            self.current_address = addr
            self.read_message(header=msg)

    def read_message(self, **kwargs):
        header = kwargs["header"]
        chunk_size, stop_and_wait = unpack_length_and_stop_and_wait_flag(header)
        self.socket.settimeout(5)
        bytes_read = 0
        messages_read = 0
        while True:
            try:
                if stop_and_wait:
                    to_be_received_bytes, addr = self.socket.recvfrom(4)
                    to_be_received = unpack_length(to_be_received_bytes)

                msg, addr = self.socket.recvfrom(chunk_size)

                if stop_and_wait:
                    while len(msg) != to_be_received:
                        msg, addr = self.socket.recvfrom(chunk_size - len(msg))
                    self.socket.sendto(pack_length(1), addr)

                messages_read += 1

                if stop_and_wait:
                    bytes_read += to_be_received
                else:
                    bytes_read += len(msg)
            except:
                self.socket.settimeout(None)
                break
        print(messages_read, bytes_read, flush=True)


SERVER = {"TCP": TCPServer(), "UDP": UDPServer()}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Does some awesome things.")
    parser.add_argument('--protocol', "-p", default="TCP", type=str, help="Pick TCP or UDP")
    args = parser.parse_args(sys.argv[1:])
    option = args.protocol
    server = SERVER[option]
    server.start_server()
