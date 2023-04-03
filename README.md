http-server 启动 https

npx http-server -S -C ./cert.pem -K ./key.pem 

生成证书
openssl genrsa -out key.pem 1024
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem


# little-trick
