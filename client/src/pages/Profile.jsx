import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { supabase } from "../services/supabase";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [formData, setFormData] =useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleFileChange = async (e) => { 
    const file = e.target.files[0]; // file input se file le rahi hai
    if (!file) return;

    console.log("File selected:", file); // debugging ke liye

    const fileName = `${currentUser._id}/${file.name}`; // har user ke liye folder
    const { data, error } = await supabase.storage
      .from("avatar") // bucket ka actual naam
      .upload(fileName, file, { upsert: true }); // upload file

    if (error) {
      console.error("Upload error:", error.message);
      return;
    }

    console.log("Upload success:", data); // upload ka response

    // 'data' ki jagah koi aur naam use karen, jaise 'urlData'
    const { data: urlData } = supabase.storage
      .from("avatar")
      .getPublicUrl(fileName);

    const updatedUser = { ...currentUser, avatar: urlData.publicUrl };

    console.log("Public URL:", urlData.publicUrl);

    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: urlData.publicUrl }),
      credentials: "include",
    });
    const resdata = await res.json();
    dispatch(updateUserSuccess(resdata));
    // Redux ya local state me update karo
    // dispatch(updateUserAvatar(publicURL));
  };

  const handleChange=(e)=>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res= await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message)); 
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={currentUser.avatar}
          alt="profile"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg "
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="border p-3 rounded-lg "
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="border p-3 rounded-lg "
        />
        <button disabled ={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading? "Loading" : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5 ">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess? "User is updated successfully": ""}</p>
    </div>
  );
}
