const userModel=require('../models/userModel');


module.exports.updateProfileImage=function updateProfileImage(req,res){
    
    res.json({
        message:'file uploaded successfully'
    })
}

// module.exports.getDownloadFile=function getDownloadFile(req,res){
//     res.sendFile("D:/riya/Web development/bookWebsite/view/fileDownload.html");
// }

module.exports.downloadFile=function downloadFile(req,res){
res.download(`D:/riya/Sem 1/Tutorials/MA101/tut 2.pdf`);
}

