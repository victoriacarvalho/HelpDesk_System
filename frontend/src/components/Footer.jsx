import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className={"container"}>
        <hr />
        <div className="content">
          <div>
          <img src="/logo.png" alt="Logo" style={{ height: 300 }} />
          </div>
          <div>
            <h4> Redes sociais</h4>
            <ul>
              <Link to={"/"}>Home</Link>
              <Link to={"https://www.linkedin.com/in/victoriacarvalho7"}>Victoria Carvalho</Link>
              <Link to={"http://www.linkedin.com/in/mariacarolina-galarani"}>Maria Carolina</Link>
              <Link to={"https://br.linkedin.com/in/lauracsoares"}>Laura Chaves</Link>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;