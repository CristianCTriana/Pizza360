"use client";
import Header from "@/components/Header";
import Hamb from "@/components/Menu/Hamb";
import Footer from "@/components/footer";
import { Button } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [menu, setMenu] = useState(0);

  const getComponentMenu = () => {
    switch (menu) {
      case 1:
        return <Hamb setMenu={setMenu} />;
      default:
        return (
          <main className="flex w-screen justify-center flex-wrap pb-4 pt-4">
            <Button
              onClick={() => {
                setMenu(1);
              }}
              variant="outlined"
            >
              Outlined
            </Button>
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
