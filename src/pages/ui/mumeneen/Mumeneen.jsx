import TableComponent from "../../../components/table/TableComponent";
import Cookies from "js-cookie";

const Mumeneen = () => {
    // const mobileNumber = Cookies.get('mobile');
    const mobileNumber = '+911234567891'
    return (
        <>
            <TableComponent mobileNumber={mobileNumber} />

        </>
    )
}
export default Mumeneen;