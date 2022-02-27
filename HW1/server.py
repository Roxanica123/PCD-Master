import argparse
import socket
import sys
import threading

SOCKET_TYPE = {"TCP": socket.SOCK_STREAM, "UDP": socket.SOCK_DGRAM}


class Server:
    HOST = "127.0.0.1"
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
        print(f"Connected by {addr}")
        while True:
            data = conn.recv(1024)
            if not data:
                break
            conn.sendall(data)
        conn.close()


class UDPServer(Server):
    def __init__(self):
        super().__init__("UDP")
        self.protocol = "UDP"
        self.buffer_size = 1024

    def start_server(self):
        while True:
            msg, addr = self.socket.recvfrom(self.buffer_size)
            print(f"Connected by {addr}")
            self.socket.sendto(msg, addr)

    def read_message(self, **kwargs):
        pass


SERVER = {"TCP": TCPServer(), "UDP": UDPServer()}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Does some awesome things.")
    parser.add_argument('--protocol', "-p", default="TCP", type=str, help="Pick TCP or UDP")
    args = parser.parse_args(sys.argv[1:])
    option = args.protocol
    server = SERVER[option]
    server.start_server()
