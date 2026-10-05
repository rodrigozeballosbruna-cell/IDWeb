const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const getContentType = (filePath) => {
    const ext = path.extname(filePath);
    switch (ext) {
        case '.html': return 'text/html; charset=utf-8';
        case '.css': return 'text/css';
        case '.js': return 'text/javascript';
        case '.json': return 'application/json';
        default: return 'text/plain';
    }
};

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    const dataPath = path.join(__dirname, 'data', 'estudiantes.json');

    // 1. ENDPOINT: GET /api/estudiantes
    if (req.url === '/api/estudiantes' && req.method === 'GET') {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al leer la base de datos local' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });

    // 2. ENDPOINT: POST /api/estudiantes
    } else if (req.url === '/api/estudiantes' && req.method === 'POST') {
        let body = '';

        // Captura de chunks de datos (stream)
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const nuevoEstudiante = JSON.parse(body);

                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error al leer el archivo JSON' }));
                    }

                    const estudiantes = JSON.parse(data);
                    // Asignar ID autoincrementable sencillo
                    nuevoEstudiante.id = estudiantes.length ? estudiantes[estudiantes.length - 1].id + 1 : 1;
                    estudiantes.push(nuevoEstudiante);

                    // Persistencia en archivo JSON
                    fs.writeFile(dataPath, JSON.stringify(estudiantes, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Error al guardar el nuevo registro' }));
                        }

                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(nuevoEstudiante));
                    });
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'JSON malformado o inválido' }));
            }
        });

    // 3. ARCHIVOS ESTÁTICOS (/public)
    } else if (req.method === 'GET') {
        const reqFile = req.url === '/' ? 'index.html' : req.url;
        const filePath = path.join(__dirname, 'public', reqFile);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
            } else {
                res.writeHead(200, { 'Content-Type': getContentType(filePath) });
                res.end(content);
            }
        });

    // 4. MANEJO DE RUTAS Y MÉTODOS NO EXISTENTES
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});