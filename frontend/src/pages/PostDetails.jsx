import Navbar from '../components/Navbar';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';
import { UserContext } from '../context/UserContext';
import Loader from '../components/Loader';
import { MdDelete } from 'react-icons/md';
import { BiEdit } from 'react-icons/bi';

const PostDetails = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { pathname } = useLocation();
  const id = pathname.split('/')[3];

  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [categories, setCategories] = useState([]);
  const [updatedAt, setUpdatedAt] = useState('');
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    setConfirmDelete(true);
  };
  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const postDelete = async () => {
    try {
      await axios.delete(`${URL}/api/posts/post/${postId}`);
      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${URL}/api/comments/comment/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const fetchComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/comments/post/${id}`);
      setCommentList(res.data);
      setLoader(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setLoader(false);
    }
  };

  const fetchPostData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/posts/post/${id}`);
      setPostId(res.data._id);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setPhoto(res.data.photo);
      setUsername(res.data.username);
      setUserId(res.data.userId);
      setCategories(res.data.categories);
      setUpdatedAt(res.data.updatedAt);
      setLoader(false);
    } catch (err) {
      console.error('Error fetching post data:', err);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  useEffect(() => {
    fetchPostData();
  }, [id]);

  const handleComment = () => {
    if (!user) {
      alert('You need to be logged in to comment!');
      return;
    }

    axios
      .post(`${URL}/api/comments/create`, {
        comment,
        author: user.username,
        postId: id,
        userId: user._id,
      })
      .then(() => {
        setComment('');
        fetchComments();
      })
      .catch((err) => {
        console.error('Error adding comment:', err);
      });
  };

  const handleEdit = () => {
    navigate(`/edit/${postId}`);
  };

  return (
    <>
      <Navbar />
      {confirmDelete ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col px-20 py-10 border-2 border-gray-500 border-solid md:px-40 md:py-20">
            <h3 className="text-lg font-bold">Are you sure?</h3>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={postDelete}
                className="px-4 py-2 text-white bg-black"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-black bg-white border-2 border-gray-500 border-solid"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 md:px-[200px] mt-8">
          <div className="flex flex-col md:flex-row">
            {/* Left side: Image */}
            <div className="md:w-1/2 flex justify-center items-center">
              {!loader ? (
                <img
                  src={photo}
                  alt="Post Image"
                  className="w-full max-h-[500px] object-cover rounded-lg"
                />
              ) : (
                <div className="h-[20vh] flex justify-center items-center">
                  <Loader />
                </div>
              )}
            </div>

            {/* Right side: Post details */}
            <div className="md:w-1/2 md:ml-8 mt-8 md:mt-0">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-black md:text-3xl">
                  {title}
                </h1>
                {user && user._id === userId && username === user.username && (
                  <div className="flex items-center space-x-2">
                    <p
                      className="text-xl cursor-pointer"
                      onClick={handleEdit}
                    >
                      <BiEdit />
                    </p>
                    <p
                      className="text-xl cursor-pointer"
                      onClick={handleDelete}
                    >
                      <MdDelete />
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 md:mt-4">
                <p className="text-sm text-gray-400">@{username}</p>
                <p className="text-sm text-gray-400">
                  {updatedAt.slice(0, 10)} - {updatedAt.slice(11, 16)}
                </p>
              </div>

              <p className="mt-4">{desc}</p>

              <div className="flex items-center mt-8 space-x-4 font-semibold">
                <p>Categories:</p>
                <div className="flex items-center">
                  {!loader
                    ? categories.map((c) => (
                        <p
                          key={c._id}
                          className="mr-4 text-gray-400"
                        >
                          {c}
                        </p>
                      ))
                    : ''}
                </div>
              </div>

              <div className="mt-8">
                <p className="font-semibold">Comments:</p>
                <div>
                  {commentList.map((c) => (
                    <div
                      key={c._id}
                      className="p-4 mt-2 bg-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-600">
                          @{c.author}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <p className="text-gray-500">
                            {c.updatedAt.slice(0, 10)} - {c.updatedAt.slice(11, 16)}
                          </p>
                          {user &&
                            (c.author === user.username ||
                              user._id === c.userId) && (
                              <p
                                className="text-lg cursor-pointer"
                                onClick={() => deleteComment(c._id)}
                              >
                                <MdDelete />
                              </p>
                            )}
                        </div>
                      </div>
                      <p className="mt-2">{c.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex mt-4 md:flex-row">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment"
                  type="text"
                  className="w-full md:w-[90%] outline-none px-4 py-2 rounded-md border border-gray-300"
                />
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 mt-2 md:mt-0 md:ml-4"
                  onClick={handleComment}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetails;
