
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId({ length: 10 });
function waitersSchecule(dataFactory,db) {

    async function defaultRoute(req, res) {
        res.render('index');
    }
    async function signUpRoute(req, res) {
        res.render('signup');
    }

    async function loginRoute(req, res) {
        res.render('login');
    }
    async function regUser(req,res){
        const userEmail= req.body.email;
        const username= req.body.username;
        if(userEmail !='' || username !=''){
            let code = uid();
              console.log(`Here is the code`,code)
           
            // if(existingUser > 0){
                // req.flash('error','This account already exists');
                // res.redirect('back');
            // }else{
                await dataFactory.registerUser(username,userEmail,code)
                req.flash('error',`Here is your password>>${code}`)
                res.redirect(`back`);
             // }
        }else{
            req.flash('error','Please ensure that you fill in all fields');
            res.redirect('back')
        }
    }

    async function Login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
       const userLogin = await db.manyOrNone(`SELECT * FROM admin_user 
       WHERE email = $1 and code = $2`,[email, password]);
       console.log(userLogin);
       if(userLogin.length == 0){
        req.flash('error','You do not have an account; please create it');
        res.redirect('back')
       }else{
        req.session.userLogin = userLogin;
        res.redirect(`days`)
       }
    }
    async function postWaiter(req, res) {
        let entry = req.body.username;
        if (entry != '') {
            await dataFactory.setEmployee(entry);
            let waiter = dataFactory.getEmployee();
            res.redirect(`waiters/${waiter}`);
        } else if(!entry){
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
        let waiterShifts = req.body.checkDays;
        var numOfTrue = waiterShifts.filter(function(item){ return typeof item === "string"; }).length
        if (!waiterShifts || numOfTrue < 3) {
            req.flash('error', 'Please select at least three days for your schedule.');
        } else if (numOfTrue >=3) {
            req.flash('success', 'Successfuly updated.');
            await dataFactory.waiterShift(waiterShifts);
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
            user:req.session.userLogin,
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
        getWaiter,
        signUpRoute,
        loginRoute,
        regUser,
        Login
    }


}

export default waitersSchecule;