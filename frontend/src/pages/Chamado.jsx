
import Hero from "../components/Hero";
import ChamadoForm from "../components/ChamadoForm";

const Chamado = () => {
  return (
    <>
      <Hero
        title={"Abertura de chamados"}
        imageUrl={"/conctact.png"}
      />
      <ChamadoForm/>
    </>
  );
};

export default Chamado;