/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const Biography = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
          Se você quiser adicionar mais informações ou esclarecer algo para o técnico,
          por favor, envie uma mensagem com os detalhes adicionais. 
          Sua colaboração ajuda a resolver o chamado mais rapidamente!
          </p>
        </div>
        <div className="banner">
          <img src={"/contact.png"} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Biography;
