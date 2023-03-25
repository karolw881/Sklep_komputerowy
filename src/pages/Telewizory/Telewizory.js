import NavBar from "../../Index-components/Navbar";
import Categories from "../../Index-components/Categories";
import Footer from "../../Index-components/Footer";
import Products from "../../Index-components/Products";

const Telewizory = () => {
    return ( 
        <>
        <NavBar />
            <Categories />
            <Products kategoria={"Telewizory"}/>
            <Footer/>
        </>
    );
}
 
export default Telewizory;