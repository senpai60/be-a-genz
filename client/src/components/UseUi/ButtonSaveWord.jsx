import { AiFillPlusCircle } from "react-icons/ai";

function ButtonSaveWord({handleClick}) {
  return (
    <button
    onClick={handleClick}
    >
        <AiFillPlusCircle className="mr-2" />
    </button>
  )
}

export default ButtonSaveWord