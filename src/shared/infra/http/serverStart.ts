import startServer from './server'

startServer()
  .then(app => {
    app.listen(3333, () => {
      console.log("🚀 O servidor foi iniciado na porta 3333!")
    })
  })
  .catch(error => {
    console.error("Falha ao conectar ao servidor: ", error)
  })
