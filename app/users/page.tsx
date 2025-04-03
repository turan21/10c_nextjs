"use client";
import { useEffect, useState } from "react";
import React from "react";
import User from "../models/user";
import UserCard from "../components/user_card";

interface ApiResponse {
  data: User[];
}

const UsersPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://reqres.in/api/users/")
      .then((response) => response.json())
      .then((response: ApiResponse) => {
        setData(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        data.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            email={user.email}
            first_name={user.first_name}
            last_name={user.last_name}
            avatar={user.avatar}
          />
        ))
      )}
    </div>
  );
};

export default UsersPage;
