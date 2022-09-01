
function waitersSchecule(dataFactory,displayFactory){

    async function defaultRoute(){
        res.redirect('/index');
    }
    async function homePage(){
        let herWaiter =await dataFactory.setEmployee(req.body.username);
        if(herWaiter !==""){
            let waiter = dataFactory.getEmployee();
            res.redirect(`waiters/${waiter}`)
        }else{
            req.flash('error', dataFactory.errors())
        }

    }

    async function getWaiter(){
        let waiter = dataFactory.getEmployee();
        let shifts = await shiftsSelected(waiter);
        res.render('waiters', {
            waiter,
            shifts
        })

    }

    async function postDays(){
        let strWaiter = dataFactory.getEmployee();
        let myWaiter = req.body.checkDays
	if ( myWaiter == undefined ) {
		req.flash('error', 'Please select at least one day.');
	} else 	{
		req.flash('success', 'Shifts successfuly updated.');
        await dataFactory.waiterShift(myWaiter);
	}
	res.redirect(`waiters/${strWaiter}`);

    }

    async function getDays(){

    }

    async function resetData(){

    }

    return {
        defaultRoute,
        homePage,
        postDays,
        getDays,
        resetData,
        getWaiter
    }


}

export default waitersSchecule;