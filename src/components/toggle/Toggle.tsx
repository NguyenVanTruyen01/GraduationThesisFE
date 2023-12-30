
interface ToggleProps {
  on: boolean,
  onClick: () => void
}

const Toggle: React.FC<ToggleProps> = ({ on, onClick, ...rest }) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={on}
        onClick={onClick}
        className="hidden-input"
        onChange={() => { }}
      />
      <div
        className={`inline-block w-[50px] h-[26px] relative cursor-pointer rounded-full p-1 transition-all ${on ? "bg-emerald-500" : "bg-gray-300"
          }`}
        {...rest}
      >
        <span
          className={`transition-all w-[17px] h-[17px] bg-white rounded-full inline-block ${on ? "translate-x-[28px]" : ""
            }`}
        ></span>
      </div>
    </label>
  );
};

export default Toggle;
