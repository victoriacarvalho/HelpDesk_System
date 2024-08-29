
import Hero from "../components/Hero";
import Biography from "../components/Biography";

const Home = () => {
    return(
        <>
        <Hero title={"Bem vindo(a) ao Ticket+"} imageurl={"/frontend/public/hero.png"}/>
        <Biography imageUrl={"/about.png"} />

        </>
    );   
};

export default Home;