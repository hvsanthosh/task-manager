import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  // const [tasks,setTasks]=useState([])

  const getAllTasks = async () => {
    try {
      const data = await axios.get("/api/v1/tasks");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllTasks();
  }, []);
  return (
    <>
      <div>Home</div>
    </>
  );
};

export default Home;
