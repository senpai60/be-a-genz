import { AiFillPlusCircle } from "react-icons/ai";

// 1. Accept 'disabled' prop
function ButtonSaveWord({ handleClick, disabled }) {
  return (
    <button
      onClick={handleClick}
      // 2. Apply 'disabled' prop
      disabled={disabled}
      // 3. Add disabled styling
      className="disabled:opacity-30 disabled:cursor-not-allowed"
    >
        <AiFillPlusCircle className="mr-2" />
    </button>
  )
}

export default ButtonSaveWord