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

	// it('Should be able to add the waiters name to the database', async function(){
	// 	let instanceWaiters = dataFactory(db);

	// 	await instanceWaiters.setEmployee('Sapho');

	// 	assert.deepEqual([{waiter_name:'Sapho',id:434}], await instanceWaiters.retrieveData());
	// });
   
	it ('Should be able to return the waiters name entered', async function(){
        let instanceWaiters = dataFactory(db);
        await instanceWaiters.setEmployee("Sapho");
        let waiter =  instanceWaiters.getEmployee();
        console.log(`Waitername:`,waiter);

        assert.deepEqual('Sapho', instanceWaiters.getEmployee());
    });

    it ('Should be able to schedule shifts and show color Yellow to be applied to the table header', async function(){
      let instanceWaiters = dataFactory(db);

      await instanceWaiters.setEmployee("Sapho");
      const weeklyShifts = ["Wednesday","Thursday","Friday"];
      await instanceWaiters.waiterShift(weeklyShifts);
      let data =  await instanceWaiters.classListAddForShifts();
      console.log(`Schedule:`, data);

      assert.deepEqual([
          {
            color: 'yellow',
            id: 1,
            shifts: 'Sunday'
          },
          {
            color: 'yellow',
            id: 2,
            shifts: 'Monday'
          },
          {
            color: 'yellow',
            id: 3,
            shifts: 'Tuesday'
          },
          {
            color: 'yellow',
            id: 4,
            shifts: 'Wednesday'
          },
          {
            color: 'yellow',
            id: 5,
            shifts: 'Thursday'
          },
          {
            color: 'yellow',
            id: 6,
            shifts: 'Friday'
          },
          {
            color: 'yellow',
            id: 7,
            shifts: 'Saturday'
          }
        ], await instanceWaiters.classListAddForShifts());
  })

    it ('Should be able to schedule shifts and show color Green to be applied to the table header for Wednesday, Thursday & Friday', async function(){
        let instanceWaiters = dataFactory(db);

        await instanceWaiters.setEmployee("Sapho");
        const weeklyShifts = ["Wednesday","Thursday","Friday"];
        await instanceWaiters.waiterShift(weeklyShifts);

        await instanceWaiters.setEmployee("Thanos");
        const weeklyShifts2 = ["Wednesday","Thursday","Friday"];
        await instanceWaiters.waiterShift(weeklyShifts2);

        await instanceWaiters.setEmployee("Hluma");
        const weeklyShifts3 = ["Wednesday","Thursday","Friday"];
        await instanceWaiters.waiterShift(weeklyShifts3);
        let data2 =  await instanceWaiters.classListAddForShifts();
        console.log(`Schedule2:`, data2);

        assert.deepEqual([
            {
              color: 'yellow',
              id: 1,
              shifts: 'Sunday'
            },
            {
              color: 'yellow',
              id: 2,
              shifts: 'Monday'
            },
            {
              color: 'yellow',
              id: 3,
              shifts: 'Tuesday'
            },
            {
              color: 'green',
              id: 4,
              shifts: 'Wednesday'
            },
            {
              color: 'green',
              id: 5,
              shifts: 'Thursday'
            },
            {
              color: 'green',
              id: 6,
              shifts: 'Friday'
            },
            {
              color: 'yellow',
              id: 7,
              shifts: 'Saturday'
            }
          ], await instanceWaiters.classListAddForShifts());
    })

    it ('Should be able to schedule shifts and show color Red to be applied to the table header for Wednesday, Thursday, Friday & Saturday', async function(){
      let instanceWaiters = dataFactory(db);

      await instanceWaiters.setEmployee("Sapho");
      const weeklyShifts = ["Wednesday","Thursday","Friday","Saturday"];
      await instanceWaiters.waiterShift(weeklyShifts);

      await instanceWaiters.setEmployee("Thanos");
      const weeklyShifts2 = ["Wednesday","Thursday","Friday","Saturday"];
      await instanceWaiters.waiterShift(weeklyShifts2);

      await instanceWaiters.setEmployee("Hluma");
      const weeklyShifts3 = ["Wednesday","Thursday","Friday","Saturday"];
      await instanceWaiters.waiterShift(weeklyShifts3);

      await instanceWaiters.setEmployee("Chicco");
      const weeklyShifts4 = ["Wednesday","Thursday","Friday","Saturday"];
      await instanceWaiters.waiterShift(weeklyShifts4);

      let data3 =  await instanceWaiters.classListAddForShifts();
      console.log(`Schedule3:`, data3);


      assert.deepEqual([
          {
            color: 'yellow',
            id: 1,
            shifts: 'Sunday'
          },
          {
            color: 'yellow',
            id: 2,
            shifts: 'Monday'
          },
          {
            color: 'yellow',
            id: 3,
            shifts: 'Tuesday'
          },
          {
            color: 'red',
            id: 4,
            shifts: 'Wednesday'
          },
          {
            color: 'red',
            id: 5,
            shifts: 'Thursday'
          },
          {
            color: 'red',
            id: 6,
            shifts: 'Friday'
          },
          {
            color: 'red',
            id: 7,
            shifts: 'Saturday'
          }
        ], await instanceWaiters.classListAddForShifts());
  })





	after(function(){
        db.$pool.end();
	});
});