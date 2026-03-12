"use client";
import Cuadro from "@/components/cuadroitem";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const [item, setItem] = useState([
    {
      name: "name1",
      cost: 10,
      img: "assets/hamburguesas/sinfondo.jpg",
      time: 0,
      type: "",
    },
    {
      name: "name2",
      cost: 5,
      img: "assets/hamburguesas/costeña.jpeg",
      time: 0,
      type: "",
    },
    {
      name: "name3",
      cost: 3,
      img: "assets/hamburguesas/lomo.jpeg",
      time: 0,
      type: "",
    },
    {
      name: "name4",
      cost: 7,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name5",
      cost: 1,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name1",
      cost: 10,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name2",
      cost: 5,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name3",
      cost: 3,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name4",
      cost: 7,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name5",
      cost: 1,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name1",
      cost: 10,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name2",
      cost: 5,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name3",
      cost: 3,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name4",
      cost: 7,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name5",
      cost: 1,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name1",
      cost: 10,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name2",
      cost: 5,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name3",
      cost: 3,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name4",
      cost: 7,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name5",
      cost: 1,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name1",
      cost: 10,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name2",
      cost: 5,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name3",
      cost: 3,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name4",
      cost: 7,
      img: "",
      time: 0,
      type: "",
    },
    {
      name: "name5",
      cost: 1,
      img: "",
      time: 0,
      type: "",
    },
  ]);

  useEffect(() => {}, []);

  return (
    <div>
      <Header />
      {item?.map((i, index) => {
        return <Cuadro cuadrito={i.img} key={index} />;
      })}
      <Footer />
    </div>
  );
}
