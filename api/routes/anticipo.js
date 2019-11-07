const express = require('express');
const router = express.Router();

const { Pool } = require('pg');
const serverBD = require('../connection/connect');

const pool = new Pool({
    user: serverBD.username,
    host: serverBD.ip,
    database: serverBD.database,
    password: serverBD.password,
    port: serverBD.port
})

//POST PARA LISTAR
router.post('/', (req, res, next) => {
    
    var results;
    var rpta;

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select a.id, a.descripcion, to_char(a.fecha_inicio,'DD-MM-YYYY') as fecha_inicio, to_char(a.fecha_fin,'DD-MM-YYYY') as fecha_fin, a.estado, a.monto, a.foto from anticipo a inner join usuario us on a.usuario_id=us.id where us.correo='"+req.body.correo+"'")
        .then(result => {
            client.release()
            results = result.rows;
            // rpta = JSON.parse(results);
            return res.json(results);
            // return JSON.parse(results);
        //     return results res.json(
        //         results
        //    );
        })
        .catch(e => {
            client.release()

            console.log(e.stack)
        })
    })
});

//POST PARA VER SI TIENE ANTICIPOS PENDIENTES
router.post('/pendiente', (req, res, next) => {
    
    var results;
    var rpta;

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select count(*) from anticipo a inner join usuario u on a.usuario_id=u.id where u.correo='"+req.body.correo+"' and a.estado=1")
        .then(result => {
            client.release()
            results = result.rows;
            // rpta = JSON.parse(results);
            return res.json(results);
            // return JSON.parse(results);
        //     return results res.json(
        //         results
        //    );
        })
        .catch(e => {
            client.release()

            console.log(e.stack)
        })
    })
});

//POST PARA LISTAR SEGUN ID
router.post('/id', (req, res, next) => {
    
    var results;
    var rpta;

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select da.anticipo_id,da.rubro_id,da.monto,da.estado from detalle_anticipo da inner join anticipo a on da.anticipo_id=a.id where a.descripcion='"+req.body.descripcion+"'")
        .then(result => {
            client.release()
            results = result.rows;
            // rpta = JSON.parse(results);
            return res.json(results);
            // return JSON.parse(results);
        //     return results res.json(
        //         results
        //    );
        })
        .catch(e => {
            client.release()

            console.log(e.stack)
        })
    })
});

//POST PARA LISTAR SEGUN ESTADO
router.post('/aprobado', (req, res, next) => {
    
    var results;
    var rpta;

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select a.id, a.descripcion, to_char(a.fecha_inicio,'DD-MM-YYYY') as fecha_inicio, to_char(a.fecha_fin,'DD-MM-YYYY') as fecha_fin, a.estado, a.monto, a.foto from anticipo a inner join usuario us on a.usuario_id=us.id where a.estado=1 and us.correo='"+req.body.correo+"'")
        .then(result => {
            client.release()
            results = result.rows;
            // rpta = JSON.parse(results);
            return res.json(results);
            // return JSON.parse(results);
        //     return results res.json(
        //         results
        //    );
        })
        .catch(e => {
            client.release()

            console.log(e.stack)
        })
    })
});

//POST PARA REGISTRAR
router.post('/agregar', (req, res, next) => {
    
    var results;
    var rpta;

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from f_registrar_anticipo('"+req.body.anticipo+"','"+req.body.detalle_anticipo+"')")
        .then(result => {
            client.release()
            results = result.rows;
            // rpta = JSON.parse(results);
            return res.json(results);
            // return JSON.parse(results);
        //     return results res.json(
        //         results
        //    );
        })
        .catch(e => {
            client.release()

            console.log(e.stack)
        })
    })
});

// //POST REGISTRAR
// router.post('/', (req, res, next) => {
    
//     var results = [];

//     pool.on('error', (err, client) => {
//         console.error('Unexpected error on idle client', err)
//         process.exit(-1)
//     })
    
//     pool.connect()
//     .then(client => {
//         return client.query("select a.id, a.descripcion, to_char(a.fecha_inicio,'DD-MM-YYYY') as fecha_inicio, to_char(a.fecha_fin,'DD-MM-YYYY') as fecha_fin, a.estado, a.monto, a.foto from anticipo a inner join usuario us on a.usuario_id=us.id where us.correo='"+req.body.correo+"'")        
//         // return client.query("select a.id, a.descripcion, to_char(a.fecha_inicio,'DD-MM-YYYY') as fecha_inicio, to_char(a.fecha_fin,'DD-MM-YYYY') as fecha_fin, a.estado, a.monto, a.foto from anticipo a")        
//         .then(result => {
//             client.release()
//             results = result.rows;
//             return res.status(201).json({
                
//                     results
                
//             });
//         })
//         .catch(e => {
//             client.release()
//             // console.log(err.stack)
//             console.log(e.stack)
//         })
//     })
// });

//GET (DETALLE)
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    
    pool.connect()
    .then(client => {
        return client.query("select * from sel_usuario_detalle('"+id+"') as (id int, usuario varchar(100), clave varchar(100),tipo_usuario int, persona_id char(8), estado boolean)")
        .then(result => {
            client.release()
            results = result.rows;
            return res.status(201).json({
                recordSet: {
                    element: results[0],
                },
            });
        })
        .catch(e => {
            client.release()
            console.log(err.stack)
        })
    })
    
});

//PUT
router.put('/:id', (req, res, next) => {
    const id = req.params.id;

    //VARIABLES DE ALMACENAMIENTO
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    
    pool.connect()
    .then(client => {
        return client.query("select * from upd_usuario('"+id+"','"+req.body.usuario+"','"+req.body.clave+"','"+req.body.tipo_usuario+"','"+req.body.persona_id+"','"+req.body.estado+"')")
        .then(result => {
            client.release()
            results = result.rows;
            return res.status(201).json({
                recordSet: {
                    element: results[0],
                },
            });
        })
        .catch(e => {
            client.release()
            // console.log(err.stack)
            console.log(e.stack)
        })
    })
});

module.exports = router;