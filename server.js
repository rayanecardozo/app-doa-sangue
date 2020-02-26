//configurando o servidor
const express = require("express")
const server = express()


//Configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))


//Habilitar body do formulario

server.use(express.urlencoded({extended:true}))

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '99074979',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,

})

//Lista de doadores:Vetor ou Array


//Configurar a apresentação da página
server.get("/", function(req, res){


    db.query("select * from donors order by id desc limit 4", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html",{donors})
    })

})

server.post("/", function(req, res){
    //pegar dasos do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    //Coloco valores dentro do banco de dados
    const query = `
        insert into donors ("name","email","blood")
        values ($1, $2, $3)`

    const values = [name, email, blood.toUpperCase()]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("erro no banco de dados.")


        //fluxo ideal
        return res.redirect("/")
    })
 
})

//Ligar o servidor e permitir o acesso na porta 3000
const port = 3000;
server.listen(port, function(){
    console.log(`Iniciei o servidor em http://localhost:${port}`)
})