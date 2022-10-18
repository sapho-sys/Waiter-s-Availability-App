
function theWaiters(db) {
    const data = db;
    let errorMsg = '';
    let waitername = '';
    const RegExp = /^[A-Za-z]+$/;
    async function setEmployee(user) {
        waitername = user.trim()
        try {
            if (waitername !== '') {
                if (waitername.match(RegExp)) {
                    const strName = waitername.charAt(0).toUpperCase() + waitername.slice(1).toLowerCase();
                    await data.none('INSERT INTO my_waiters (waiter_name) VALUES ($1)', [strName]);
                }
            }
        } catch (error) {
            console.error('Somethin went wrong', error);
        }

    }

    function getEmployee() {
        return waitername;
    }
    function errors() {
        return errorMsg;
    }

    async function retrieveData() {
        const tableRow = data.manyOrNone('SELECT waiter_name FROM my_waiters');
        return tableRow;
    }

    async function waiterShift(schedule) {
        const waiterId = await waiterIdentity()
        const newWaiter = await data.manyOrNone('SELECT waiter_id,shift_id FROM waiter_shifts WHERE waiter_id = $1', [waiterId]);
        if (newWaiter.length == 0) {
            await scheduleDay(schedule, waiterId);
        } else {
            await data.query('DELETE FROM waiter_shifts WHERE waiter_id = $1', [waiterId]);
            await scheduleDay(schedule, waiterId);
        }
    }

    async function scheduleDay(weeklyShifts, todayId) {
        let dayId;
        let theDayId;
        if (Array.isArray(new Array(weeklyShifts))) {
            for (const i of weeklyShifts) {
                dayId = await data.manyOrNone('SELECT id FROM weekdays WHERE shifts = $1', [i]);
                theDayId = dayId[0].id;
                await data.manyOrNone('INSERT INTO waiter_shifts (waiter_id, shift_id) VALUES ($1,$2)', [todayId, theDayId]);
            }
        }
    }

    async function integrateData() {
        const strWaiters = await data.manyOrNone(`SELECT my_waiters.waiter_name, weekdays.shifts 
        FROM waiter_shifts
		INNER JOIN my_waiters ON waiter_shifts.waiter_id = my_waiters.id
		INNER JOIN weekdays ON waiter_shifts.shift_id = weekdays.id`);
        return strWaiters;

    }

    async function checkUser(username, email) {
        const code = ' ';
        await registerUser(username, email, code);
    }

    async function registerUser(username, email, password) {
        let dataModel = [
            username,
            email,
            password
        ]
        try {
            const regEntry = await data.none(`INSERT INTO admin_user (username, email, code) 
            VALUES($1 ,$2,$3)`, dataModel);
        } catch (error) {
            console.log(`Here is your error:`, error)
        }
    }

    async function weekDays() {
        const theWeek = await data.manyOrNone('SELECT * FROM weekdays');
        return theWeek;
    }
    async function waiterIdentity() {
        const getId = await data.manyOrNone('SELECT id FROM my_waiters WHERE waiter_name = $1', [waitername]);
        return getId[0].id;
    }
    async function shiftsSelected(waiter) {
        const theDays = await weekDays();
        const myWaiterId = await waiterIdentity(waiter)
        for (const i of theDays) {
            const result = await data.manyOrNone('SELECT COUNT(*) FROM waiter_shifts WHERE waiter_id = $1 and shift_id = $2', [myWaiterId, i.id]);
            const count = result[0].count;
            if (count > 0) {
                i.ticked = true;
            } else {
                i.ticked = false;
            }
        }
        return theDays;
    }

    async function deleteData(waiter) {
        const workWeek = await weekDays();
        const employeeID = await waiterIdentity(waiter);
        for (const j of workWeek) {
            const remove = await data.none(`DELETE FROM waiter_shifts WHERE waiter_id = $1 and shift_id = $2`, [employeeID, j.id]);
        }
    }

    async function classListAddForShifts() {
        const eachDay = await weekDays();
        for (const day of eachDay) {
            const result = await data.manyOrNone('SELECT COUNT(*)  FROM waiter_shifts WHERE shift_id = $1', [day.id]);
            // console.log(result)
            const count = result[0].count;
            //add color to my weekdays based on shedules
            if (count < 3) {
                day.color = 'yellow';
            } else if (count == 3) {
                day.color = 'green';
            } else {
                day.color = 'red';
            }
        }
        return eachDay;
    }



    async function resetData() {
        errorMsg = "Your schedule data has been  cleared";
        return data.none('DELETE FROM waiter_shifts');
    }

    return {
        setEmployee,
        errors,
        retrieveData,
        classListAddForShifts,
        shiftsSelected,
        scheduleDay,
        integrateData,
        waiterShift,
        resetData,
        getEmployee,
        waiterIdentity,
        registerUser,
        checkUser,
        deleteData
    }

}

export default theWaiters;