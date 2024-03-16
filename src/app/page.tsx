"use client";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Footer from "@/components/footer";
import { Fab } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [menu, setMenu] = useState(0);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    fetchCSVData();
  }, []);

  function translateStck(str: string) {
    return str === "Sí";
  }

  function fetchCSVData() {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTB3S_Ca7sp00BP6H8fCiPi1S3iwP5129mtQM7pZlBpsGbF7xJ2nI1N-PFjhD68v5n-Gyr--UJRYfp5/pub?output=csv"; // Replace with your Google Sheets CSV file URL
    axios
      .get(csvUrl)
      .then((response) => {
        const parsedCsvData = parseCSV(response.data);
        setCsvData(parsedCsvData);
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
      });
  }

  function parseCSV(csvText: any) {
    const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
    const rowsFil = rows
      .filter((el: any) => {
        if (el !== ",,,") return el;
      })
      .map((el: string) => {
        return el.split(",");
      })
      .map((el: any) => {
        if (el[3] === "") return el[0];
        return el;
      });

    return formatData(rowsFil);
  }

  function formatData(array: any) {
    const data: any = [];
    let aux = -1;
    for (let i = 1; i < array.length; i++) {
      if (typeof array[i] === "string") {
        data.push({ type: array[i], products: [] });
        aux++;
      } else {
        data[aux] = {
          ...data[aux],
          products: [
            ...data[aux].products,
            {
              name: array[i][0],
              description: array[i][1],
              price: parseInt(array[i][2].split(".").join("")),
              stock: translateStck(array[i][3]),
            },
          ],
        };
      }
    }
    return data;
  }

  const getComponentMenu = () => {
    if (menu > 0) {
      return <Menu setMenu={setMenu} items={csvData[menu - 1]} />;
    }

    return (
      <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
        {csvData?.map((m: any, index: number) => {
          return (
            <div
              key={index}
              onClick={() => {
                setMenu(index + 1);
              }}
              className="w-2/5 border flex flex-wrap justify-center border-[#1976d2]"
            >
              <Image className="w-[95%] h-40" src="" alt="" />
              <p className="w-full text-center text-[#1976d2]">{m.type}</p>
            </div>
          );
        })}
      </main>
    );
  };

  if (csvData.length === 0) {
    const skeletonLoading = ["", "", "", "", "", ""];
    return (
      <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
        {skeletonLoading?.map((m: any, index: number) => {
          return (
            <div
              key={index}
              className="w-2/5 border flex flex-wrap justify-center border-[#1976d2]"
            >
              <Skeleton
                sx={{ bgcolor: "grey.900" }}
                variant="rectangular"
                width={250}
                height={150}
                animation="wave"
              />
            </div>
          );
        })}
      </main>
    );
  }
  return (
    <div>
      <div>
        <Header />
      </div>
      <a
        href="https://api.whatsapp.com/send?phone=573177535468&text=%20Hola!%20Quiero%20solicitar%20un%20domicilio!"
        target="_blank"
      >
        <Fab
          color="primary"
          aria-label="add"
          style={{
            position: "fixed",
            right: 0,
            bottom: 0,
            marginRight: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <WhatsAppIcon color="success" fontSize="large" />
        </Fab>
      </a>
      {getComponentMenu()}
      <div className="bottom-0 relative">
        <Footer />
      </div>
    </div>
  );
}
