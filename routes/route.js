
function waitersSchecule(dataFactory) {

    async function defaultRoute(req, res) {
        res.render('index',{
            // errors:  dataFactory.errors()
        });
    }
    async function postWaiter(req, res) {
        let herWaiter = await dataFactory.setEmployee(req.body.waitername);
        if (herWaiter !== "") {
            let waiter = dataFactory.getEmployee();
            res.redirect(`waiters/${waiter}`)
        } else if(!waiter){
            req.flash('warn', dataFactory.errors());
            res.redirect('/index');
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
        if (!myWaiter) {
            req.flash('error', 'Please select at least one day.');
        } else {
            req.flash('success', 'Shifts successfuly updated.');
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

    async function resetInfo(req,res) {
        await dataFactory.resetData();
        req.flash('success', dataFactory.errors())
        res.redirect('/shifts/days');

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