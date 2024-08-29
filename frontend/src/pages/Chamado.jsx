
import Hero from "../components/Hero";
import ChamadoForm from "../components/ChamadoForm";

const Chamado = () => {
  return (
    <>
      <Hero
        title={"Abertura de chamados"}
        imageUrl={"/signin.png"}
      />
      <ChamadoForm/>
    </>
  );
};

export default Chamado;