import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { ImCross } from "react-icons/im";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreativeTextField from "../components/CreativeTextField";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);

  const ml_default = "ml_default"; // Replace with your Cloudinary upload preset

  const handleCreatePost = async (e) => {
    e.preventDefault();

    // Create the new post object
    const newPost = {
      title: title,
      desc: desc,
      username: user.username,
      userId: user._id,
      categories: cats,
    };

    
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", ml_default); // Replace with your Cloudinary upload preset

      try {
        // Upload the image to Cloudinary
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dv49gi2o7/image/upload", // Replace with your Cloudinary cloud name
          data
        );

        // Add the Cloudinary image URL to the new post object
        newPost.photo = uploadRes.data.secure_url;
      } catch (err) {
        console.log(err);
        return;
      }
    }

    // Send the new post data to the backend
    try {
      const res = await axios.post(URL + "/api/posts/create", newPost);
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  const addCats = () => {
    let updatedCats = [...cats];
    updatedCats.push(cat);
    setCat("");
    setCats(updatedCats);
  };

  const removeCat = (i) => {
    let newCats = [...cats];
    newCats.splice(i, 1); // Fix: Add the second argument to splice
    setCats(newCats);
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8">
        <h1 className="font-bold md:text-2xl text-xl mb-4">Create a post</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8">
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Enter post Title"
            type="text"
            className="px-4 py-2 outline-none"
          />
          <input
            onChange={(e) => setFile(e.target.files[0])}
            placeholder="Enter image"
            type="file"
            className="px-4"
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-4 md:space-x-8">
              <input
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                placeholder="Enter post category"
                type="text"
                className="px-4 py-2 outline-none"
              />
              <div
                className="bg-black text-white px-4 py-2 font-semibold cursor-pointer"
                onClick={addCats}
              >
                Add
              </div>
            </div>
            <div className="flex px-4 mt-3">
              {cats.map((c, i) => (
                <div key={i} className="flex">
                  <div className="flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md">
                    <p>{c}</p>
                    <p
                      className="text-white bg-black rounded-full cursor-pointer p-1 text-sm"
                      onClick={() => removeCat(i)}
                    >
                      <ImCross />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <textarea
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            placeholder="Enter post description"
            className="px-4 py-2 outline-none"
          />

          <button
            className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg"
            onClick={handleCreatePost}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;