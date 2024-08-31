/* eslint-disable no-unused-vars */

import Hero from "../components/Hero";
import Biography from "../components/Biography";
import MessageForm from "../components/MessageForm";

const Home = () => {
    return(
        <>
        <Hero title={"Bem vindo(a) ao Ticket+"} imageurl={"/frontend/public/hero.png"}/>
        </>
    );   
};

export default Home;