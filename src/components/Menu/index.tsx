import { Button, Fab, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#ca750c",
          },
        },
      },
    },
  },
});

export default function Menu({ setMenu, items }: { setMenu: any; items: any }) {
  const [itemParents, setItemParents] = useState([]);
  const [types, setTypes] = useState([]);
  const [data, setData] = useState([]);
  const [images, setImages] = useState<string[]>([]);

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

  function getImages() {
    switch (items.type) {
      case "Hamburguesas":
        setImages([
          "carne.jpeg",
          "pollo.jpeg",
          "doble carne.jpeg",
          "mixta.jpeg",
          "texana.jpeg",
          "ranchera.jpeg",
          "criolla.jpeg",
          "hawaiana.jpeg",
          "lomo.jpeg",
          "mexicana.jpeg",
          "costeña.jpeg",
        ]);
        break;
      case "Wraps":
        setImages(["carne.jpeg", "pollo.jpeg", "lomo.jpeg"]);
        break;
      case "Arroces":
        setImages(["oriental.jpeg", "paisa.jpeg", "griego.jpeg"]);
        break;
      case "Perros":
        setImages([
          "especial.jpeg",
          "mexicano.jpeg",
          "hawaiano.jpeg",
          "choriperro.jpeg",
        ]);
        break;
      case "Pastas":
        setImages(["lasagna.jpg", "lasagna.jpg", "pasta.jpg", "pasta.jpg"]);
        break;
      case "Platos Especiales":
        setImages([
          "churrasco.jpeg",
          "sobrebarriga.jpeg",
          "alitas.jpeg",
          "costillas.jpeg",
          "asada.jpeg",
          "gratinada.jpeg",
          "chuleta.jpeg",
          "lomo.jpeg",
          "mazorcada.jpeg",
          "mazorcada.jpeg",
          "patacon.jpeg",
          "patacon.jpeg",
        ]);
        break;
      case "Salchipapas":
        setImages([
          "salchipapa.jpeg",
          "salchipapa.jpeg",
          "salchipapa.jpeg",
          "salchipapa2.jpeg",
          "salchipapa2.jpeg",
          "cheddar.jpeg",
        ]);
        break;
      case "Pizzas":
        const arr = [];
        for (let i = 0; i < 20; i++) {
          arr.push("pizzas.jpeg");
        }
        setImages(arr);
        break;
      case "Panzeroti":
        const arr2 = [];
        for (let i = 0; i < 4; i++) {
          arr2.push("panzeroti.jpeg");
        }
        setImages(arr2);
        break;
      case "Acompañamientos":
        setImages([
          "papa.jpeg",
          "aros.jpeg",
          "yuca.jpeg",
          "cascos.jpeg",
          "espiral.jpeg",
        ]);
        break;
      case "Jugos Naturales":
        setImages([
          "fresa.jpeg",
          "guanabana.jpeg",
          "lulo.jpeg",
          "maracuya.jpeg",
          "freijoa.jpeg",
          "mora.jpeg",
          "limonada.jpeg",
        ]);
        break;
      case "Cervezas":
        setImages([
          "corona.jpg",
          "heineken.jpg",
          "artesanal.jpg",
          "andina.jpg",
          "sol.jpg",
        ]);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    listItems();
    getImages();
  }, []);

  return (
    <div className="bg-[#f2f2f2] flex flex-wrap justify-center gap-4 pt-[138px] px-6 pb-8">
      {itemParents.length > 0 && (
        <>
          {getTitles().title1.length > 0 && (
            <h2 className="text-[#ca750c] w-full text-center text-3xl font-bold">
              {getTitles().title1}
            </h2>
          )}
          <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
            {itemParents?.map((i: any, index: any) => {
              return (
                <div
                  className={`w-full flex flex-wrap border rounded-xl justify-center py-4 px-4 ${
                    i.stock ? " border-black" : " border-[#dd0000]"
                  }`}
                  key={index}
                >
                  {items.type === "Acompañamientos" ||
                    (items.type === "Cervezas" && (
                      <img
                        className="h-40 w-40 rounded-full"
                        src={
                          i.img?.length > 0
                            ? "https://lh3.googleusercontent.com/d/" + i.img
                            : "assets/Default_icon.jpg"
                        }
                        alt={`assets/${items.type.toLowerCase()}/${
                          images[index]
                        }`}
                      />
                    ))}
                  <h3 className="text-[#ca750c] w-full text-center font-bold text-xl mt-4">
                    {i.name}
                  </h3>
                  <p className="text-black w-full text-center text-sm">
                    {i.description}
                  </p>
                  {i.stock ? (
                    <div className="text-[#008100] flex place-self-center font-bold mt-4">{`$${i.price.toFixed(
                      2
                    )}`}</div>
                  ) : (
                    <div className="text-[#dd0000] flex place-self-center font-bold mt-4">
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
          {getTitles().title2.length > 0 && (
            <h2 className="text-[#ca750c] w-full text-center text-3xl font-bold">
              {getTitles().title2}
            </h2>
          )}
          <main className="flex w-screen justify-center flex-wrap pb-4 pt-4 gap-6">
            {types?.map((i: any, index: any) => {
              return (
                <div
                  className={`w-full flex flex-wrap border rounded-xl justify-center py-4 px-4 ${
                    i.stock ? " border-black" : " border-[#dd0000]"
                  }`}
                  key={index}
                >
                  {images.length > 0 && (
                    <img
                      className="h-40 w-40 rounded-full"
                      src={
                        i.img?.length > 0
                          ? "https://lh3.googleusercontent.com/d/" + i.img
                          : "assets/Default_icon.jpg"
                      }
                      alt={`assets/${items.type.toLowerCase()}/${
                        images[index]
                      }`}
                    />
                  )}
                  <h3 className="text-[#ca750c] w-full text-center font-bold text-xl mt-4">
                    {i.name}
                  </h3>
                  <p className="text-black w-full text-center text-sm">
                    {i.description}
                  </p>
                  {i.stock ? (
                    !i.price && (
                      <div className="text-[#008100] flex place-self-center font-bold mt-4">
                        Disponible
                      </div>
                    )
                  ) : (
                    <div className="text-[#dd0000] flex place-self-center font-bold mt-4">
                      Agotado
                    </div>
                  )}
                </div>
              );
            })}
          </main>
        </>
      )}
      {data.map((i: any, index: any) => {
        return (
          <div
            className={`w-full flex flex-wrap border rounded-xl justify-center py-4 px-4 ${
              i.stock ? " border-black" : " border-[#dd0000]"
            }`}
            key={index}
          >
            {images.length > 0 && (
              <img
                className="h-40 w-40 rounded-full"
                src={
                  i.img?.length > 0
                    ? "https://lh3.googleusercontent.com/d/" + i.img
                    : "assets/Default_icon.jpg"
                }
                alt={`assets/${items.type.toLowerCase()}/${images[index]}`}
              />
            )}
            <h3 className="text-[#ca750c] w-full text-center font-bold text-xl mt-4">
              {i.name}
            </h3>
            <p className="text-black w-full text-center text-sm">
              {i.description}
            </p>
            {i.stock ? (
              <div className="text-[#008100] flex place-self-center font-bold mt-4">{`$${i.price.toFixed(
                2
              )}`}</div>
            ) : (
              <div className="text-[#dd0000] flex place-self-center font-bold mt-4">
                Agotado
              </div>
            )}
          </div>
        );
      })}
      <div>
        <Fab
          onClick={() => {
            setMenu(0);
          }}
          color="primary"
          style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            marginLeft: "1.5rem",
            marginBottom: "1.5rem",
            background: "white",
          }}
        >
          <ArrowBackIcon color="success" fontSize="large" />
        </Fab>
      </div>
    </div>
  );
}
