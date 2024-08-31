/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p><b>Sua Solução para Gerenciamento de Suporte! </b></p>
          <p>
          Nós da <b>Ticket+</b>, estamos comprometidos em oferecer uma plataforma de gerenciamento 
          de tickets eficiente e intuitiva que simplifica a forma como você lida 
          com solicitações de suporte e atendimento ao cliente. Nossa missão é 
          transformar a experiência de suporte ao cliente, tornando-a mais <b>ágil, 
          organizada e eficaz.</b>
          </p>
        </div>
        <div className="banner">
          <img src={"/hero.png"} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector"  width="700" height="600" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
