import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
// Read-only TCP forwarding through the already verified Proxmox SSH identity.
// Does not require SSH credentials inside CT154, a public listener, DNS or an edge route.
const target = process.argv.find(value => value.startsWith('--target='))?.slice(9) || 'staging';
if (!['staging','production'].includes(target)) throw Error('Invalid target');
const remotePort = target === 'staging' ? 18181 : 18182;
const remoteHost = process.argv.includes('--https-staging') ? '172.10.0.202' : '127.0.0.1';
const localPort = Number(process.argv.find(value => value.startsWith('--port='))?.slice(7) || remotePort);
if (!Number.isInteger(localPort) || localPort < 1024 || localPort > 65535) throw Error('Invalid local port');
const python = `import socket,selectors,sys,os
s=socket.create_connection(('${remoteHost}',${remotePort}),10)
s.settimeout(None)
p=selectors.DefaultSelector()
p.register(sys.stdin.buffer,selectors.EVENT_READ,'stdin')
p.register(s,selectors.EVENT_READ,'socket')
while True:
 for key,_ in p.select():
  if key.data=='stdin':
   data=os.read(sys.stdin.fileno(),65536)
   if data:s.sendall(data)
   else:
    p.unregister(sys.stdin.buffer)
    s.shutdown(socket.SHUT_WR)
  else:
   data=s.recv(65536)
   if not data:sys.exit(0)
   sys.stdout.buffer.write(data)
   sys.stdout.buffer.flush()
`;
const quote = value => "'" + value.replace(/'/g, "'\\''") + "'";
const children = new Set();
const server = createServer(socket => {
  if (children.size >= 32) { socket.destroy(); return; }
  const child = spawn('ssh', ['-T','-o','BatchMode=yes','-o','ConnectTimeout=10','root@177.104.184.34', 'pct exec 154 -- python3 -c ' + quote(python)], { stdio: ['pipe','pipe','pipe'] });
  children.add(child);
  socket.pipe(child.stdin); child.stdout.pipe(socket);
  child.stdin.on('error', () => socket.destroy());
  child.stderr.resume(); // SSH/socket errors contain no useful visitor-facing output.
  child.on('error', () => socket.destroy());
  child.on('close', () => { children.delete(child); socket.end(); });
  socket.on('error', () => child.kill());
  socket.on('close', () => child.kill());
});
server.listen(localPort, '127.0.0.1', () => console.info(`Read-only ${target} tunnel: http://127.0.0.1:${localPort}/ (HTTP; full Secure-cookie QA requires staging HTTPS)`));
const stop = () => { for (const child of children) child.kill(); server.close(); };
process.once('SIGINT', stop); process.once('SIGTERM', stop);
