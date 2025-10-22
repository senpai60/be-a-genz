import { AiFillPlusCircle } from "react-icons/ai";

function ButtonSaveWord({handleClick}) {
  return (
    <button>
        <AiFillPlusCircle className="mr-2" onClick={()=>{handleClick()}} />
    </button>
  )
}

export default ButtonSaveWord