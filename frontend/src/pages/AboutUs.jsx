import Hero from "../components/Hero";
import Biography from "../components/Biography";

const AboutUs = () => {
  return (
    <>
      <Hero title={"Ticket+"} imageUrl={"/whoweare.png"}
      />
      <Biography imageUrl={"/sobrenos.png"}/>
    </>

  );
};

export default AboutUs;