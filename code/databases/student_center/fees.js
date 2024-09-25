const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const FeesSch = new mongoose.Schema(
    {
        student: {
            type: ObjectId,
            ref:"students",
            required:true,
            unique:true,
        },
        amount:{
            type:Number,
            required:true,
        },

    },
    { strict: false,minimize:false,timestamp:true }
);

const InstallmentSch = new mongoose.Schema(
    {
        fees:{
            type:ObjectId,
            ref:"fees",
            required:true
        },
        amount:{
            type:Number,
            required:true,
            default:0,
        },
        timestamp:{
            type:Date,
            required:true,
        },
        installment_status:{
            type:{
                received:{
                    type:Boolean,
                    default:false,
                    required:true,
                },
                timestamp:{
                    type:Date,
                },
                receipt_number:String,
                payment_mode:String,
                payment_reference_number:String,
                staff:{
                    type:ObjectId,
                    ref:"staff",
                }
            },
            required:true,
        }, 
    },
    { strict: false,minimize:false,timestamp:true }
);
let Installments = mongoose.model("installments", InstallmentSch);
let Fees = mongoose.model("fees", FeesSch);

Fees.getStudentFees=async function(student_id){
    try{
        if(!student_id){
            throw {message:"student Id not present"};
        }
        let fees = await Fees.findOne({student:student_id}).lean();
        let installments = await Installments.find({fees:fees._id});
        fees.installments = installments;
        return fees;
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}
module.exports = {Fees,Installments};