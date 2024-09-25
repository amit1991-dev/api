const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
// const messages = require("./messages.js");
const Mixed=mongoose.Schema.Types.Mixed;


const WalletsSch = new mongoose.Schema(
    {
       owner_id:{type:ObjectId,required:true},
       amount:{type:String,required:true},
       transactions:[{type:ObjectId,ref:"transactions"}],
      
    },
    { strict: false,timestamps:true }
);

Wallets  = mongoose.model("wallets", WalletsSch);

Wallets.addTransaction=async function(wallet_id,transaction)
{
   if(wallet_id && transaction)
   {
      if(transaction.transaction_type=="straight")
      {
         if(amount-transaction.amount > 0)
         {
            try{
               let p=await Wallets.findOne({_id:wallet_id});
               p.amount-=transaction.amount;
               await p.save();
               return true;
            }
            catch(err){
               console.log(err);
               return false;
            }
         }
      }
      else if(transaction.transaction_type=="refund")
      {
         try{
               let p=await Wallets.findOne({_id:wallet_id});
               p.amount+=transaction.amount;
               await p.save();
               return true;
            }
            catch(err){
               console.log(err);
               return false;
            }
      }
      else{
         console.log('unknown transaction type');
         return false;
      }
      
   }
   else
   {
      return false;
   }
}

Wallets.getWallet=async function(wallet_id)
{
   if(wallet_id)
   {       
      try{
         let p=await Wallets.findOne({_id:wallet_id}).populate("transactions");
         console.log(p);
         return p;
         //await p.save();
      }
      catch(err){
         console.log(err);
         return false;
      }  
   }
   else
   {
      return false;
   }
}

Wallets.createWallet=async function(user)
{
   if(user && user._id)
   {       
      try{
         let p=new Wallets({owner_id:user._id});
         await p.save();
         return true;
      }
      catch(err){
         console.log(err);
         return false;
      }
   }
   else
   {
      console.log("user or user id not present");
      return false;
   }
}



module.exports = Wallets;
