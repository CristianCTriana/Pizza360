import { Button } from "@mui/material";
import { constants } from "fs/promises";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Menu({ setMenu, items }: { setMenu: any; items: any }) {
  const [itemParents, setItemParents] = useState([]);
  const [types, setTypes] = useState([]);
  const [data, setData] = useState([]);

  function listItems() {
    const parentsList: any = items.products.filter((i: any) => {
      if (!i.description && i.price) return i;
    });

    const typesList: any = items.products.filter((i: any) => {
      if (i.description && !i.price) return i;
    });

    const list: any = items.products.filter((i: any) => {
      if (i.description && i.price) return i;
    });

    const exceptionsList: any = items.products.filter((i: any) => {
      if (!i.description && !i.price) return i;
    });

    const togetherList: any = [...typesList, ...exceptionsList];

    setItemParents(parentsList);
    setTypes(togetherList);
    setData(list);
  }

  function getTitles() {
    switch (items.type) {
      case "Pastas":
        return { title1: "Tamaños de Lasagna", title2: "Sabor de Lasagna" };
      case "Pizzas":
        return { title1: "Tamaños de Pizzas", title2: "Sabor de Pizzas" };
      case "Jugos Naturales":
        return { title1: "Base del jugo", title2: "Sabor de Jugos" };
      default:
        return { title1: "", title2: "" };
    }
  }

  useEffect(() => {
    listItems();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8 px-6">
      <Button
        className="mb-4"
        variant="outlined"
        onClick={() => {
          setMenu(0);
        }}
      >
        Back
      </Button>
      {itemParents.length > 0 && (
        <>
          <h2 className="w-full text-center text-3xl font-bold">
            {getTitles().title1}
          </h2>
          <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
            {itemParents?.map((i: any, index: any) => {
              return (
                <div
                  className="w-2/5 flex flex-wrap justify-center border border-[#1976d2] py-4"
                  key={index}
                >
                  <Image className="h-40 w-40" src={""} alt="" />
                  <h3 className="w-full text-center font-bold text-xl mt-4">
                    {i.name}
                  </h3>
                  <p className="w-full text-center text-sm">{i.description}</p>
                  {i.stock ? (
                    <div className="flex place-self-center font-bold mt-4">{`$${i.price.toFixed(
                      2
                    )}`}</div>
                  ) : (
                    <div className="flex place-self-center font-bold mt-4">
                      Agotado
                    </div>
                  )}
                </div>
              );
            })}
          </main>
        </>
      )}
      {types.length > 0 && (
        <>
          <h2 className="w-full text-center text-3xl font-bold">
            {getTitles().title2}
          </h2>
          <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
            {types?.map((i: any, index: any) => {
              return (
                <div
                  className="w-2/5 flex flex-wrap justify-center border border-[#1976d2] py-4"
                  key={index}
                >
                  <Image className="h-40 w-40" src={""} alt="" />
                  <h3 className="w-full text-center font-bold text-xl mt-4">
                    {i.name}
                  </h3>
                  <p className="w-full text-center text-sm">{i.description}</p>
                </div>
              );
            })}
          </main>
        </>
      )}
      {data.map((i: any, index: any) => {
        return (
          <div
            className="w-full flex flex-wrap justify-center border border-[#1976d2] py-4"
            key={index}
          >
            <Image className="h-40 w-40" src={""} alt="" />
            <h3 className="w-full text-center font-bold text-xl mt-4">
              {i.name}
            </h3>
            <p className="w-full text-center text-sm">{i.description}</p>
            {i.stock ? (
              <div className="flex place-self-center font-bold mt-4">{`$${i.price.toFixed(
                2
              )}`}</div>
            ) : (
              <div className="flex place-self-center font-bold mt-4">
                Agotado
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
