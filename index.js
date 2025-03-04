
      import { initServer } from './configs/apps.js'
      import { config } from 'dotenv'
      import { connect } from './configs/mongo.js'
      
      config()
      connect()
      initServer()