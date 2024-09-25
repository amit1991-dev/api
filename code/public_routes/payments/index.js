const express = require("express");
const router = express.Router();

require('dotenv').config();
const Razorpay = require('razorpay');
const Bookings = require("../../databases/events/bookings");
const { CategoryTickets, PhaseCategories, EventPhases, Events } = require("../../databases/events/events");
const Tickets = require("../../databases/events/tickets");
const RazorpayEvents = require("../../databases/finance/razorpay_events");
const RazorpayTransactions = require("../../databases/finance/razorpay_transactions");

// const crypto = require('crypto');
// const Transactions = require("../../databases/finance/transactions");


router.post("/", async (req, res) => {
    res.status(200).end();


    let payload = req.body;
    // console.log("inside webhook");
    // console.log(JSON.stringify(payload));
    let event = payload.event;


    try{
        // await RazorpayEvents.insertOne({data:payload});
        switch(event){
            case "order.paid":
                handleOrderPaid(payload);
                break;
            default:
                console.log("unsupported payment event");
                console.log(event);
        }
    }
	catch(err)
	{
        // ret.message =err.message;
        console.log(err.message);
	}
});

async function handleOrderPaid(data){
    let order = data.payload.order.entity;
    let payment = data.payload.payment.entity;
    let orderId = order.receipt;
    // console.log("orderId:"+orderId);
    
    console.log("Order paid function starts");
    
    try{
        console.log("Order paid function starts");
        if(!order)
        {
            console.log("order null");
            throw {message:"order null"};
        }
        
        order.clumsy_order_id = orderId;
        let transaction = new RazorpayTransactions({order:order,payment:payment});
        transaction.save();

        let orderDetails =  await Orders.findById(orderId);
        orderDetails.status = "paid-fully";
        await orderDetails.save();
        if(!orderDetails)
        {
            console.log("orderDetails(DB) null");
            throw {message:"order not found in the database"};
        }
        
        if(orderDetails.order_type == "tickets"){
            orderDetails = orderDetails.toObject();
            orderDetails.transaction = transaction._id;
            console.log("handle Tickets Start");
        // console.log(orderDetails);
            let status = await handleTicketBooking(orderDetails,transaction._id);
            if(status)
            {
                transaction.action_status = {"status":"success","booking_id":status,"data":orderDetails};
                console.log("Successfully created the booking");
                let wallet  = await Wallets.getUserWallet(orderDetails.data.host_id);
                let transactionData = {
                    type:"event_booking",
                    event_id: orderDetails.data.event_id,
                    boooking_id:status,
                };
                let walletTransaction = new Transactions({amount:payment.amount,data:transactionData,credit:true});
                await walletTransaction.save();
                await Wallets.addTransactionToWallet(wallet._id,walletTransaction._id);
            }
            else{
                transaction.action_status = {"status":"falied","data":orderDetails};
                initiateRefund(payment,orderDetails);
            }
            await transaction.save();

            // console.log("Done booking");
        }
        if(orderDetails.order_type == "advertisement"){
            orderDetails = orderDetails.toObject();
            orderDetails.transaction = transaction._id;
            let status = await handleAdvertisementBooking(orderDetails,transaction._id);
            if(status)
            {
                transaction.action_status = {"status":"success","booking_id":status,"data":orderDetails};
                console.log("Successfully created the Advertisement");
            }
            else{
                transaction.action_status = {"status":"falied","data":orderDetails};
                initiateRefund(payment,orderDetails);
            }
            await transaction.save();

            // console.log("Done booking");
        }
        else{
            console.log("unknown order type: ");
            throw {message:"Unkown order type"};
        }
    }
    catch(err){
        return false;
    }
}

/*

CART => order details structure{
    order_type:"tickets"
    tickets:[{quantity,category_ticket}],
    total_amount,
    user_id,
    host_id,
    event_id,
}

order details structure{
    order_type:"advertisement"
    event_id:
    total_amount,
*/

