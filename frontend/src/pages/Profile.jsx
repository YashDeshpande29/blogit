import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProfilePosts from '../components/ProfilePosts';
import { UserContext } from '../context/UserContext';
import { URL, PF } from '../url';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Profile = () => {
   const Cloudinary_preset="ml_default"
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const doDelete = async () => {
    try {
      await axios.delete(URL + "/api/users/user/" + id);
      await axios.get(URL + '/api/auth/logout');
      navigate('/login');
    } catch (err) {
      console.log(err);
      setError("Failed to delete profile.");
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get(URL + '/api/users/user/' + id);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password); // Consider removing this for security
    } catch (err) {
      console.log(err);
      setError("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const newUser = {
      username,
      email,
      password,
    };

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", Cloudinary_preset); // Replace with your Cloudinary upload preset

      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dv49gi2o7/image/upload", // Replace with your Cloudinary cloud name
          data
        );
        newUser.profilePic = uploadRes.data.secure_url;
      } catch (err) {
        console.log(err);
        setError("Failed to upload image.");
        return;
      }
    }

    try {
      const res = await axios.put(URL + "/api/users/user/" + id, newUser);
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000); // Hide success message after 3 seconds
      fetchUserData();
    } catch (err) {
      console.log(err);
      setError("Failed to update profile.");
    }
  };

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/all/" + id);
      setMyPosts(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch posts.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  return (
    <div>
      <Navbar />
      {confirmDelete ? (
        <div className='h-screen flex justify-center items-center'>
          <div className='flex flex-col px-20 py-10 md:px-40 md:py-20 border-2 border-solid border-gray-500'>
            <h3 className='text-lg font-bold'>Are you sure?</h3>
            <div className='flex justify-center items-center space-x-4'>
              <button onClick={doDelete} className='bg-black px-4 py-2 text-white'>Yes</button>
              <button onClick={cancelDelete} className='bg-white px-4 py-2 text-black border-2 border-solid border-gray-500'>No</button>
            </div>
          </div>
        </div>
      ) : (
        <div className='px-6 md:px-[200px] mt-8 flex md:flex-row flex-col-reverse'>
          <div className='flex flex-col md:w-[70%]'>
            <h1 className='text-xl font-bold mt-16 md:mt-0'>Your Posts:</h1>
            {!loader ? myPosts.map((post) => (
              <Link key={post._id} to={user ? `/posts/post/${post._id}` : "/login"}>
                <ProfilePosts post={post} />
              </Link>
            )) : (
              <div className='h-screen flex justify-center items-center'>
                <Loader />
              </div>
            )}
          </div>

          <div className='flex flex-col space-y-4 md:w-[30%] md:mb-16 md:items-end'>
            <div className='flex flex-col'>
              <h1 className='font-bold text-2xl mb-6'>Your Profile:</h1>
              <img src={user.profilePic ? PF + user.profilePic : ""} alt="" className="h-[200px] w-[200px] bg-gray-600 rounded-lg mb-4" />
              <div className='flex flex-col w-full space-y-4'>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" placeholder='upload image' />
                <input onChange={(e) => setUsername(e.target.value)} value={username} className='outline-none px-4 py-2 text-gray-500' type='text' placeholder={user.username} />
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='outline-none px-4 py-2 text-gray-500' type='text' placeholder={user.email} />
                <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} className='text-gray-500 outline-none px-4 py-2' placeholder="Password" />
              </div>
              <div className='flex items-center space-x-4 mt-8'>
                <button onClick={handleUpdate} className='text-white font-semibold bg-black px-4 py-2 hover:text-black hover:bg-gray-400'>Update details</button>
                <button className='text-white font-semibold bg-black px-4 py-2 hover:text-black hover:bg-gray-400' onClick={handleDelete}>Delete Profile</button>
                {updated && <div className='text-md font-bold text-green-500'>Details updated successfully</div>}
                {error && <div className='text-md font-bold text-red-500'>{error}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;