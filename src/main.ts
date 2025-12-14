import { error } from "node:console"
import net from "node:net"
import { buffer, json } from "node:stream/consumers"


interface IhttpRequest {
    method: string
    path: string
    version: string
}

const handleRequest = (raw?: string): IhttpRequest | null => {
    if (!raw) return null

    const [line] = raw.split('\r\n')
    if (!line) return null

    const [method, path, version] = line.split(' ')
    if (!method || !path || !version) return null

    return { method, path, version }
}

const server = net.createServer((socket) => {
    socket.on('data', (buffer) => {
        const request = buffer.toString()
        const requestLine: IhttpRequest | null = handleRequest(request)
        if (!requestLine) throw new Error("Bad request")
        let body = ''

        if (requestLine.method === 'GET' && requestLine.path === '/') {
            body = JSON.stringify({ message: "This fuckong works" })
        }
        const response =
            `HTTP/1.1 200 OK\r\n` +
            `Content-Type: application/json\r\n` +
            `Content-Length: ${Buffer.byteLength(body)}\r\n` +
            `Connection: close\r\n` +
            `\r\n` +
            body;

        socket.write(response);
        socket.end();
        // GET / HTTP / 1.1
    })


})

server.listen(3000, '0.0.0.0', () => {
    console.log("server is up and running");

})
