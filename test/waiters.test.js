import assert from "assert";
import dataFactory from "../data-factory.js";
import pgPromise from "pg-promise";
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:sap123@localhost:5432/her_waiters';

const config = {
    connectionString
}

if (process.env.NODE_ENV == 'production') {
    config.ssl = {
        rejectUnauthorized: false
    }
}



const db = pgp(config);

describe('Waiters availibility webapp' , function(){
	beforeEach(async function(){
		// clean the tables before each test run
        await db.query('DELETE FROM waiter_shifts;');
		await db.query('DELETE FROM my_waiters;');
        
	});


	it('Should be able to add the waiters name to the database', async function(){
		let instanceWaiters = dataFactory(db);

		await instanceWaiters.setEmployee('Sapho');

		assert.deepEqual([{waiter_name:'Sapho'}], await instanceWaiters.retrieveData());
	});

	it('Should show an error message for a waiter who has already scheduled', async function(){
		let instanceWaiters = dataFactory(db);

		await instanceWaiters.setEmployee('Thanos');
		await instanceWaiters.setEmployee('Thanos');

		assert.deepEqual('Note: This waiter has already done their schedule for the week!', instanceWaiters.errors());
	});

    it ('Should show an error message if the waiters name is mixed with special characters', async function(){
        let instanceWaiters = dataFactory(db);

        await instanceWaiters.setEmployee("Skillo24");

        assert.deepEqual('Invalid characters entered!, please try again...',instanceWaiters.errors());

    });

    it ('Should request the user to enter a waiters name if its a blank entry', async function(){
        let instanceWaiters = dataFactory(db);
        await instanceWaiters.setEmployee("");

        assert.deepEqual('Please provide your name !', instanceWaiters.errors());
    })

	it ('Should be able to return the waiters name entered', async function(){
        let instanceWaiters = dataFactory(db);
        await instanceWaiters.setEmployee("Sapho");

        assert.deepEqual('Sapho', instanceWaiters.getEmployee());
    });

    // it ('Should be able to show the waiters scheduled', async function(){
    //     let instanceWaiters = dataFactory(db);
    //     await instanceWaiters.setEmployee("Sapho");
    //     const weeklyShifts = [ 1, 3, 6];

    //     await instanceWaiters.waiterShift(weeklyShifts)
       
       

    //     assert.deepEqual([
            
    //       ], await instanceWaiters.integrateData());
    // })



	after(function(){
        db.$pool.end();
	});
});