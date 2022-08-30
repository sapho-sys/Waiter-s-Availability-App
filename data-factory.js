function theWaiters(db) {
    const data = db;
    let errorMsg = '';

    const RegExp = /^[A-Za-z]+$/;

    async function setEmployee(user) {
        let waitername = user.trim()
        try {
            if (waitername !== '') {
                if (waitername.match(RegExp)) {
                    let waiter = waitername.charAt(0).toUpperCase + waitername.slice(1).toLowerCase();
                    const sqlDuplicates = await data.manyOrNone('SELECT waiter_name FROM my_waiters WHERE waiter_name = $1', [waiter]);
                    if (sqlDuplicates.length == 0) {
                        await data.manyOrNone('INSERT INTO my_waiters (waiter_name) VALUES ($1)', [waiter]);
                    } else {
                        errorMsg = 'Note: This waiter has already done their schedule for the week!'
                    }
                } else {
                    errorMsg = 'Invalid characters entered!, please try again...'
                }
            } else {
                errorMsg = 'Please provide your name !'
            }

        } catch (error) {
            console.error('Somethin went wrong', err);
            throw err;
        }

    }
    function errors() {
        return errorMsg;
    }

    async function retrieveData() {
        const tableRow = data.manyOrNone('SELECT waiter_name FROM my_waiters');
        return tableRow;
    }



    return {
        setEmployee,
        errors,
        retrieveData
    }







}

export default theWaiters;