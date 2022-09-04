
function waitersSchecule(dataFactory) {

    async function defaultRoute(req, res) {
        res.render('index');
    }
    async function postWaiter(req, res) {
        let herWaiter = await dataFactory.setEmployee(req.body.waitername);
        if (herWaiter !== "") {
            let waiter = dataFactory.getEmployee();
            res.redirect(`waiters/${waiter}`)
        } else {
            req.flash('error', dataFactory.errors());
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
        if (myWaiter == undefined) {
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
        const Monday = [];
        const Tuesday = [];
        const Wednesday = [];
        const Thursday = [];
        const Friday = [];
        const Saturday = [];
        const Sunday = [];

        for (const i of myTable) {
            if (i.shifts === 'Sunday') {
                Sunday.push(i.waiter_name);

            } else if (i.shifts === 'Monday') {
                Monday.push(i.waiter_name);

            } else if (i.shifts === 'Tuesday') {
                Tuesday.push(i.waiter_name);

            } else if (i.shifts === 'Wednesday') {
                Wednesday.push(i.waiter_name);

            } else if (i.shifts === 'Thursday') {
                Thursday.push(i.waiter_name);

            } else if (i.shifts === 'Friday') {
                Friday.push(i.waiter_name);

            }
            if (i.shifts === 'Saturday') {
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