let handleTicketBooking = async function(orderDetails,transactionId){

    //initiate an atomic transaction!
    let tickets = orderDetails.data.tickets;
    let total = orderDetails.total_amount;
    let forBookings=[];
    console.log("handle Tickets Start2");
    // const session = await mongoose.startSession();
    console.log("ticketsclumsy");
            console.log(tickets);
    try{
        // session.startTransaction(); 
        for(var i =0; i <tickets.length; i++)
        {
            let ticket=tickets[i];
            console.log("ticketclu");
            // console.log(ticket);
            if(await CategoryTickets.exists({_id:ticket.category_ticket._id}))
            {
                ticket.quantity = Math.abs(Number.parseInt(ticket.quantity));
                let t = await CategoryTickets.findById(ticket.category_ticket._id);
                if(!t){
                    console.log("Ticket not found for ticket Id:"+ticket.category_ticket._id);
                    throw {message:"Ticket not found in the database "};
                }
                if(t.supply!=-1)
                {
                    if(t.total_available >= ticket.quantity)
                    {
                        t.total_available -= ticket.quantity;
                        await t.save();
                    }
                    else{
                        throw {message:"Ticket Quantity not available for Ticket Id:"+ticket.category_ticket._id};
                    }
                }
                let category = await PhaseCategories.findOne({tickets:ticket.category_ticket._id});
                if(!category){
                    console.log("Category not found for ticket Id:"+ticket.category_ticket._id);
                    throw {message:"Category not found in the database "};
                }
                let phase = await EventPhases.findOne({categories:category._id});
                if(!phase){
                    console.log("Phase not found for Category Id:"+category._id);
                    throw {message:"Phase not found in the database "};
                }
                let ticketDocument = new Tickets({count:ticket.quantity,event:orderDetails.data.eventId,phase:phase.name,category:category.name,ticket:t.toObject(),name:t.name});
                await ticketDocument.save();
                forBookings.push(ticketDocument._id);
            }
            else{
                console.log("ticket id not present:"+ticket.category_ticket._id);
                throw {message:"Ticket Id not Present in the database "};
            }
        } 
        // console.log(orderDetails);

        if(!(orderDetails.data.user_id && orderDetails.data.host_id && orderDetails.data.event_id))
        {
            
            throw {message:"Null user, host or event, Sorry... "};
        }
        console.log("creating booking item in table");
        let booking = new Bookings({
            user:orderDetails.data.user_id,
            host:orderDetails.data.host_id,
            event:orderDetails.data.event_id,
            tickets:forBookings,
            booking_status:"booked",
            transaction:transactionId
        });

        await booking.save();
        console.log("successfully saved Booking: "+booking._id);
        // console.log("handling tickets, creating Booking!");
        // session.commitTransaction();
        return booking._id;
    
    }
    catch(err){
        // revertTicketBooking(forBookings);
        console.log(err);
        console.log("error!! in booking!");
        // session.abortTransaction();

        return false;
    }
}

let handleAdvertisementBooking = async function(orderDetails,transactionId){

    //initiate an atomic transaction!
    let total = orderDetails.data.total_amount;
    let eventId = orderDetails.data.event_id;
    const session = await mongoose.startSession();

    try{
        session.startTransaction();
        // console.log(orderDetails);

        if(!(total && eventId))
        {
            throw {message:"Insufficient Information!"};
        }

        let event = await Events.findById(eventId);
        if(!event)
        {
            throw {message:"Event Not Found!"};
        }

        let advertisement = new Ads({
            event:eventId,
            ending_timestamp: event.event_timestamp,
            enabled:true,
        });

        await advertisement.save();
        event.advertisement = advertisement._id;
        event.save();

        console.log("successfully saved Advertisement: "+advertisement._id);
        session.commitTransaction();
        return advertisement._id;
    
    }
    catch(err){
        // revertTicketBooking(forBookings);
        console.log(err);
        session.abortTransaction();
        console.log("error!! in booking!");
        return false;
    }
}

function initiateRefund(payment,orderDetails){
    console.log("initiating refund");
}
module.exports=router;
