import { useReducer } from "react";
import "./style.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "CHOOSE",
  CLEAR: "CLEAR",
  EVALUATE: "EVALUATE",
  DELETE_DIGIT: "DELETE-DIGIT",
};

const evaulate = ({ currentOprand, previousOprand, operation }) => {
  const prev = parseFloat(previousOprand);
  const current = parseFloat(currentOprand);
  console.log("er");
  if (isNaN(prev) || isNaN(current)) return "";
  console.log("hshfdlks");
  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "%":
      computation = prev % current;
      break;
  }
  return computation.toString();
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOprand: payload.digit,
          overwrite: false,
        };
      }
      if (state.currentOprand === "0" && payload.digit === "0") return state;
      if (payload.digit === "." && state.currentOprand.includes("."))
        return state;
      return {
        ...state,
        currentOprand: `${state.currentOprand || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOprand == null && state.previousOprand == null) {
        return state;
      }
      if (state.currentOprand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOprand == null)
        return {
          ...state,
          operation: payload.operation,
          previousOprand: state.currentOprand,
          currentOprand: null,
        };
      return {
        ...state,
        previousOprand: evaulate(state),
        operation: payload.operation,
        currentOprand: null,
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOprand == null ||
        state.previousOprand == null
      )
        return state;

      return {
        ...state,
        overwrite: true,
        previousOprand: null,
        currentOprand: evaulate(state),
        operation: null,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOprand: null,
        };
      }
      if (state.currentOprand == null) return state;
      if (state.currentOprand.length == 1)
        return {
          ...state,
          currentOprand: null,
        };
      return { ...state, currentOprand: state.currentOprand.slice(0, -1) };
  }
}

const Integer_formatter = new Intl.NumberFormat("en-us", {
  maximumFractionsDigit: 0,
});

function formartOperand(operand) {
  if (operand == null) return;
  const [integer, decminal] = operand.split(".");
  if (decminal == null) return Integer_formatter.format(integer);
  return `${Integer_formatter.format(integer)}.${decminal}`;
}

const App = () => {
  const [{ currentOprand, previousOprand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formartOperand(previousOprand)} {operation}
        </div>
        <div className="current-operand">{formartOperand(currentOprand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
};

export default App;
