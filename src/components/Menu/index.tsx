import { Button } from "@mui/material";
import Image from "next/image";

export default function Menu({ setMenu, items }: { setMenu: any; items: any }) {
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
      {items.map((i: any, index: any) => {
        return (
          <div
            className="w-full flex flex-wrap justify-center border border-[#1976d2] py-4"
            key={index}
          >
            <Image className="h-40 w-40" src={i.img} alt="" />
            <h3 className="w-full text-center font-bold text-xl mt-4">
              {i.name}
            </h3>
            <p className="w-full text-center text-sm">{i.description}</p>
            <div className="flex place-self-center font-bold mt-4">{`$${i.cost.toFixed(
              2
            )}`}</div>
          </div>
        );
      })}
    </div>
  );
}
