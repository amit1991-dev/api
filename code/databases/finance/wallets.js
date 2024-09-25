const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const Transactions = require("./transactions");

const WalletsSch = new mongoose.Schema(
    {
       owner_id:{type:ObjectId,required:true,ref:"users"},
       transactions:[{type:ObjectId,ref:"transactions"}],
    },
    { strict: false,timestamps:true }
);

Wallets  = mongoose.model("wallets", WalletsSch);

Wallets.addTransactionToWallet=async function(walletId,transactionId)
{
   if(walletId && transactionId)
   {
      console.log(walletId+" : "+transactionId);
      try{
         let transaction  = await Transactions.findOne({_id:transactionId});
         let p=await Wallets.findOne({_id:walletId});
         p.transactions.push(transaction._id);
         await p.save();
         return true;
      }
      catch(err){
         console.log("failed-: "+walletId+" : "+transactionId);
         console.log(err);
         return false;
      }
   }  
}

Wallets.getWallet=async function(wallet_id)
{
   if(wallet_id)
   {       
      try{
         let p=await Wallets.findOne({_id:wallet_id}).populate("transactions").lean();
         p.unsettled_amount = Wallets.getSettlementValue(wallet_id);
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

Wallets.getUserWallet=async function(user_id)
{   
      try{
         let p=await Wallets.findOne({owner_id:user_id}).populate("transactions").lean();
         if(!p){
            let hostWallet = new Wallets({owner_id:user_id});
            await hostWallet.save();
            p = hostWallet.toObject();
         }
         p.unsettled_amount = await Wallets.getSettlementValue(p._id);
         console.log(p);
         return p;
         //await p.save();
      }
      catch(err){
         console.log(err);
         return false;
      }
}

Wallets.getSettlementValue=async function(wallet_id)
{
   if(wallet_id)
   {       
      try{
         let wallet=await Wallets.findOne({_id:wallet_id}).populate("transactions");
         let transactions = wallet.transactions;
         console.log(transactions);
         let settlementValue =0;
         for(var transaction in transactions)
         {
            if(transaction.approved && !transaction.settled)
            {
               if(transaction.credit)
               {
                  settlementValue+=amount;
               }
               else{
                  settlementValue-=amount;
               }
            }
         }
         return settlementValue;
         // return transactions;
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


//only admin should run this when all the payments have been made to the host
Wallets.doFullSettlement=async function(wallet_id)
{
   if(wallet_id)
   {       
      try{
         let wallet=await Wallets.findOne({_id:wallet_id}).populate("transactions");
         let transactions = wallet.transactions;
         console.log(transactions);
         let settlementValue = 0;
         for(var transaction in transactions)
         {
            if(transaction.approved && !transaction.settled)
            {
               if(transaction.credit)
               {
                  settlementValue+=amount;
               }
               else{
                  settlementValue-=amount;
               }
               transaction.settled = true;
               await Transactions.setSettled(transaction._id);
            }
         }
         return settlementValue;
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

module.exports = Wallets;
