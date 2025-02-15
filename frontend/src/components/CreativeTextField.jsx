import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

import { FaSmile, FaImage, FaPaperclip } from "react-icons/fa";

const CreativeTextField = ({ value, onChange }) => {
  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      {/* Rich Text Editor */}
      <ReactQuill
        value={value} // Use the value prop
        onChange={onChange} // Call the onChange prop
        modules={modules}
        formats={formats}
        placeholder="Enter post description..."
        className="mb-4"
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        {/* Image Upload Button */}
        <label
          htmlFor="image-upload"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <FaImage className="w-5 h-5 text-gray-600" />
        </label>
        <input
          id="image-upload"
          type="file"
          className="hidden"
        />

        {/* File Attachment Button */}
        <label
          htmlFor="file-attach"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <FaPaperclip className="w-5 h-5 text-gray-600" />
        </label>
        <input
          id="file-attach"
          type="file"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CreativeTextField;
