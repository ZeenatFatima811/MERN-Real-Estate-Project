import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { supabase } from "../services/supabase";
import { updateUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [formData, setFormData] =useState({});

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
    dispatch(updateUserSuccess(updatedUser));

    console.log("Public URL:", urlData.publicUrl);

    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: urlData.publicUrl }),
    });
    const resdata = await res.json();
    dispatch(updateUserSuccess(resdata));
    // Redux ya local state me update karo
    // dispatch(updateUserAvatar(publicURL));
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg "
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg "
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5 ">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
