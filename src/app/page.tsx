"use client";
import Cuadro from "@/components/cuadroitem";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const [productos, setProductos] = useState([
    { img: "assets/hamburguesas/INICIOHAMBUR3.JPG" },
  ]);

  useEffect(() => {}, []);

  return (
    <div>
      <Header />
      {productos?.map((i, index) => {
        return <Cuadro cuadrito={i.img} key={index} />;
      })}
      <Footer />
    </div>
  );
}
