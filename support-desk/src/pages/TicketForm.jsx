import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const TicketForm = () => {
  const [file, setFile] = useState(null);
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      priority: "",
      category: "",
      attachment: null,
      email: "",
      phone: "",
      startDate: "",
      dueDate: "",
      isUrgent: false,
      isAccepted: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      priority: Yup.string().required("Priority is required"),
      category: Yup.string().required("Category is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      phone: Yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required("Phone number is required"),
      startDate: Yup.date().required("Start date is required"),
      dueDate: Yup.date().required("Due date is required"),
      isUrgent: Yup.boolean().required("Urgency status is required"),
      isAccepted: Yup.boolean().required("Acceptance is required"),
    }),
    onSubmit: async (values) => {
      try {
        const docRef = await addDoc(collection(db, "tickets"), {
          title: values.title,
          description: values.description,
          priority: values.priority,
          category: values.category,
          attachment: file ? file.name : null,
          email: values.email,
          phone: values.phone,
          startDate: values.startDate,
          dueDate: values.dueDate,
          isUrgent: values.isUrgent,
          isAccepted: values.isAccepted,
          timestamp: Timestamp.now(), 
        });

        console.log("Ticket added with ID: ", docRef.id);
        alert("Ticket created successfully!");
      } catch (e) {
        console.error("Error adding document: ", e);
        alert("Failed to create ticket.");
      }
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-white to-violet-100 rounded-lg shadow-md w-96 mx-auto h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Create a Ticket</h2>

      <form onSubmit={formik.handleSubmit}>
        {/* Title Field */}
        <div className="mb-4">
          <label htmlFor="title" className="block">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full p-2 border rounded"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title ? <div className="text-red-500">{formik.errors.title}</div> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="w-full p-2 border rounded"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description ? <div className="text-red-500">{formik.errors.description}</div> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="priority" className="block">Priority</label>
          <select
            id="priority"
            name="priority"
            className="w-full p-2 border rounded"
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {formik.touched.priority && formik.errors.priority ? <div className="text-red-500">{formik.errors.priority}</div> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block">Category</label>
          <select
            id="category"
            name="category"
            className="w-full p-2 border rounded"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Category</option>
            <option value="software">Software</option>
            <option value="hardware">Hardware</option>
            <option value="network">Network</option>
          </select>
          {formik.touched.category && formik.errors.category ? <div className="text-red-500">{formik.errors.category}</div> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="attachment" className="block">Attachment</label>
          <input
            id="attachment"
            name="attachment"
            type="file"
            className="w-full p-2 border rounded"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full p-2 border rounded"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block">Phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            className="w-full p-2 border rounded"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone ? <div className="text-red-500">{formik.errors.phone}</div> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="startDate" className="block">Start Date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            className="w-full p-2 border rounded"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.startDate && formik.errors.startDate ? <div className="text-red-500">{formik.errors.startDate}</div> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="dueDate" className="block">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="w-full p-2 border rounded"
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.dueDate && formik.errors.dueDate ? <div className="text-red-500">{formik.errors.dueDate}</div> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="isUrgent" className="block">Urgent</label>
          <input
            id="isUrgent"
            name="isUrgent"
            type="checkbox"
            className="mr-2"
            checked={formik.values.isUrgent}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span>Is this an urgent issue?</span>
        </div>

        <div className="mb-4">
          <label className="block">Accept Terms & Conditions</label>
          <input
            type="radio"
            name="isAccepted"
            value="true"
            checked={formik.values.isAccepted === true}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />{" "}
          Accept
          <input
            type="radio"
            name="isAccepted"
            value="false"
            checked={formik.values.isAccepted === false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />{" "}
          Decline
          {formik.touched.isAccepted && formik.errors.isAccepted ? (
            <div className="text-red-500">{formik.errors.isAccepted}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <button type="submit" className="bg-violet-500 text-white p-2 rounded w-full">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
