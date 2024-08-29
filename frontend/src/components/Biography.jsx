// eslint-disable-next-line react/prop-types
const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={"/whoweare.png"} alt="whoweare"className="animated-image" />
        </div>
        <div className="banner">
          <p><b>Sobre nós</b></p>
          <p>
          Conheça a Ticket+, a mais nova solução em gerenciamento de chamados 
          para suporte técnico. Lançada em 2024, nossa empresa está aqui para
          transformar a forma como você lida com solicitações de suporte. 
          Utilizando um sistema inteligente e intuitivo, a Ticket+ oferece uma 
          plataforma robusta para gerenciar e resolver chamados de forma rápida 
          e eficiente.
          </p>
        </div>
      </div>
    </>
  );
};

export default Biography;