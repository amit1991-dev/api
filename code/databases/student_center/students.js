const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const StudentSch = new mongoose.Schema(
  {
    // address in address table,
    // same as notifications, batches & fees.
    gravity_student: {
      type: Boolean,
      required: true,
      default: false,
    },
    staff: {
      type: ObjectId,
      ref: "staff",
    },
    user: {
      type: ObjectId,
      ref: "users",
    },
    stream: {
      type: ObjectId,
      ref: "streams",
    },
    student_picture: {
      type: String,
    },
    batch: {
      type: ObjectId,
      ref: "batches",
    },
    branch: {
      type: ObjectId,
      ref: "branches",
    },
    name: {
      type: String,
    },
    guardian_name: {
      type: String,
    },
    father_name: {
      type: String,
    },
    mother_name: {
      type: String,
    },
    occupation_of_father: {
      type: String,
    },
    occupation_of_guardian: {
      type: String,
    },
    occupation_of_mother: {
      type: String,
    },
    percentage_of_secondary: { type: String },
    blood_group: { type: String },
    board: { type: String },
    category: { type: String },
    class_number: { type: String },
    how_came_to_know: { type: [String] },
    date_of_birth: { type: String },
    nationality: { type: String },
    email: {
      type: String,
    },
    phone: {
      //mobile student
      type: String,
      required: true,
    },
    mobile_parents: {
      type: String,
    },
    guardian_phone: {
      type: String,
    },
    phone_office: {
      type: String,
    },
    phone_residence: {
      type: String,
    },
    school_name: {
      type: String,
    },
    school_address: {
      type: String,
    },
    math_grades: {
      type: String,
    },
    science_grades: {
      type: String,
    },
    senior_secondary_pcb: {
      type: String,
    },
    senior_secondary_pcm: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    enrollment: {
      type: String,
    },
    permission_id: {
      type: ObjectId,
      default: new mongoose.Types.ObjectId(),
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { strict: false, minimize: false, timestamps: true }
);

module.exports = mongoose.model("students", StudentSch);
