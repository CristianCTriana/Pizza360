"use client";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Footer from "@/components/footer";
import { Button, Skeleton } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [menu, setMenu] = useState(0);
  const [csvData, setCsvData] = useState();

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
        if (el[1] === "") return el[0];
        return el;
      });

    return formatData(rowsFil);
  }

  function formatData(array: any) {
    const data = [];
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

    console.log({ data });
    return data;
  }

  const getComponentMenu = () => {
    if (menu > 0) {
      return <Menu setMenu={setMenu} items={csvData[menu - 1]} />;
    }

    return (
      <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
        {csvData.map((m, index) => {
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

  if (!csvData)
    return <Skeleton variant="rectangular" width={210} height={118} />;

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
