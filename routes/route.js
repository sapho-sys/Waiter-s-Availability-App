
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
        let shifts = await waiterShift(waiter);




    }

    async function postDays(){

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