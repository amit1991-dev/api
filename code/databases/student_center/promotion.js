const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.ObjectId;
const { Schema } = mongoose;

const PromotionalBannerSchema = new Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    banner: { 
        type: String, 
        required: true 
    },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
});

const SelectedBannerSchema = new Schema({
   
    banners:{
        type: [ObjectId],
        default:[],
        required:true,
        ref:"promotionalBanners",
    },
    // banners:{
    //     type: [{
    //         type: ObjectId,
    //         ref:"promotionalBanners",
    //     }],
    //     default:[],
    //     required:true,
    // },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
 
});


// const PromotionalBatchesSchema = new Schema(
//     {
//     name: { 
//         type: String, 
//         required: true 
//     },
//     description: {
//          type: String, 
//          required: true 
//         },
//     banner: { 
//         type: String, 
//         required: true 
//     },
//     permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
// });

// const SelectedBatchesSchema = new Schema({
   
//     banners:{
//         type: [ObjectId],
//         default:[],
//         required:true,
//         ref:"promotionalBatches",
//     },
//     // banners:{
//     //     type: [{
//     //         type: ObjectId,
//     //         ref:"promotionalBanners",
//     //     }],
//     //     default:[],
//     //     required:true,
//     // },
//     permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
 
// });

const PromotionalBatchSchema = new Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    image: { 
        type: String, 
        required: true 
    },
    class: { 
        type: String, 
        required: true 
    },
    stream: {
         type: String, 
         required: true 
        },
    centre: { 
        type: String, 
    },
    total_test: { 
        type: String, 
    },
    total_module: {
         type: String, 
        },
    total_lecture: { 
        type: String, 
    },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
});

const SelectedBatchSchema = new Schema({
   
    batches:{
        type: [ObjectId],
        default:[],
        required:true,
        ref:"promotionalBatches",
    },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
 
});



// const PromotionalBatchSchema = new Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     banner: { type: String, required: true },
//     isBannerActive: { type: Boolean, default: true },
//     position: { type: Number, required: true }
// });

// const PromotionalCourseSchema = new Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     banner: { type: String, required: true },
//     isBannerActive: { type: Boolean, default: true },
//     position: { type: Number, required: true }
// });

// const PromotionalOurProgramSchema = new Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     banner: { type: String, required: true },
//     isBannerActive: { type: Boolean, default: true },
//     position: { type: Number, required: true }
// });

const PromotionalCourseSchema = new Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    image: { 
        type: String, 
        required: true 
    },
    class: { 
        type: String, 
        required: true 
    },
    stream: {
         type: String, 
         required: true 
        },
    sip: { 
        type: String, 
    },
    school: { 
        type: String, 
    },
    centre: { 
        type: String, 
    },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
});

const SelectedCourseSchema = new Schema({
   
    courses:{
        type: [ObjectId],
        default:[],
        required:true,
        ref:"promotionalCourses",
    },
    // banners:{
    //     type: [{
    //         type: ObjectId,
    //         ref:"promotionalBanners",
    //     }],
    //     default:[],
    //     required:true,
    // },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
 
});

const PromotionalProgramSchema = new Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    image: { 
        type: String, 
        required: true 
    },
    stream: { 
        type: String, 
        required: true 
    },
    centre: {
         type: String, 
         },
    sip: { 
        type: String, 
        },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
});

const SelectedProgramSchema = new Schema({
   
    programs:{
        type: [ObjectId],
        default:[],
        required:true,
        ref:"promotionalPrograms",  
    },
    // banners:{
    //     type: [{
    //         type: ObjectId,
    //         ref:"promotionalBanners",
    //     }],
    //     default:[],
    //     required:true,
    // },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
 
});

const PromotionalTestimonialSchema = new Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    image: { 
        type: String, 
        required: true 
    },
    rank: { 
        type: String, 
        required: true 
    },
    stream: { 
        type: String, 
        required: true 
    },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
});

const SelectedTestimonialSchema = new Schema({
   
    testimonials:{
        type: [ObjectId],
        default:[],
        required:true,
        ref:"promotionalTestimonials",
    },
    // banners:{
    //     type: [{
    //         type: ObjectId,
    //         ref:"promotionalBanners",
    //     }],
    //     default:[],
    //     required:true,
    // },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
 
});

