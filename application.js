const ExpressServer = require('./express.server');
const Environment = require('./environment');

/**
 * Wrapper around the Node process, ExpressServer abstraction and complex dependencies such as services that ExpressServer needs.
 * When not using Dependency Injection, can be used as place for wiring together services which are dependencies of ExpressServer.
 */

class Application {
    static async createApplication() {

        /*
          Configure db
        */

        const MongoService = require('./storage/mongoService').MongoService;
        const db = new MongoService(Environment.getDBHost(), Environment.getDBPort(), Environment.getDBName());
        db.open().catch(console.error);

        /* 
         Setup Service Injection
        */

        // Person service
        const PersonService = require('./person/service.person');
        const PersonRepository = require('./person/repository.person');
        const pReository = new PersonRepository(db);
        const pService = new PersonService(pReository)

        // Storage service
        const StorageService = require('./storage/service.storage');
        const sService = new StorageService();

        // Collect injectable services
        const requestServices = {
            personService: pService,
            storageService: sService
        };

        const expressServer = new ExpressServer(requestServices, db)

        await expressServer.setup(Environment.getAppPort())
        Application.handleExit(expressServer)

        return expressServer
    }

    static handleExit(express) {
        process.on('uncaughtException', (err) => {
            console.error('Uncaught exception', err)
            Application.shutdownProperly(1, express)
        })
        process.on('unhandledRejection', (reason) => {
            console.error('Unhandled Rejection at promise', reason)
            Application.shutdownProperly(2, express)
        })
        process.on('SIGINT', () => {
            console.info('Caught SIGINT')
            Application.shutdownProperly(128 + 2, express)
        })
        process.on('SIGTERM', () => {
            console.info('Caught SIGTERM')
            Application.shutdownProperly(128 + 2, express)
        })
        process.on('exit', () => {
            console.info('Exiting')
        })
    }

    static shutdownProperly(exitCode, express) {
        Promise.resolve()
            .then(() => express.kill())
            .then(() => {
                console.info('Closing database connection')
                express.dbConnection.close()})
            .then(() => {
                console.info('Shutdown complete')
                process.exit(exitCode)
            })
            .catch(err => {
                console.error('Error during shutdown', err)
                process.exit(1)
            })
    }
}

module.exports = Application;