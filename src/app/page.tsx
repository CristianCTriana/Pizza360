"use client";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Footer from "@/components/footer";
import { Button } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [menu, setMenu] = useState(0);

  const menuList = [
    { img: "", name: "Menu 1" },
    { img: "", name: "Menu 2" },
    { img: "", name: "Menu 3" },
    { img: "", name: "Menu 4" },
    { img: "", name: "Menu 5" },
    { img: "", name: "Menu 6" },
  ];

  const hambs = [
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
    {
      name: "Nombre",
      description:
        "Descripción ............................................................ ............................................................ ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
    {
      name: "Nombre",
      description:
        "Descripción ............................................................ ............................................................ ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
  ];

  const hd = [
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
  ];

  const salchipapas = [
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
  ];

  const platosEspeciales = [
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
  ];

  const bebidas = [
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
  ];

  const adiciones = [
    {
      name: "Nombre",
      description:
        "Descripción   ............................................................ ............................................................",
      img: "",
      cost: 0,
    },
  ];

  const getComponentMenu = () => {
    switch (menu) {
      case 1:
        return <Menu setMenu={setMenu} items={hambs} />;
      case 2:
        return <Menu setMenu={setMenu} items={hd} />;
      case 3:
        return <Menu setMenu={setMenu} items={salchipapas} />;
      case 4:
        return <Menu setMenu={setMenu} items={platosEspeciales} />;
      case 5:
        return <Menu setMenu={setMenu} items={bebidas} />;
      case 6:
        return <Menu setMenu={setMenu} items={adiciones} />;
      default:
        /*return (
          <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
            {menuList.map((m, index) => {
              return (
                <div className="w-full text-center" key={index}>
                  <Button
                    onClick={() => {
                      setMenu(index + 1);
                    }}
                    variant="outlined"
                  >
                    {m.name}
                  </Button>
                </div>
              );
            })}
          </main>
        );*/
        return (
          <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
            {menuList.map((m, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setMenu(index + 1);
                  }}
                  className="w-2/5 border flex flex-wrap justify-center border-[#1976d2]"
                >
                  <Image className="w-[95%] h-40" src="" alt="" />
                  <p className="w-full text-center text-[#1976d2]">{m.name}</p>
                </div>
              );
            })}
          </main>
        );
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      {getComponentMenu()}
      <div className="bottom-0 relative">
        <Footer />
      </div>
    </div>
  );
}
