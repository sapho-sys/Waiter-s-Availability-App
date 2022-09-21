
function waitersSchecule(dataFactory) {

    async function defaultRoute(req, res) {
        res.render('index');
    }
    async function postWaiter(req, res) {
        let entry = req.body.username;
        if (entry != '') {
            await dataFactory.setEmployee(entry);
            let waiter = dataFactory.getEmployee();
            res.redirect(`waiters/${waiter}`);
        } else{
            req.flash('error', 'Provide us with your name before we proceed');
            res.redirect('/');
        }

    }

    async function getWaiter(req, res) {
        let waiter = dataFactory.getEmployee();
        let weeklyShifts = await dataFactory.shiftsSelected(waiter);
        res.render('waiters', {
            waiter,
            weeklyShifts
        })

    }

    async function postDays(req, res) {
        let strWaiter = dataFactory.getEmployee();
        let myWaiter = req.body.checkDays
        if (myWaiter.length > 3) {
            req.flash('error', 'Please select at least three days for your schedule.');
        } else {
            req.flash('success', 'Successfuly updated.');
            await dataFactory.waiterShift(myWaiter);
        }
        res.redirect(`waiters/${strWaiter}`);

    }

    async function getDays(req, res) {
        const myTable = await dataFactory.integrateData()
        const Addcolor = await dataFactory.classListAddForShifts();
        // here I configure the arrays I will work with for each day
        const Monday = [];
        const Tuesday = [];
        const Wednesday = [];
        const Thursday = [];
        const Friday = [];
        const Saturday = [];
        const Sunday = [];
        // puttin my arrays to use by pushing the names of the waiters 
        for (const i of myTable) {
            if (i.shifts.includes('Sunday')) {
                Sunday.push(i.waiter_name);
            } else if (i.shifts.includes('Monday')) {
                Monday.push(i.waiter_name);
            } else if (i.shifts.includes('Tuesday')) {
                Tuesday.push(i.waiter_name);
            } else if (i.shifts.includes('Wednesday')) {
                Wednesday.push(i.waiter_name);
            } else if (i.shifts.includes('Thursday')) {
                Thursday.push(i.waiter_name);
            } else if (i.shifts.includes('Friday')) {
                Friday.push(i.waiter_name);
            }
            if (i.shifts.includes('Saturday')) {
                Saturday.push(i.waiter_name);
            }

        }
        res.render('admin', {
            Sunday,
            Monday,
            Tuesday,
            Wednesday,
            Thursday,
            Friday,
            Saturday,
            Addcolor
        });
    }

    async function resetInfo(req, res) {
        await dataFactory.resetData();
        req.flash('success', dataFactory.errors())
        res.redirect('/days');

    }

    return {
        defaultRoute,
        postWaiter,
        postDays,
        getDays,
        resetInfo,
        getWaiter
    }


}

export default waitersSchecule;