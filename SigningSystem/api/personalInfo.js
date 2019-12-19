const db = require('../database/db.js');

module.exports.getPersonalInfo = function (req,res,next) {
    const userAccount = req.session.user.userAccount;
    const userPassword = req.session.user.userPassword;

    const queryPersonInfo = 'SELECT mName,mClassID,mJobNumber,mSex,mRegDate,isAdmin,isSuAdmin,seClass,sePublicDate,seValidDate,miStatus FROM member,memberinfo,signingevent WHERE mAccount='
                            +db.escape(userAccount)
                            +'AND mPassword='+db.escape(userPassword)
                            +'AND member.mID=memberinfo.mID AND signingevent.seID=memberinfo.seID';
    let personalInfo = {
        userAccount: userAccount,
        userPassword: userPassword,
        signEventID: [],
        signEventName: [],
        signEventStatus: [],
        signEventClassID: [],
        signEventPublicDate: [],
        signEventValidDate: [],
    }
    db.query(queryPersonInfo,function (err,doc) {
        if(err){
            console.log(err);
            return;
        }
        for(let item in doc){
            personalInfo.signEventID.push(item.seID);
            personalInfo.signEventName.push(item.seName);
            personalInfo.signEventStatus.push(item.seStatus);
            personalInfo.signEventClassID.push(item.seClassID);
            personalInfo.signEventPublicDate.push(item.sePublicDate);
            personalInfo.signEventValidDate.push(item.seValidDate);
        }
        personalInfo.userName = doc[0].mName;
        personalInfo.userClassID = doc[0].mClassID;
        personalInfo.userJobNumber = doc[0].mJobNumber;
        personalInfo.userSex = doc[0].mSex;
        personalInfo.userRegDate = doc[0].mRegDate;
        personalInfo.userIsAdmin = doc[0].isAdmin;
        personalInfo.userIsSuAdmin = doc[0].isSuAdmin;
    });
}