const PromotionalTeamSchema = new Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    image: { 
        type: String, 
        required: true 
    },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
});

const SelectedTeamSchema = new Schema({
   
    teams:{
        type: [ObjectId],
        default:[],
        required:true,
        ref:"promotionalTeams", 
    },
    // banners:{
    //     type: [{
    //         type: ObjectId,
    //         ref:"promotionalBanners",
    //     }],
    //     default:[],
    //     required:true,
    // },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
 
});

const PromotionalGallerySchema = new Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    image: { 
        type: String, 
        required: true 
    },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
});

const SelectedGallerySchema = new Schema(
    {
   
    galleries:{
        type: [ObjectId],
        default:[],
        required:true,
        ref:"promotionalGalleries",
    },
    // banners:{
    //     type: [{
    //         type: ObjectId,
    //         ref:"promotionalBanners",
    //     }],
    //     default:[],
    //     required:true,
    // },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
 
  },
 { strict: false,minimize:false,timestamp:true }
);


const PromotionalTestSeriesSchema = new Schema(
    {
      name: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    image: { 
        type: String, 
        required: true 
    },
    class: { 
        type: String, 
        required: true 
    },
    stream: {
         type: String, 
         required: true 
        },
    centre: { 
        type: String, 
    },
    total_test: {
        type: String, 
       },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
    
   });
  
  const SelectedTestSeriesSchema = new Schema(
    {
   
    testseriess:{
        type: [ObjectId],
        default:[],
        required:true,
        ref:"promotionalTestSeriess",
    },
    // banners:{
    //     type: [{
    //         type: ObjectId,
    //         ref:"promotionalBanners",
    //     }],
    //     default:[],
    //     required:true,
    // },
    permission_id:{type:ObjectId,default:new mongoose.Types.ObjectId(),required:true},
  
  },
  { strict: false,minimize:false,timestamp:true }
  );
  




let PromotionalBanners = mongoose.model("promotionalBanners", PromotionalBannerSchema);
let SelectedBanners = mongoose.model('selectedBanners', SelectedBannerSchema);
let PromotionalBatches = mongoose.model("promotionalBatches", PromotionalBatchSchema);
let SelectedBatches = mongoose.model('selectedBatches', SelectedBatchSchema);
let PromotionalCourses = mongoose.model("promotionalCourses", PromotionalCourseSchema);
let SelectedCourses = mongoose.model('selectedCourses', SelectedCourseSchema);
let PromotionalPrograms = mongoose.model("promotionalPrograms", PromotionalProgramSchema);
let SelectedPrograms = mongoose.model('selectedPrograms', SelectedProgramSchema);
let PromotionalTestimonials = mongoose.model("promotionalTestimonials", PromotionalTestimonialSchema);
let SelectedTestimonials = mongoose.model('selectedTestimonials', SelectedTestimonialSchema);
let PromotionalTeams = mongoose.model("promotionalTeams", PromotionalTeamSchema);
let SelectedTeams = mongoose.model('selectedTeams', SelectedTeamSchema);
let PromotionalGalleries = mongoose.model("promotionalGalleries", PromotionalGallerySchema);
let SelectedGalleries = mongoose.model('selectedGalleries', SelectedGallerySchema);
let PromotionalTestSeriess = mongoose.model("promotionalTestSeriess", PromotionalTestSeriesSchema);
let SelectedTestSeriess = mongoose.model('selectedTestSeriess', SelectedTestSeriesSchema);
// let PromotionalCourses = mongoose.model("promotionalCourses", PromotionalCourseSchema);
// let PromotionalOurPrograms = mongoose.model("promotionalOurPrograms", PromotionalOurProgramSchema);

// module.exports = { PromotionalBanners, PromotionalBatches, PromotionalCourses, PromotionalOurPrograms };
module.exports = { PromotionalBanners , SelectedBanners , PromotionalBatches , SelectedBatches , PromotionalCourses , SelectedCourses , PromotionalPrograms , SelectedPrograms , PromotionalTestimonials , SelectedTestimonials , PromotionalTeams , SelectedTeams , PromotionalGalleries , SelectedGalleries , PromotionalTestSeriess , SelectedTestSeriess};