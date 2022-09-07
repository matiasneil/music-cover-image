function ColorSelect(props) {
  return (
    <div className="is-flex is-justify-content-center mb-5">
      {props.palette.length > 0 &&
        props.palette.map((color, i) => (
          <div
            key={i}
            style={{
              backgroundColor: color,
              height: "50px",
              width: "50px",
              border: props.selectedColor === color ? "4px solid" : "0px",
            }}
            onClick={() => props.setBgColor(color)}
          ></div>
        ))}
    </div>
  );
}

export default ColorSelect;
